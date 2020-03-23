var express = require("express");
var router = express.Router();
var passport = require('passport');
var User = require("../models/user");


//Root Route
router.get('/', function (req, res) {
	res.redirect('/campgrounds');
});
// =============================================
//   AUTH Routes
//==============================================
// show register form
router.get("/register", function(req,res){
	res.render("register")
});
// handle siginup logic
// here, we save the user first and then authenticate.
router.post("/register", function(req,res){
	var newUser = new User({username:req.body.username})
	User.register(newUser, req.body.password, function(err,user){
		if (err) {
			console.log(err);
			return res.render("register");
		}
		passport.authenticate("local")(req,res,function(){
			res.redirect("/campgrounds");
		})
	})
});

// show login form
router.get("/login", function(req,res){
	res.render("login");
});
// LOGIN route - handles login logic
// format here is app.post("/login", middleware, callback)
// here, we just run authentication.
router.post("/login", passport.authenticate("local", 
{
	successRedirect:"/campgrounds", 
	failureRedirect:"/login"
}), function(req,res){
	
});

// LOG OUT
router.get("/logout",function(req,res){
	req.logout();
	res.redirect("/campgrounds")
})

// Middleware
function isLoggedIn(req,res,next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
module.exports = router;