const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const shortid = require('shortid');
const TokenGenerator = require('uuid-token-generator');

//Define a schema
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    _id: {
        type: String,
        unique: true,
        default: shortid.generate
    },
    firstName: {
        type: String,
        trim: true,
        required: false
    },
    lastName: {
        type: String,
        trim: true,
        required: false
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        trim: true,
        required: false
    },
    mobile: {
        type: String,
        trim: true,
        required: false
    },
    role: {
        type: String,
        uppercase: true,
        trim: true,
    },
    token: {
        type: String,
        required: false
    },
    imgUrl: {
        type: String,
        trim: true,
        required: false
    },
    gender: {
        type: String,
        trim: true,
        required: false
    },
    emailVerified: {
        type: Boolean,
        trim: true,
        default: false
    }

}, {
        timestamps: true,
        strict: false,
        versionKey: false
    });

UserSchema.pre('save', function (next) {
    this.password = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null);
    const authToken = new TokenGenerator(256, TokenGenerator.BASE62);
    this.token = authToken.generate();
    next();
});


module.exports = mongoose.model('User', UserSchema);