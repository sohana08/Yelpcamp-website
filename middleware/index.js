var Campground=require("../models/campground");
var Comment=require("../models/comment");

var middlewareObj={};

//check if user is logged in or not
middlewareObj.isLoggedIn=function(req,res,next){
    if(req.isAuthenticated()){
     return next();
  }
  req.flash("error","You need to be logged in to do that");
  res.redirect("/login");
 
}

//can do some edit if only the user owns that picture 
middlewareObj.checkCampgroundOwnership=function(req,res,next){
    if(req.isAuthenticated()){
         Campground.findById(req.params.id,function(err,foundCampground){
        if(err){
            req.flash("error","campground not found");
            res.redirect("back");
        }else{
            if(foundCampground.author.id.equals(req.user._id)){
                next();
            }else{
                req.flash("error","You dont have permission to do that");
                res.redirect("back");
            }
             
        }
    });
    }else
    {
        req.flash("error","You need to logged in first");
        res.redirect("back");
    }
   
}

//can edit a comment only if he/she owns that comment
middlewareObj.checkCommentOwnership=function(req,res,next){
      if(req.isAuthenticated()){
             Comment.findById(req.params.comment_id,function(err,foundComment){
            if(err){
                res.redirect("back");
            }else{
                if(foundComment.author.id.equals(req.user._id)){
                    next();
                }else{
                    req.flash("error","You need to be logged in first");
                    res.redirect("back");
                }
                 
            }
        });
        }else
        {
            req.flash("error","You need to be logged in first");
            res.redirect("back");
    
        }
}

module.exports=middlewareObj;