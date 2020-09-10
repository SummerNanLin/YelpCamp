const middlewareObj = require("../middleware");

const express       = require("express"),
      router        = express.Router({mergeParams: true});
      Campground    = require("../models/campground"),
      Comment       = require("../models/comment"),
      middleware    = require("../middleware");

// NEW ROUTE for comments
router.get("/new", middleware.isLoggedIn, function(req, res){
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
        } else {
            console.log(foundCampground)
            //render show template with that campground
            res.render("comments/new", {campground: foundCampground});
        }
    });  
});

// CREATE ROUTE for comments
router.post("/", middleware.isLoggedIn, function(req, res){
    //lookup campground using ID
    Campground.findById(req.params.id, function(err, foundCampground){
        if(err){
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            Comment.create(req.body.comment, function(err, comment){
                if(err) {
                    console.log(err);
                }
                //add username and id to comment
                comment.author.id = req.user._id;
                comment.author.username = req.user.username;
                //save comment
                comment.save();

                foundCampground.comments.push(comment);
                foundCampground.save();
                res.redirect("/campgrounds/" + foundCampground._id);
            });
        }
    });
});

// EDIT - show edit form for an existing comment
router.get("/:comment_id/edit", middleware.checkCommentOwnership, function(req, res){
    Comment.findById(req.params.comment_id, function(err, foundComment){
        if(err){
            console.log(err);
            res.redirect("back");
        } else {
          res.render("comments/edit", {campground_id: req.params.id, comment: foundComment});
        }
    });
});

// UPDATE - update an existing comment.
router.put("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, comment){
        if(err){
            res.redirect("back");
        } else {
            //render show template with that campground
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

// DESTROY - delete an existing comment
router.delete("/:comment_id", middleware.checkCommentOwnership, function(req, res){
    Comment.findByIdAndRemove(req.params.comment_id, function(err){
        if(err){
            res.redirect("back");
        } else {            
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

module.exports = router;