const createError = require("http-errors");
const express = require("express");
const path = require("path");
const session = require("express-session");
const FileStore = require("session-file-store")(session);
const cookieParser = require("cookie-parser");
const bodyParser = require("body-parser");
const logger = require("morgan");
const hbs = require("hbs");

require("dotenv").config();

const indexRouter = require("./routes/index");
const superAdminRouter = require("./routes/super.admin");

const registerHelper = require("./utils/helpers");

const app = express();

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "hbs");
registerHelper(hbs);
hbs.registerPartials(__dirname + "/views/partials");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieParser());

// session setup
const sessionOptions = {
	store: new FileStore({}),
	secret: process.env.SESSION_SECRET || "Aie8whuhHHk8wh",
	resave: false,
	saveUninitialized: true,
	cookie: {secure: false},
	name: "user__",
};


if (process.env.NODE_ENV === "production") {
	app.set("trust proxy", 1);
	sessionOptions.cookie.secure = true; // for https connections
}

app.use(session(sessionOptions));

app.use(express.static(path.join(__dirname, "public")));

app.use("/", indexRouter);
app.use("/super/admin", superAdminRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
	next(createError(404));
});

// error handler
app.use(function(err, req, res) {
	// set locals, only providing error in development
	res.locals.message = err.message;
	res.locals.error = req.app.get("env") === "development" ? err : {};

	// render the error page
	res.status(err.status || 500);
	res.render("error");
});

module.exports = app;
