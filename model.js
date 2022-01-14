
const mongoose = require('mongoose');

UserSchema = new mongoose.Schema({
    firstName:{type:String},
    lastName:{type:String},
    username:{type:String},
    password:{type:String},
  
  });

  PostSchema = new mongoose.Schema(
    {
      id:{type:Number},
      title:{type:String},
      body:{type:String},
      date:{type:Date}

    }
  );

  User = new mongoose.model('User',UserSchema);
  Post = new mongoose.model('Post',PostSchema);

  module.export = User,Post;