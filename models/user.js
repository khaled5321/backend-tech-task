const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    email:String,
    password:String,
    name: String,
    role:{
        type:String,
        enum:['Admin', 'Visitor', 'Author'],
        default: 'Visitor'
    },
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    thumbnail: String,
    facebook:String,
    twitter:String,
    articles:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Article"
        }
    ],
    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    papers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Paper"
        }
    ],
})

module.exports = mongoose.model('User',dataSchema)