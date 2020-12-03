const Customer = require("../models/customer.model.js");
const urllib = require("urllib");
const url = require("url");
const path = require("path");
require("dotenv").config();
const request = require("request");
const bcrypt = require("bcryptjs");
const saltRounds = 10;
const Validate = require("./validations");
const sql = require("../models/db");
const query_string = require("query-string");

// Registration logic
exports.registerUsers = async (req, res) => {
  await sql.query(
    "CREATE TABLE IF NOT EXISTS `gac_users`(`id` INT(11) NOT NULL AUTO_INCREMENT, `first_name` TEXT(1000) NOT NULL, `last_name` TEXT(100) NOT NULL, `number` TEXT(1000) NOT NULL, `email` TEXT(1000) NOT NULL, `password` text(1000) NOT NULL, `otp` int(11) NOT NULL, `verified` text(1000) NULL, PRIMARY KEY(`id`))"
  );
  let emailUrl = "otpCheck";
  let otp, hashPassword;
  let { error } = Validate(req.body);
  if (error) {
    req.flash("Regerror", `${error.details[0]["message"]}`);
    res.redirect("back");
  } else {
    const { id, firstName, lastName, phone, email, password } = req.body;
    console.log(req.body);
    await Customer.validateViaEmail(req.body.email, async (err, emailData) => {
      if (err) {
        req.flash("Regerror", "Network error try again");
        res.redirect("back");
      }

      if (emailData.email && emailData.email == req.body.email) {
        req.flash("Regerror", "This Email already exist !");
        res.redirect("back");
      } else {
        await bcrypt.hash(password, saltRounds, function (err, hash) {
          hashPassword = hash;
          otp = Math.round(Math.random() * 100000000);
          const customer = new Customer({ 
            id: id,
            first_name: firstName,
            last_name: lastName,
            number: phone,
            email: email,
            password: hashPassword,
            otp: otp,
          });
          Customer.registerUsers(customer, (err, data) => {
            if (err) {
              req.flash("Regerror", "Network error try again");
              res.redirect("back");
            } else {
              req.flash("success", "Your Registration was successful");
              res.render("dashboard", {
                isAuthenticated: req.isAuthenticated(),
                error: req.flash("Regerror"),
                success: req.flash("success"),
              });
            }
          });
        });
      }
    });
  }
  // res.redirect('back')
};

exports.usersProfile = (req, res) => {
  let userID = req.user.user_id;
  // console.log(userID)
  Customer.usersDashboard(userID, (err, result) => {
    // console.log(result)
    if (err) {
      req.flash("error", "Network Error, try again");
      res.redirect("back");
    } else {
      res.render("dashboard", {
        results: result,
        userID,
        isAuthenticated: req.isAuthenticated(),
      });
    }
  });
};

exports.logout = (req, res) => {
  req.logout();
  req.session.destroy();
  res.redirect("/");
};
