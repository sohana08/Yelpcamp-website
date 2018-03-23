var express    =require("express"),
    app        =express(),
    bodyParser =require("body-parser"),
    mongoose   =require("mongoose"),
    flash      =require("connect-flash"),
    passport   =require("passport"),
    localStrategy=require("passport-local"),
    methodOverride=require("method-override"),
    Campground =require("./models/campground"),
    Comment    =require("./models/comment"),
    User       =require("./models/user"),
    seedDB     =require("./seeds");

//REQUIRING ROUTES    
var commentRoutes     =require("./routes/comments");
var campgroundRoutes  =require("./routes/campgrounds");
var authRoutes        =require("./routes/index");
    
    
   
    mongoose.connect("mongodb://localhost/yelp_camp_v11");
    app.use(bodyParser.urlencoded({extended: true}));
    app.set("view engine","ejs");
    app.use(express.static(__dirname+"/public"));
    app.use(methodOverride("_method"));
    app.use(flash());
    
     // seedDB();

//PASSPORT CONFIGURATION
app.use(require("express-session")({
  secret: "I love Harry",
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req,res,next){
  res.locals.currentUser= req.user;
  res.locals.error=req.flash("error");
  res.locals.success=req.flash("success");
  next();
});

app.use(authRoutes);
app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments",commentRoutes);



app.listen(process.env.PORT,process.env.IP,function(){
  console.log("server started"); 
});