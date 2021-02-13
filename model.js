
const mongoose = require('mongoose');

UserSchema = new mongoose.Schema({
    firstName:{type:String},
    lastName:{type:String},
    username:{type:String},
    password:{type:String},
  
  });

  User = new mongoose.model('User',UserSchema);

  module.export = User;