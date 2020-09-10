const express        = require("express"),
    app              = express(),
    bodyParser       = require("body-parser"),
    mongoose         = require("mongoose"),
    flash       = require("connect-flash"),
    methodOverride   = require("method-override");
    passport         = require("passport"),
    LocalStrategy    = require("passport-local"),
    Campground       = require("./models/campground"),
    Comment          = require("./models/comment"),
    User             = require("./models/user"),
    seedDB = require("./seeds");

//requring routes
const commentRoutes    = require("./routes/comments"),
      campgroundRoutes = require("./routes/campgrounds"),
      indexRoutes      = require("./routes/index");

const url = process.env.DATABASEURL || "mongodb://localhost:27017/campsites";
mongoose.connect(url, {useNewUrlParser: true, useUnifiedTopology: true}).then(()=>{console.log("connected to DB!");}).catch(err =>{console.log('ERROR', err.message);});
// mongoose.connect("mongodb://localhost:27017/campsites", {useNewUrlParser: true, useUnifiedTopology: true});
app.use(bodyParser.urlencoded({extended: true}));
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/public"));
app.use(methodOverride("_method"));
app.use(flash());
// seedDB();  //seed the database

// PASSPORT CONFIGURATION
app.use(require("express-session")({
    secret: "Hello World!",
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
 });
    

app.use("/", indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


var port = process.env.PORT || 3000;
app.listen(port, function () {
  console.log("Server Has Started!");
});
// app.listen(3000, function(){
//    console.log("The YelpCamp Server Has Started!");
// });