const passport = require("passport");
const LocalStrategy = require('passport-local').Strategy;
const DBconnection = require("../models/db.js");
const bcrypt = require('bcryptjs');
const saltRounds = 10;
const Customer = require('../models/customer.model');
const Joi = require('joi')
function Validation(course) {
    let schema = Joi.object({
        email: Joi.string().max(100).required().email(),
        password: Joi.string().min(4).max(250).required()
    })
    let result = schema.validate(course)
    return result
}
passport.use('seekers', new LocalStrategy(
    async function (username, password, done) {
        let convertedPassword = parseInt(password);
        Customer.postOtpVerifications(username, (err, result) => {
            let { otp, id, verified } = result;
            if (err) { done(err) }
            if (convertedPassword === otp && verified === null) {
                Customer.updateVerified(id, "true", (error, update) => {
                    console.log(update);
                    console.log(update.id)
                    if (error) { done(error) }
                    return done(null, { user_id: id }, { message: "Welcome to" })
                })

            }
            else { return done(null, false, { message: "Incorrect or expired OTP code" }); }
        });
    }
));
passport.serializeUser(function (user_id, done) {
    done(null, user_id)
});
passport.deserializeUser(function (user_id, done) {
    done(null, user_id)
});




passport.use('login', new LocalStrategy(
    async function (username, password, done) {
        let obj = { email: username, password: password}
        let { error } = await Validation(obj);
        console.log(error)
        if (!error ) {
            await DBconnection.query('SELECT id, password FROM gac_users WHERE email = ?', [username], function (err, result, fields) {
                
                if (err) { done(err) }
                if (result.length === 0 || result === undefined) { return done(null, false, { message: "Incorrect email " }) }
                //if (result[0].verified !== "true") { return done(null, false, { message: "Kindly check your email for otp code" })}
                else {
                    const hash = result[0].password.toString();
                    console.log(hash)
                    bcrypt.compare(password, hash, function (err, response) {
                        console.log(response)
                        if (response === true) {
                            return done(null, { user_id: result[0].id }, { message: "Welcome to" });
                        }
                        else { return done(null, false, { message: "Incorrect Password" }) }
                    })
                }
            })
        } else { return done(null, false, { message: "Please enter valid input" })}

    }
))
passport.serializeUser(function (user_id, done) {
    done(null, user_id)
});
passport.deserializeUser(function (user_id, done) {
    done(null, user_id)
});

// Admin Login Functionality
passport.use("admin", new LocalStrategy(
    function (username, password, done) {
        DBconnection.query('SELECT id, email, password FROM admin WHERE email = ?', [username], function (err, result, fields) {
            if (err) { return done(err) }
            if (result.length === 0) {
                return done(null, false, { message: "Incorrect Email" });
            }
            else {
                const hash = result[0].password.toString();
                console.log(hash)
                bcrypt.compare(password, hash, function (err, response) {
                    console.log("Login response from passportRoute.js Line 90 ", response)
                    if (response === true) {
                        return done(null, { admin: result[0].id });
                    }
                    else { return done(null, false, { message: "Incorrect Password" }) }
                })
            }
        })
    }
))
passport.serializeUser(function (admin, done) {
    done(null, admin)
});
passport.deserializeUser(function (admin, done) {
    done(null, admin)

});


