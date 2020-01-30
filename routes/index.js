/* eslint-disable max-len */
const express = require("express");
const router = express.Router();
const upload = require("../utils/multer");
const loginMiddleware = require("./../middlewares/login-middleware");

// Todo: change the collegeAdminList to proper name
const collegeAdminList = require("../services/college");
const college = require("../database/models/college");

/**
 *  GET /
 *  return login page.
 **/
router.get("/", function(req, res) {
	res.render("login", {title: "login | cDent", layout: false});
});

/**
 * GET /login
 * return login page
 **/

router.get("/login", function(req, res) {
	res.render("login", {title: "login | cDent", layout: false});
});

/**
 * GET /register
 * return register page
 */
router.get("/register", (req, res) => {
	res.render("register", {
		title: "Register | cDent",
		key: process.env.RECAPTCHA_KEY,
	});
});

//  POST /register for register the college
router.post("/register", upload.single("file"), async (req, res) => {
	const rVal = {};

	try {
		await collegeAdminList.register(req, res);
		rVal.message = "Registration is Done Successful";
		rVal.code = 200;
	} catch (error) {
		rVal.message = error.message;
		rVal.code = 402;
	}
	console.log(rVal);
	res.render("register", {
		response: rVal,
		title: "Register",
		key: process.env.RECAPTCHA_KEY,
	});
});

// GET url with unique string for activated/accepted college
router.get("/account/create/:uniqueString", async (req, res) => {
	try {
		if (req.params.uniqueString) {
			await collegeAdminList.checkExists(req);
			res.render("create_password", {
				title: "Create Password",
				key: process.env.RECAPTCHA_KEY,
				uniqueString: req.params.uniqueString,
			});
		} else {
			throw new Error("Invalid access");
		}
	} catch (e) {
		res.render("404.hbs", {message: e.message});
	}
});

// POST /account/create/uniqueString register with password and return login page
router.post("/account/create/:uniqueString", async (req, res) => {
	try {
		await collegeAdminList.setPassword(req, res);
		res.render("login", {message: "successfully created the password"});
	} catch (e) {
		res.render("create_password", {
			error: e.message,
			title: "Create Password",
			key: process.env.RECAPTCHA_KEY,
			uniqueString: req.params.uniqueString,
		});
	}
});

// College dashboard starts here
router.get("/:college_name", async (req, res) => {
	const collegeName = req.params.college_name;
	try {
		await college.getcollegeDB(collegeName);
		res.render("login", {college: collegeName, layout: false});
	} catch (e) {
		res.render("404", {message: e.message});
	}
});

router.post("/:college_name", async (req, res) => {
	const collegeName = req.params.college_name;

	try {
		const collegeDB = await college.getcollegeDB(collegeName);
		await collegeAdminList.login(req, res, collegeDB);
		// res.send({msg: "Your an admin"});
	} catch (e) {
		console.log(e);
		// res.status(401).send({error: e.message});
		res.render("login", {
			college: collegeName,
			errMsg: e.message,
			email: req.body.email,
			layout: false,
		});
		//	Todo Work on catch function
	}
});

router.get("/:college_name/dashboard", loginMiddleware, (req, res) => {
	res.render("dashboard");
});

module.exports = router;
