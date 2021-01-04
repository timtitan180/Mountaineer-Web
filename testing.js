


const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');

const app = express();

app.use(express.static('public'));

app.set('view engine','ejs');

app.use(bodyParser.urlencoded({extended:true}));

app.use(bodyParser.json());

const port = 7012;

const db = mongoose.connection;

mongoose.connect("mongodb+srv://timtudosa18:Snake150!@first-cluster.fz0ml.mongodb.net/authenticationdb?retryWrites=true&w=majority",{useNewUrlParser:true,useUnifiedTopology:true},()=>{
  db.on('error',(err)=>{
    if(err) {
      console.log(err);
    }
    console.log("MONGODB is connected!");
  });
});
   

//Add a schema that has a username object, password object and email object
UserSchema = new mongoose.Schema({
  username:{type:String},
  email:{type:String},
  password:{type:String},

});

const User = new mongoose.model('User',UserSchema);

app.use(express.static(path.join(__dirname,'public')));

app.get('/',(req,res)=>{
  res.render("mainpage.ejs");
});

app.get('/signup',(req,res)=>{
    res.render("form-signup.ejs");
});


app.post('/signup',function(request,response) {
  //get access to the input fields(username,password,email)
  var username = request.body.username;
  var password = request.body.password;
  var email = request.body.email;
  var errors = [];
  const newUser = new User({username:username,password:password,email:email});
      newUser.save((err)=>{
        if(err) {
          console.log(err);
        }
        console.log("New User saved");
      });
  if(username.length == 0 || password.length == 0 || email.length == 0) {
    errors.push("Please input all fields");
  }

  if(password.length < 10) {
    errors.push("Password must be at least 10 characters long");
  }

  if(!email.includes("@")) {
    errors.push("Please enter a real email");
  }

  if(errors.length < 1) {
    console.log("Signing you up!"
    );
    res.redirect("/dashboard");
    try {
    newUser = new User({username:username,password:password,email:email});
    console.log("Account created successfuly");
    }
    catch(err) {
      console.log(err);
    }
  }
  response.redirect('dashboard.ejs');
});



app.get('/login',(req,res)=>{
  res.render("login.ejs");
});

app.post("/login",(req,res)=>{
    var username = req.body.username;
    var password = req.body.password;
    User.find({username:username,password:password},err=>{
      if(err) {
        console.log("Account does not match any on the database");
      }
      else {
        res.redirect("/dashboard");
      }
    });

});


app.listen(port,function(err){
  try {
    console.log(`Server listening on port${port}`);
  }

  catch(err) {
    console.log(`Cannot process request. Reason: ${err}`);
  }
});
