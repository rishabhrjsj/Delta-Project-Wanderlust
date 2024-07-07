const express = require("express");
const router = express.Router();
const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const flash = require("connect-flash");
const {saveRedirectUrl} = require("../middleware.js");

const userController = require("../controllers/users.js");


router.route("/signup")
.get(userController.renderSignupForm)//signup get
.post(wrapAsync(userController.signup));//signup post

router.route("/login")
.get(userController.renderLoginForm )//login get
.post(saveRedirectUrl, passport.authenticate("local", { failureRedirect: "/login", failureFlash: true }), userController.login );//login post


//logout get
router.get("/logout", userController.logout);

module.exports = router;
