// Own code requirements.
const cryptoController = require("../own_modules/cryptoController.js");
const dbController = require("../own_modules/dbController.js");
const acl = require("../own_modules/accessControl.js");


function get(req, res) {
	res.render("pages/register.ejs", { info: "" });
}

function post(req, res) {
	// Get the input from the request body.
	const input = req.body;
	
	// Check that password verification matches.
	if (input.password != input.verify) {
		res.render("pages/register.ejs", { info: "Passwords do not match, please try again!" });
	}
	else {
		console.log("\n -=- " + input.username + " -=- ");
		// Check that there isn't another user already named the same.
		(dbController.getUserByName(input.username, function callback(err, result) {
			if (err) {
				throw err;
			}
			// If not, hash password and store user.
			else {
				var user = result;
				if (!user) {
					console.log("The username isn't taken.");
					try {
						// Hash password.
						cryptoController.hashPassword(input.username, input.password, function callback(err, result) {
							if (err) {
								throw err;
							}
							else {
								console.log("Password hash: " + result);
								// Store user.
								dbController.storeUser(input.username, result, "user", function callback(err, result) {
									if (err) {
										throw err;
									}
									else {
										console.log(result);
										res.render("pages/register.ejs", {info: "The user was created successfully."});
									}
								});
							}
						});
					}
					catch (e) {
						console.log(e);
						res.render("pages/register.ejs", {info: e});
					}
				}
				else {
					// Username is taken
					res.render("pages/register.ejs", {info: "The username is taken, try again."});
				}
			}
		}));
	}
}

module.exports.get = get;
module.exports.post = post;