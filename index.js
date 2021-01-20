


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const ejsLint = require('ejs-lint');


const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:false}));

const port = process.env.PORT || 7012;

const db = mongoose.connection;

mongoose.connect("mongodb+srv://timtudosa18:Snake150!@first-cluster.fz0ml.mongodb.net/authenticationdb?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{console.log("MONGODB Database is connected!")}).catch((err)=>{console.log(err)});
   
//User fields that will be saved to the database using mongoose

UserSchema = new mongoose.Schema({
  firstName:{type:String},
  lastName:{type:String},
  username:{type:String},
  password:{type:String},

});

PostsSchema = new mongoose.Schema({
  Id:{type:Number},
  Posts:{type:String},
  Date:{type:Date,default:Date.now()}
});

const User = new mongoose.model('User',UserSchema);

const Post = new mongoose.model('Post',PostsSchema);

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
  res.render("mainpage"); 
});

app.get('/signup',(req,res)=>{
    res.render("form-signup",{errors:[]});
});


app.post('/signup',function(req,res) {
  var firstName = req.body.firstName;
  var lastName = req.body.lastName;
  var username = req.body.username;
  var password = req.body.password;
  var verifiedPassword = req.body.verifiedPassword;
  console.log(firstName.length);


  var errors = [];

  if(firstName.length == 0 || lastName.length == 0 || username.length == 0 || password.length == 0) {
    errors.push("Please input all fields");
  }

  if(password.length < 10) {
    errors.push("Password must be at least 10 characters long");
  }

  if(password != verifiedPassword) {
    errors.push("Passwords do not match");
  }


  if(errors.length > 0) {
    console.log(errors);
    res.render("form-signup",{errors:errors});
    res.redirect('/signup');
  }
  else {
      const newUser = new User({firstName:firstName,lastName:lastName,username:username,password:password});
      newUser.save().then(()=>{console.log("User saved to database!")}).catch((err)=>{
      console.log(err);
      });
      console.log("Signing you up!"
      );
      res.redirect("/dashboard");    
  }
});


//Login Route

app.get('/login',(req,res)=>{
  res.render("login.ejs",{errors:[ ]});
});

app.post("/login",(req,res)=>{
    var loginErrors = [];
    var username = req.body.username;
    var password = req.body.password;
    User.find((user,err)=>{
      if(!user) {
        console.log(err);
        loginErrors.push("Username or password does not exist");
        console.log(loginErrors);
        res.render('login',{errors:loginErrors});
        res.redirect('/login');
      }
      else {
        res.render('dashboard');
      }
    });

});

app.get('/dashboard',(req,res)=>{
  res.render("dashboard");
});



ejsLint("login.ejs");

app.listen(port,function(err){
  try {
    console.log(`Server listening on port${port}`);
  }

  catch(err) {
    console.log(`Cannot process request. Reason: ${err}`);
  }
});
