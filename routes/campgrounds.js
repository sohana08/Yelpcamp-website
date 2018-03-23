var express=require("express");
var router=express.Router();
var Campground=require("../models/campground");
var middleware=require("../middleware");

//INDEX- route
router.get("/",function(req,res){
  //get all campground from the database not the array
  Campground.find({},function(err,allCampgrounds){
      if(err){
          console.log("error");
      }else{
          res.render("campgrounds/index",{campgrounds: allCampgrounds,currentUser:req.user});
    
      }
  });
   
});   

//CREATE-route 
//can have same route as that of above route if it is of different request
router.post("/",middleware.isLoggedIn,function(req,res){
   
    //add data and retrieve data from the campground array
     var name=req.body.name;
     var price=req.body.price;
     var image=req.body.image;
     var desc=req.body.description;
     var author={
         id:req.user._id,
         username:req.user.username
     }
     var newCampground={name:name,price:price,image:image,description:desc,author:author};
    
    //create new campground and save to database
    Campground.create(newCampground,function(err,newlyCreated){
      if(err){
          console.log("error");
      } else{
          
        //   console.log(newlyCreated);
          //redirect back to campground page
          res.redirect("/campgrounds");
      }
    });
  
   
});



//NEW -route
router.get("/new",middleware.isLoggedIn,function(req,res){
    res.render("campgrounds/new");
});

//SHOW -route
router.get("/:id",function(req,res){
   
    Campground.findById(req.params.id).populate("comments").exec(function(err,foundCampground){
        if(err)
        {
            console.log(err);
        }else{
           
             res.render("campgrounds/show",{campground: foundCampground});
        }
    });
   
});

//EDIT CAMPGROUND Route
router.get("/:id/edit",middleware.checkCampgroundOwnership,function(req,res){
       Campground.findById(req.params.id,function(err,foundCampground){
           if(err){
               console.log(err);
           }else{
                res.render("campgrounds/edit",{campground:foundCampground}); 
           }
      
    });
 });

//UPDATE CAMPGROUND ROUTE
router.put("/:id",middleware.checkCampgroundOwnership,function(req,res){
    // var data={
    //     name:req.body.name,
    //     image:req.body.image,
    //     description:req.body.description
    // }
    Campground.findByIdAndUpdate(req.params.id,req.body.campground,function(err,foundCampground){
        if(err){
            res.redirect("/campgrounds");
        }else{
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//DESTROY CAMPGROUND ROUTE
router.delete("/:id",middleware.checkCampgroundOwnership,function(req,res){
    Campground.findByIdAndRemove(req.params.id,function(err){
       if(err){
          res.redirect("/campgrounds");
       }else{
           res.redirect("/campgrounds");
       }
    });
});

module.exports=router;