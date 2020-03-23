var express = require("express");
var router = express.Router({mergeParams:true});
var Campground = require("../models/campground");
var Comment = require("../models/comment");


// =============================================
//   Comments Routes
//==============================================

// Comments NEW
router.get('/new', isLoggedIn, function (req, res) {
	console.log(req.params.id) 
	Campground.findById(req.params.id, function(err,campground){
		if (err) console.log(err)
		else {
			res.render('comments/new', {campground: campground});
		}
	})
});
// Comments CREATE
router.post('/', isLoggedIn, function (req, res) {
	// Look up campground using ID
	Campground.findById(req.params.id, function(err,campground){
		if (err) {
			console.log(err);
			res.redirect("/campgrounds");
		}
		else {
			// create new comment
			
			Comment.create(req.body.comment, function(err, comment){
				if (err) {
					console.log(err)

				}else{
					//connect new comment to campgroound
					//redirect campground show page
					campground.comments.push(comment);
					campground.save();
					res.redirect(`/campgrounds/${campground._id}`)
				}
			});
		}
	});
});
// Middleware
function isLoggedIn(req,res,next){
	if (req.isAuthenticated()){
		return next();
	}
	res.redirect("/login");
}
module.exports = router;