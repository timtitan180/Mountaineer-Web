


const express = require('express');
const mongoose = require('mongoose');
// require('dotenv').config();
const path = require('path');
const bodyParser = require('body-parser');
const expressSession = require('express-session');
const ejsLint = require('ejs-lint');
require('./model.js');

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:false}));

app.use(express.static(path.join(__dirname,"publicFolder")));

const passport = require('passport');

const LocalStrategy = require('passport-local');

const port = 7012;


mongoose.connect('mongodb://localhost:27017/mountaineerwebdb',{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{console.log("MONGODB Database is connected!")}).catch((err)=>{console.log(err)});

const db = mongoose.connection;

db.on("error", console.error.bind(console, "connection error: "));

db.once("open",() => {
  console.log("Connected successfully");
});

app.use(express.static(path.join(__dirname,'public')));

function firstNameandLastNameisValid(firstName,lastName) {
  return firstName.length > 0 && lastName.length > 0;
}


function UsernameisValid(username) {
  return username.length > 0;
}

function PasswordisValid(password) {
  return password.length > 0;
}

app.get('/',(req,res)=>{
  res.render("mainpage"); 
});

app.get('/error',(req,res)=>{
    res.render("error");
});

app.get('/signup',(req,res)=>{
    res.render("signup",{errors:[]});
});


app.post('/signup',function(req,res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var username = req.body.username;
  var password = req.body.password;
  var verifiedPassword = req.body.verifiedPassword;

  var errors = [];

  if(!firstNameandLastNameisValid(firstName,lastName)) {
    errors.push("Please enter your first name and last name");
  }

  if(!UsernameisValid(username)){
    errors.push("Please enter your username");
  }

  if(!PasswordisValid(password)){
    errors.push("Password must be at least 10 characters long");
  }

  if(password != verifiedPassword) {
    errors.push("Passwords do not match");
  }


  if(errors.length > 0) {
    console.log(errors);
    res.render("signup",{errors:errors});
    res.redirect('/signup');
  }
  else {
      const newUser = new User({firstName:firstName,lastName:lastName,username:username,password:password});
      newUser.save().then(()=>{console.log("User saved to database!")}).catch((err)=>{
      res.send("error.ejs");
      });
      console.log("Signing you up!"
      ); 
      res.render('dashboard',{name:req.body.firstName}); 
  }
});


//Login Route

app.get('/login',(req,res)=>{
  //using passport to authenticate user
  errors = [];
  passport.use(new LocalStrategy(
    function(username, password, done) {
      User.findOne({ username: username,password:password}, function (err, user) {
        if (err) {return done(err); }
        if (!user) {errors.push("Username or password is incorrect"); return done(null, false); }
        return done(null, user);
      });
    }
  ));
  res.render("login",{errors:errors});
});

app.post("/login", passport.authenticate('local',{
  failureRedirect:'/login',session:false}),(req,res)=>{
      var username = req.body.username;
      res.render("dashboard",{name:{username}});
    });

app.get('/dashboard',(req,res)=>{
  res.render("dashboard");
});

app.listen(process.env.PORT || port,function(err){
  try {
    console.log(`Server listening on port ${port}`);
  }

  catch(err) {
    console.log(`Cannot process request. Reason: ${err}`);
  }
});

module.export = app;