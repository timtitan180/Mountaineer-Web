


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:false}));

const port = 7012;

const db = mongoose.connection;

mongoose.connect("mongodb+srv://timtudosa18:Snake150!@first-cluster.fz0ml.mongodb.net/authenticationdb?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true}).then(()=>{console.log("MONGODB Database is connected!")}).catch((err)=>{console.log(err)});
   
UserSchema = new mongoose.Schema({
  firstName:{type:String},
  lastName:{type:String},
  username:{type:String},
  password:{type:String},

});

const User = new mongoose.model('User',UserSchema);

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
  res.render("mainpage.ejs"); 
});

app.get('/signup',(req,res)=>{
    res.render("form-signup");
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


  if(errors.length < 1) {
    const newUser = new User({firstName:firstName,lastName:lastName,username:username,password:password});
    newUser.save().then(()=>{console.log("User saved to database!")}).catch((err)=>{
      console.log(err);
    });
    console.log("Signing you up!"
    );
    res.redirect('dashboard.ejs');
  }
  else {
      res.redirect("/signup");    
  }
});



app.get('/login',(req,res)=>{
  res.render("login.ejs");
});

app.post("/login",(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    User.find({username:username,password:password}).then(user=>{
      console.log(user);
      console.log("User is found. Signing you in...");
      res.redirect("/dashboard");
    }).catch((err)=>{
      console.log(err);
      res.redirect("/login");
    }); 

});

app.get('/dashboard',(req,res)=>{
  res.render("dashboard.ejs");
});


app.listen(port,function(err){
  try {
    console.log(`Server listening on port${port}`);
  }

  catch(err) {
    console.log(`Cannot process request. Reason: ${err}`);
  }
});
