const loginHelper = require("./../utils/login-helper");

// Array of all URLs or matching regex that requires login to access
const protectedURLs = [
	"^\/[A-Za-z]+\/dashboard$",
];

// Map to URL/Regex to their access levels
const URLAllowedFor = {};
URLAllowedFor[protectedURLs[0]] = ["college-admin"];

const isAccessIsAllowed = (allowedAccessLevel, currentURLLevel) => {
	// TODO add proper access level check.
	return true;
};

// Check if user is logged IN and is accessing a page he/she is allowed to access
module.exports = async (req, res, next) => {
	const url = req.url;
	console.log(`Called login middleware for ${url}`);
	for (const str of protectedURLs) {
		if (str === url || url.match(str)) {
			console.log(`URL ${url} matched`);
			const loginData = await loginHelper.checkLogin(req);
			console.log("LoginData", loginData);
			if (loginData.loggedIN === false) {
				res.redirect("/login");
			} else if (isAccessIsAllowed(URLAllowedFor[str], loginData.accessLevel) !== true) {
				res.redirect("/login");
			} else {
				next();
			}
		}
	}
};
