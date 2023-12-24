const mongoose = require('mongoose')
const Schema = mongoose.Schema

const userSchema = new Schema({
    userName:{
        type:String,
        required:true,
        minlength:4
    },
    password:{
        type:String,
        required:true,
        minlength:6,        
    },
    email:{
        type:String,
        required:true,
        unique:true,

    },
    status:{
        type: String,
        enum: ["member", "normal"],
        default: "normal", 
        required: true
    },
    admin:{
        type:Boolean,
        default:false,
        required:true
    }
})

module.exports = mongoose.model('User' , userSchema)
