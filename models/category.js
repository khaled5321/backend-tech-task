const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: String,
    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
    articles:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Article"
        }
    ],
    papers:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Paper"
        }
    ],

})

module.exports = mongoose.model('Category',dataSchema)