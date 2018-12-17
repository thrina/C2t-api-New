const mongoose = require('mongoose');
const shortid = require('shortid');

//Define a schema
const Schema = mongoose.Schema;

const NewsSchema = new Schema({
	_id: {
		type: String,
		default: shortid.generate,
	},
	title: {
		type: String,
		trim: true,
		required: true,
	},
	description: {
		type: String,
		trim: true,
	},
	category: {
		type: String,
		trim: true,
	},
	date: {
		type: Date,
		trim: true
	},
	imgUrl: {
		type: Date,
		trim: true
	},
	status: {
		type: String,
		default: 'inActive',
		required: true,
		trim: true
	}
}, {
		timestamps: true,
		strict: false,
		versionKey: false
	});

module.exports = mongoose.model('News', NewsSchema)