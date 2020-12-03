module.exports = app => {
  const path = require("path");
  const customers = require("../controllers/customer.controller.js");
  const passport = require("passport");
  function autheticationMiddleware() { return (req, res, next) => { if (req.isAuthenticated()) return next(); res.redirect('/'); } }
  require("./passport.routes.js");
  // Home page
  app.get("/", (req, res)=>{res.render('index', {isAuthenticated: req.isAuthenticated()})});
  
  app.get("/music", (req, res)=>{res.sendFile(path.join(__dirname, '../../views/music.html'))});
  
  app.get("/artcle", (req, res)=>{res.render("artcle", {isAuthenticated: req.isAuthenticated()})});
  
  app.get("/mental", (req, res)=>{res.sendFile(path.join(__dirname, '../../views/mental.html'))});
  
  app.get("/login", (req, res)=>{res.render("login", {LogError: req.flash("Regerror"), error: req.flash("error")})});
  
  app.get("/product", (req, res)=>{res.sendFile(path.join(__dirname, '../../views/product.html'))});
  
  app.get("/faq", (req, res)=>{res.sendFile(path.join(__dirname, '../../views/faq.html'))});
  
  app.get("/contact", (req, res)=>{res.sendFile(path.join(__dirname, '../../views/contact.html'))});
  
  app.get("/habit", (req, res)=>{res.sendFile(path.join(__dirname, '../../views/habit.html'))});
  
  app.post("/registerUsers", customers.registerUsers);

  app.get("/logout", customers.logout);

  // DashboardPa
  app.get("/dashboard", autheticationMiddleware(), customers.usersProfile);

  app.get("/visual", autheticationMiddleware(), (req, res)=> res.render("visual"));

  // Login Page
  app.post('/login', passport.authenticate('login', { successRedirect: '/dashboard', failureRedirect: 'back', failureFlash: true, successFlash: true }));

};