const mongoose = require('mongoose');
const shortid = require('shortid');

//Define a schema
const Schema = mongoose.Schema;

const TalentsSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    name: {
        type: String,
        trim: true,
        required: true,
    },
    description: {
        type: String,
        trim: true,
    },
    imgUrl: {
        type: Date,
        trim: true
    }
}, {
        timestamps: true,
        strict: false,
        versionKey: false
    });

module.exports = mongoose.model('Talents', TalentsSchema)