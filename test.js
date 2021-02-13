
const assert = require("assert");

const mongoose = require('mongoose');
const { debugPort } = require("process");

const Schema = mongoose.Schema;

const testSchema = new Schema({name:{type:String,required:true}});



//Mongoose connection test

describe('Testing mongoose database',()=>{
    before(()=>{
        mongoose.connection(process.env.MONGO_URI,{useNewUrlParser:true,useUnifiedTopology:true});
        const db = mongoose.connection;
        db.on('errror',console.error.bind(console,'connection error'));
        db.once('open',()=>{
            console.log('connected to the database!');
        });
        console.log("This part executes once before all tests...");
    });
    after(()=>{
        console.log("This has been the test by mocha");
    });
});


//mongoose model test
describe('Test Database',()=>{


    var Name = new mongoose.model('Name',testSchema);
    var name = "John";
    var newName = new Name({name:name});
    newName.save((err)=>{
        if(err) {console.log(err)};
        console.log("Name: John has been saved");
    });
    it("Should be able to find name from the database",()=>{
        Name.find({name:name},(err,done)=>{
            if(err) {console.log("Test failed could not find specified name in the database..")}
            done();
        });
    });
    });


