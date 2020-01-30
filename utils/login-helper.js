const crypto = require("crypto");

const getLoginSecretString = (req, user) => {
	const browser = req.headers["user-agent"];
	return user.name + user._id + browser;
};

exports.newLogin = async (req, user) => {
	const str = getLoginSecretString(req, user);
	const secret = crypto.createHash("sha512").update(str, "utf8");
	const hour = 3600000;

	req.session.login = true;
	req.session.user_id = user._id;
	req.session.username = user.name;
	req.session.role = user.role;
	req.session.secret = secret.digest("hex");
	req.session.cookie.expires = new Date(Date.now() + hour);
	req.session.cookie.maxAge = hour;
};

exports.checkLogin = async (req) => {
	const session = req.session;
	const sessionAccess = {};
	console.log(session);

	if (session.login !== true && !session.user_id && !session.role) {
		sessionAccess.loggedIN = false;
	} else {
		// TODO extract user and validate session secret string.
		sessionAccess.loggedIN = true;
		if (session.superAdmin) {
			sessionAccess.accessLevel = "superAdmin";
		} else {
			sessionAccess.accessLevel = session.role;
		}
	}
	return sessionAccess;
};

exports.destroySession = () => {

};
