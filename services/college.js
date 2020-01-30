const crypto = require("crypto");

// Database models
const TempModel = require("../database/models/temp-model");
const AdminModelList = require("../database/models/adminList-model");
const college = require("../database/models/college");
const loginHelper = require("./../utils/login-helper");


// Utils
const Utils = require("./utils/index");

exports.checkExists = async (req) => {
	const uniqueString = req.params.uniqueString;
	console.log(uniqueString);
	if (!uniqueString) {
		throw new Error("Incorrect access.");
	}
	// Checking the unique String is exists in database
	const exists = await AdminModelList.exists({uniqueString});
	console.log(exists);
	if (!exists) {
		throw new Error("Invalid access");
	}
};

// Updating password for accepted college
exports.setPassword = async (req, res) => {
	const pwd = req.body.password;
	const rpwd = req.body.r_password;
	const shortName = req.body.short_name;

	// recaptcha to prevent bots.
	const response = await Utils.reCaptcha(req);
	console.log(response);
	// // Checking the response
	if (response !== true) {
		throw new Error(response);
	} else {
		if (pwd !== rpwd) {
			throw new Error("Passwords doesn't match");
		}
		// TODO Give some good responses back
		const uniqueString = req.params.uniqueString;
		try {
			const exist = await AdminModelList.exists({uniqueString});
			if (!exist) throw new Error("Invalid access");

			// find and update the password
			const admin = await AdminModelList.findOne({uniqueString});

			admin.password = Utils.createHash(pwd);
			admin.paid = false;
			admin.shortName = shortName;
			// admin.uniqueString = 1;
			const newAdmin = {
				role: admin.role,
				name: admin.name,
				email: admin.email,
				phone_no: admin.phone_no,
				collegeName: admin.collegeName,
				collegeAddr: admin.collegeAddr,
				collegeWebsite: admin.collegeWebsite,
				authLetterFile: admin.authLetterFile,
				accountValid: false,
				paid: false,
				password: Utils.createHash(pwd),
				shortName,
			};
			// eslint-disable-next-line no-mixed-spaces-and-tabs,new-cap,max-len
			await admin.save();
			// eslint-disable-next-line new-cap,max-len
			// creating the new database with db name = shortName
			const collegeDB = await college.createCollegeDB(shortName);
			const collegeAdmin = await college.getCollegeAdminModel(collegeDB);

			// saving the collegeAdmin info
			await new collegeAdmin(newAdmin).save();
		} catch (e) {
			throw new Error(e);
		}
	}
};

// eslint-disable-next-line valid-jsdoc
/**
 * @param req
 * @param res
 * @param collegeDB
 * @description check the password is correct then create a new session
 * @return admin data || Error
 * */
exports.login = async (req, res, collegeDB) => {
	const email = req.body.email;
	const pwd = req.body.password;
	const collegeName = req.params.college_name;

	try {
		// getModel() will return the model depending on the email;
		const Model = await getModel(email, collegeDB);
		// this function will check the password is correct and return user object
		const user = await Model.authenticate(email, pwd);
		await loginHelper.newLogin(req, user);
		res.redirect(`/${collegeName}/dashboard`);
	} catch (e) {
		console.log(e);
		throw new Error(e);
	}
};

exports.register = async (req, res) => {
	let tempModel;

	const response = await Utils.reCaptcha(req, res);
	// console.log(response);
	if (response !== true) {
		throw new Error(response);
	} else {
		const temp = await TempModel.find({
			email: req.body.email,
		});

		if (temp.length > 0) {
			throw new Error("Email address already exists");
		} else {
			tempModel = new TempModel({
				name: req.body.name,
				email: req.body.email,
				role: req.body.role,
				phone_no: req.body.phone_no,
				collegeName: req.body.clgName,
				collegeAddr: req.body.clgAddr,
				collegeWebsite: req.body.clgUrl,
				authLetterFile: req.file.location,
			});
			return tempModel.save();
		}
	}
};

const getModel = async (email, DB_NAME) => {
	const Model = await college.getCollegeAdminModel(DB_NAME);
	const exist = await Model.exists({email});
	if (exist) {
		return Model;
	}// else {
		// 	Model = await college.getDeptAdminModel(DB_NAME);
		// 	exist = await Model.exist({email});

		// 	if (exist) return Model;
		// 	else {
		// 		Model = await college.getFacultyModel(DB_NAME);
		// 		exist = await Model.exist({email});

	// 		if (exist) return Model;
	else {
		throw new Error("Email is not Valid");
	}
	// 	}
	// }
};
