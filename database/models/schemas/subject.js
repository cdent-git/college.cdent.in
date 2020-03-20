const mongoose = require("mongoose");

const subjectSchema = new mongoose.Schema({
	name: {
		type: String,
		required: true,
		trim: true,
	},
	subjectCode: {
		type: String,
		required: true,
		trim: true,
	},
	credits: {
		type: Number,
		required: true,
		trim: true,
	},
});

module.exports = subjectSchema;
