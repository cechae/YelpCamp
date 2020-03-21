var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	seedDB = require('./seeds');

// seedDB();

mongoose.connect('mongodb+srv://spicysos:978645zz@cluster0-sqgci.mongodb.net/test?retryWrites=true&w=majority');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static(__dirname + '/public'))
console.log(__dirname);
app.get('/', function (req, res) {
	res.redirect('/campgrounds');
});

// INDEX route
app.get('/campgrounds', function (req, res) {
	// get all campgrounds from DB
	Campground.find({}, function (err, allCampgrounds) {
		if (err) {
			console.log(err);
		} else {
			console.log(allCampgrounds);
			res.render('campgrounds/index', { campgrounds: allCampgrounds });
		}
	});

	// res.render("campgrounds", {campgrounds: campgrounds});
});

// NEW route - Show the form
app.get('/campgrounds/new', function (req, res) {
	res.render('campgrounds/new');
});

// CREATE route
app.post('/campgrounds', function (req, res) {
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
app.get('/campgrounds/:id', function (req, res) {
	//Find by ID
	// Campground.findById(req.params.id, function(err,body){
	//     if (err) {
	//         console.log("-------------------------------------------------------")
	//         console.log(err)
	//     }
	//     else {

	//         console.log(body)
	//         res.render("show", {campground:body})
	//     }
	// })
	Campground.findById(req.params.id).populate('comments').exec(function (err, foundCampground) {
		if (err) {
			console.log('error!', err);
		} else {
			console.log(foundCampground);
			res.render('campgrounds/show', { campground: foundCampground });
		}
	});
});

// ============================================================================================
//   Comments Routes
//=============================================================================================
app.get('/campgrounds/:id/comments/new', function (req, res) {
	Campground.findById(req.params.id, function(err,campground){
		if (err) console.log(err)
		else {
			res.render('comments/new', {campground: campground});
		}
	})
	
});

app.post('/campgrounds/:id/comments', function (req, res) {
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
	})
	
});

app.listen(3000, function () {
	console.log('YelpCamp server has started on PORT 3000!');
});
