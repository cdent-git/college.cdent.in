const mongoose = require("mongoose");

const departmentSchema = new mongoose.Schema({
	Name: {
		type: String,
		required: true,
		trim: true,
	},
	shortName: {
		type: String,
		required: true,
		unique: true,
		trim: true,
	},
	password: {
		type: String,
		required: true,
		unique: true,
	},
	phone_no: {
		type: Number,
		required: true,
		trim: true,
	},
	admin: {
		type: mongoose.ObjectId,
		ref: Faculty,
	},
	hod: {
		type: mongoose.ObjectId,
		ref: Faculty,
	},
});

module.exports = departmentSchema;
