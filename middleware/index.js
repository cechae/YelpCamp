var Campground = require("../models/campground")
var Comment = require("../models/comment")

// all middleware goes here.
var middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function(req,res,next){
	if (req.isAuthenticated()){
		// if logged in, does the user own this campground?
		Campground.findById(req.params.id, function(err,foundCampground){
			if (err) {
				req.flash("error", "Campground not found!")
				res.redirect("back")
			}
			else {
				// Added this block, to check if foundCampground exists, and if it doesn't to throw an error via connect-flash and send us back to the homepage
				if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
				// does the user own the campground?
				// NOTE: foundCampground.author.id is NOT a string, but Mongoose object.
				if (foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					req.flash("error", "You don't have permission to do that!")
					res.redirect("back")
				}
			}
		})
	} else {
		// if not, redirect back to where user came from.
		req.flash("error", "You need to be logged in to do that!")
		res.redirect("back");
	}
}
middlewareObj.checkCommentOwnership = function(req,res,next){
    
    if (req.isAuthenticated()){
        // if logged in, does the user own this comment?
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if (err) {
				req.flash("error", "You need to be logged in to do that!")
                res.redirect("back")
            }
            else {
				if (!foundCampground) {
                    req.flash("error", "Item not found.");
                    return res.redirect("back");
                }
                // does the user own the comment?
                // NOTE: foundComment.author.id is NOT a string, but Mongoose object.
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
					req.flash("error", "You do not have permission to do that!")
                    res.redirect("back")
                }
            }
        })
    } else {
        // if not, redirect back to where user came from.
        res.redirect("back");
    }
}

middlewareObj.isLoggedIn = function(req,res,next){
    if (req.isAuthenticated()){
		return next();
	}
	req.flash("error","You need to be logged in to do that!")
	// you need to add flash before the redirect!!
	res.redirect("/login");
}

module.exports = middlewareObj