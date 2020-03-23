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
router.get('/new', function (req, res) {
	res.render('campgrounds/new');
});

// CREATE route
router.post('/', function (req, res) {
	// get data from the form
	let n = req.body.name;
	let img = req.body.image;
	let des = req.body.description;
	// redirect back to campgrounds page
	let obj = { name: n, image: img, description: des };
	//create a new campground and save it to the mongodb
	Campground.create(obj, function (error, newlyCreated) {
		if (error) {
			console.log(error);
		} else {
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

module.exports = router;