var Campground = require("../models/campground")
var Comment = require("../models/comment")

// all middleware goes here.
var middlewareObj = {};
middlewareObj.checkCampgroundOwnership = function(req,res,next){
	if (req.isAuthenticated()){
		// if logged in, does the user own this campground?
		Campground.findById(req.params.id, function(err,foundCampground){
			if (err) {
				res.redirect("back")
			}
			else {
				// does the user own the campground?
				// NOTE: foundCampground.author.id is NOT a string, but Mongoose object.
				if (foundCampground.author.id.equals(req.user._id)){
					next();
				} else {
					res.redirect("back")
				}
			}
		})
	} else {
		// if not, redirect back to where user came from.
		res.redirect("back");
	}
}
middlewareObj.checkCommentOwnership = function(req,res,next){
    
    if (req.isAuthenticated()){
        // if logged in, does the user own this comment?
        Comment.findById(req.params.comment_id, function(err,foundComment){
            if (err) {
                res.redirect("back")
            }
            else {
                // does the user own the comment?
                // NOTE: foundComment.author.id is NOT a string, but Mongoose object.
                if (foundComment.author.id.equals(req.user._id)){
                    next();
                } else {
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
	res.redirect("/login");
}

module.exports = middlewareObj