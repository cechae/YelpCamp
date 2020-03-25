var express = require('express'),
	app = express(),
	bodyParser = require('body-parser'),
	mongoose = require('mongoose'),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	Campground = require('./models/campground'),
	Comment = require('./models/comment'),
	User = require("./models/user"),
	methodOverride = require("method-override"),
	seedDB = require('./seeds');

var commentRoutes = require("./routes/comments"),
	campgrounudRoutes = require("./routes/campgrounds"),
	authRoutes = require("./routes/index");

// seedDB();

// PASSPORT config
app.use(require("express-session")({
	secret: "Russ",
	resave: false,
	saveUninitialized: false
}));
app.use(methodOverride("_method"));

mongoose.connect('mongodb+srv://spicysos:978645zz@cluster0-sqgci.mongodb.net/test?retryWrites=true&w=majority');
app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs'); 
app.use(express.static(__dirname + '/public'))
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
	res.locals.currentUser = req.user;
	// this function will run for every route. 
	next();
});

app.use("/", authRoutes)
app.use("/campgrounds",campgrounudRoutes)
app.use("/campgrounds/:id/comments", commentRoutes)

app.listen(3000, function () {
	console.log('YelpCamp server has started on PORT 3000!');
});
