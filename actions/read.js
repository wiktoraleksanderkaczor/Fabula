// Own code requirements.
const dbController = require("../own_modules/dbController.js");
const acl = require("../own_modules/accessControl.js");


function get(req, res) {
	// Deny because only post will render the story, you need a story selected to show.
	res.render("pages/denied.ejs", { username: req.user.username });
}

function post(req, res) {
	//Get role
	role = dbController.getUserRole(req.user.username, function callback(err, role) {
		if (err) {
			console.log(err)
		}
		else {
			// Check if role can do the action.
			permission = acl.ac.can(role).execute("read").sync().on("stories");
			// Continue if yes, reject if no.
			if (permission.granted) {	
                // Get the input from the request body.
                const input = req.body;
				
				// Get all stories.
				(dbController.getUserStories(req.user.username, function callback(err, data) {
					if (err) {
						console.log(err);
					}
					else {
						parsed = JSON.parse(data);
						if (data == JSON.stringify({})) {
							res.render("pages/main.ejs", { username: req.user.username, info: "Error showing story." });
						}
						else {
							res.json(data);
						}
					}
				}));

                // Request definition from inputs.
				const request = {
					id: req.user.username+Date.now(),
					name: input.choice,
					start: input.start,
					end: input.end
				};

				console.log(request);
                // Get current user requests.
                (dbController.getUserRequests(req.user.username, function callback(err, data) {
                    if (err) {
						console.log(err);
					}
					else {

						const new_data = JSON.stringify(parsed);

						// Storing task in database for specific user.	
						(dbController.storeRequest(req.user.username, new_data, function callback(err, result) {
							if (err) {
								throw err;
							}
							else {
								console.log(result);
								res.render("pages/request.ejs", {info: "The user was assigned the task successfully."});
							}
						}));
					}
				}));
			}
			else {
				res.render("pages/denied.ejs", { username: req.user.username });
			}
		}
	});
}

module.exports.get = get;
module.exports.post = post;