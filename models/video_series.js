const mongoose = require('mongoose');

const dataSchema = new mongoose.Schema({
    name: String,
    videos:[
        {
            type:mongoose.Schema.Types.ObjectId,
            ref:"Video"
        }
    ],
})

module.exports = mongoose.model('Series',dataSchema)