const rp = require("request-promise");
const crypto = require("crypto");
const loginHelper = require("./../../utils/login-helper");

const transporter = require("./mail-config");

exports.mailer = {
	sendTextMail: (to, subject, body, callback) => {
		const data = {
			from: "cDent Admin <admin@cdent.co.in>",
			to: to,
			subject: subject,
			text: body,
		};
		// console.log(data)
		transporter.sendMail(data, callback);
	},
};

// Google reCaptcha
exports.reCaptcha = async (req) => {
	const recaptcha = req.body["g-recaptcha-response"];

	const verificationURL = "https://www.google.com/recaptcha/api/siteverify";
	const postData = {
		secret: process.env.RECAPTCHA_SECRET,
		response: recaptcha,
	};
	const options = {
		method: "POST",
		uri: verificationURL,
		form: postData,
		json: true,
	};

	try {
		const response = await rp(options);
		if (response.success !== true) {
			return response["error-codes"];
		}
		return true;
	} catch (e) {
		return new Error(e);
	}
};

exports.sessions = async (req, user) => {
	await loginHelper.newLogin(req, user);
};

exports.createHash = (key) => {
	return crypto
		.createHash("sha512")
		.update(key, "utf8")
		.digest("hex");
};
