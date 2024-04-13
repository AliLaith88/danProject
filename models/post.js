const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { DateTime } = require("luxon");

const postSchema = new Schema({
    authorID: {
        type: Schema.Types.ObjectId,
        ref: 'User',  
        required: true,
    }, 
    title:{
        type:String,
        required:true,
        minlength:1,
        maxlength:50
    },
    content:{
        type:String,
        required:true,
        minlength:1,
        maxlength:1000,
    },
    date:{
        type:Date,
        default:Date.now,
        required:true
    }
})

postSchema.virtual("date_formatted").get(function () {
    return DateTime.fromJSDate(this.date).toLocaleString(DateTime.DATE_MED);
  });

module.exports = mongoose.model('Post', postSchema)