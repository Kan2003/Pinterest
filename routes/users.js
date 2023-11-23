const mongoose = require('mongoose');
const plm = require('passport-local-mongoose')

mongoose.connect("mongodb://127.0.0.1:27017/onedb");

// Define the schema
const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
  },
  posts: [{
    type : mongoose.Schema.Types.ObjectId,
    ref : 'Post' 
  }],
  dp: String, // Assuming dp stands for display picture
  email: {
    type: String,
    required: true,
    unique: true
  },
  fullname: {
    type : String,
    required : true
  }
});
userSchema.plugin(plm);

// Create the User model
module.exports= mongoose.model('User', userSchema);

