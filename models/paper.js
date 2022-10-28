const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    squar_cover:String,
    rectangle_cover:String,
    categories:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category"
        }
    ],
    paragraphs:[
        {
            title:String,
            text:String
        }
    ],
    readsCount:Number,
    shareCount:Number
})

module.exports = mongoose.model('Paper',dataSchema)