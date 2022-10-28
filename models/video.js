const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: String,
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    squar_cover:String,
    rectangle_cover:String,
    youtube_url: String,
    summary:String,
    categories:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Category"
        }
    ],
    viewCount:Number,
    shareCount:Number
})

module.exports = mongoose.model('Video',dataSchema)