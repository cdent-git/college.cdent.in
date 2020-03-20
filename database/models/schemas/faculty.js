const mongoose = require("mongoose");
const validator = require("validator");

const facultySchema = new mongoose.Schema({
	firstName: {
		type: String,
		required: true,
		trim: true,
	},
	lastName: {
		type: String,
		required: true,
		trim: true,
	},
	email: {
		type: String,
		required: true,
		unique: true,
		trim: true,
		validate: {
			validator: validator.isEmail,
			message: "{VALUE} is not a valid email address.",
		},
	},
	password: {
		type: String,
		required: true,
		unique: true,
	},
	phoneNo: {
		type: Number,
		required: true,
		trim: true,
	},
	department: {
		type: mongoose.ObjectId,
		ref: Department,
	},
});

module.exports = facultySchema;
