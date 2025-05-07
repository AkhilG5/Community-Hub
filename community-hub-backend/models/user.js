const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    points:{
        type:Number,
        default:0
    },
    transactions:[{
        type:{type:String},
        amount:Number,
        purpose:String,
        timestamp:{type:Date,default:Date.now},
        isAdmin: { type: Boolean, default: false },

    }],
    savedContent: [
        {
          url: String,
          title: String,
          source: String,
          savedAt: {
            type: Date,
            default: Date.now
          }
        }
      ],
      reportedContent: [
        {
          url: String,
          title: String,
          source: String,
          reportedAt: {
            type: Date,
            default: Date.now
          }
        }
      ],
      
});

module.exports = mongoose.model('User', userSchema);