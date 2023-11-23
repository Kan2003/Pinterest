var express = require('express');
var router = express.Router();

var userModel = require("./users")
var postModel = require("./post");
const  passport  = require('passport');
const upload = require('./multer');

const localStrategy = require('passport-local');
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});


router.get('/profile', isLoggedIn , async function(req, res, next) {
  const user = await userModel.findOne({
    username : req.session.passport.user // to find user data
  }).populate("posts")
  console.log(user)
  res.render("profile" , {user})
});


router.get('/login' , function(req, res, next) {
  // console.log(req.flash('error'));
  res.render('login' , {error : req.flash('error')});
});


router.get('/feed' , function(req, res, next) {
  res.render('feed');
});


router.post('/upload' , isLoggedIn ,upload.single('file') ,async  function(req, res, next) {
  
  if(!req.file){
    return res.status(404).send("No file were uploaded");
  }
  const user = await userModel.findOne({username : req.session.passport.user});
  const post = await postModel.create({
    image : req.file.filename,
    imageText : req.body.filecaption,
    user : user._id,
  });
  user.posts.push(post._id);
  await user.save();
  res.redirect("/profile");
});


router.post('/ragister' , function(req , res){
   var userdata = new userModel({
    username: req.body.username,
    email: req.body.email,
    fullname : req.body.fullname,
  });
  userModel.register(userdata , req.body.password)
  .then(function(ragistereduser){
    passport.authenticate("local")(req , res , function(){
      res.redirect('/profile')
    })
  })
});


router.post("/login" , passport.authenticate("local",{
  successRedirect: "/profile",
  failureRedirect: "/login",
  failureFlash : true
}) , function(req , res){ });



router.get('/logout' ,function(req , res){
  req.logOut(function(err){
    if(err) { return next(err); }
    res.redirect('/login');
  });
})



function isLoggedIn(req , res , next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}


module.exports = router;
