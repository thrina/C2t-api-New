const mongoose = require('mongoose');
const shortid = require('shortid');

//Define a schema
const Schema = mongoose.Schema;

const PortfolioSchema = new Schema({
    _id: {
        type: String,
        default: shortid.generate,
    },
    title: {
        type: String,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
    },
    talent: {
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

module.exports = mongoose.model('Portfolio', PortfolioSchema)