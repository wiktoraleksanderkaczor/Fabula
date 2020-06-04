// Module requirements.
const methodOverride = require("method-override");
const uniqueString = require('unique-string');
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const express = require("express");
const uuidv4 = require("uuid/v4");
const https = require("https");
const fs = require("fs");

// Own code requirements.
const passportController = require("./own_modules/passportController.js");

// Own actions requirements.
const rd_action = require("./actions/crud_actions.js");
const register = require("./actions/register.js");
const stories = require("./actions/stories.js");
const main = require("./actions/main.js");
const read = require("./actions/read.js");


// Set server settings and setup packages.
const app = express();
const port = process.env.PORT || 3000;

// Set viewer engine and file directory.
app.set("view engine", "ejs");
app.use(express.static(__dirname + "/views/pages"));

// Set HTTP command parser.
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true})); 

// Express session setup.
app.use(session({
	genid: function(req) {
		return uuidv4() // use UUIDs for session IDs
	},
	secret: uniqueString(),
	resave: false,
	saveUninitialized: false
})); 

// Allow additional HTTP command like DELETE where client doesn't support it.
app.use(methodOverride("_method"));

// Passport session setup, has to be after express session setup.
app.use(passport.initialize());
app.use(passport.session());
passportController.initialize(passport);

// Create HTTPS server.
https.createServer({
	key: fs.readFileSync("./keys/server.key"),
	cert: fs.readFileSync("./keys/server.cert")
	}, app).listen(port, () => {
		console.log("Server up at https://localhost:3000/");
	});

// Redirect root to main if authenticated.
app.get("/", isAuthenticated, (req, res) =>
{
	res.redirect("/main");
});

// Redirect root to login if not authenticated.
app.get("/", isNotAuthenticated, (req, res) =>
{
	res.redirect("/login");
});

// Render login from login if not authenticated.
app.get("/login", isNotAuthenticated, (req, res) =>
{
	res.render("pages/login.ejs");
});

// Handler for POST on login if not authenticated.
app.post("/login", isNotAuthenticated, passport.authenticate("local",
{
	successRedirect: "/main",
	failureRedirect: "/login",
	failureFlash: true
}));

// Render register from register if authenticated.
app.get("/register", isNotAuthenticated, register.get);

// Handler for POST on register if authenticated.
app.post("/register", isNotAuthenticated, register.post);

// Render main from main if authenticated.
app.get("/main", isAuthenticated, main.get);

// Send JSON stories data if authenticated.
app.get("/stories", isAuthenticated, stories.get);

// Handler for the JSON action handler form on main page for normal users.
app.post("/crud_actions", isAuthenticated, rd_action.crd_handler);

// Handler for the JSON action handler, on the read page for extending story.
app.post("/extend", isAuthenticated, rd_action.update);

// Handler for DELETE to logout.
app.delete("/logout", isAuthenticated, (req, res) => 
{
	req.logOut();
	res.redirect("/login");
});

function isAuthenticated(req, res, next)
{
	if(req.isAuthenticated())
	{
		return next();
	}
	return res.redirect("/login");
}

function isNotAuthenticated(req, res, next)
{
	if(req.isAuthenticated())
	{
		return res.redirect("/main");
	}
	next();
}