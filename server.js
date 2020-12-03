const express = require("express");
const cookie = require('cookie-parser');
const flash = require("connect-flash");
const bodyParser = require("body-parser");
const session = require("express-session");
const passport = require("passport");
const MySQLStore = require('express-mysql-session')(session);
var options = { host: 'localhost', user: 'root', database: 'goldenage', password: '' } //development database
const sessionStore = new MySQLStore(options);
const path = require("path");
const fileupload = require("express-fileupload");
const app = express();
require('dotenv').config();
app.use(fileupload({ createParentPath: true }));
app.use(flash());
app.use(session({ secret: 'keyboard cat', store: sessionStore, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(cookie());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, 'public'))); 
app.use(express.static(path.join(__dirname, 'public/JS'))); 
app.use(express.static(path.join(__dirname, 'public/css')))
// app.use(express.static(path.join(__dirname, '/')))
require("./app/routes/customer.routes.js")(app);
const PORT =  process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
module.exports = app