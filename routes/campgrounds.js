var express = require("express");
var router = express.Router();
var Campground = require("../models/campground")

// INDEX route
router.get('/', function (req, res) {
	// get all campgrounds from DB
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			res.render('campgrounds/index', { campgrounds: allCampgrounds});
		}
	});
});

// NEW route - Show the form
router.get('/new', isLoggedIn, function (req, res) {
	res.render('campgrounds/new');
});

// CREATE route
router.post('/', isLoggedIn, function (req, res) {
	// get data from the form
	let n = req.body.name;
	let img = req.body.image;
	let des = req.body.description;
	let author = {
		id: req.user._id,
		username: req.user.username
	}
	
	let newCampground = { name: n, image: img, description: des, author:author };
	
	//create a new campground and save it to the mongodb
	Campground.create(newCampground, function (error, newlyCreated) {
		if (error) {
			console.log(error);
		} else {
			console.log(newlyCreated)
			res.redirect('/campgrounds');
		}
	});
});
// SHOW - show more info about the campground.
router.get('/:id', function (req, res) {
	Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
		if (err) {
			console.log('error!', err);
		} else {
			res.render('campgrounds/show', { campground: foundCampground });
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