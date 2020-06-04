// Own code requirements.
const dbController = require("../own_modules/dbController.js");
const acl = require("../own_modules/accessControl.js");

// Module requirements.
const request = require('request-json');

// Setting Python generation function URI.
var client = request.createClient('http://localhost:5000/');


function crd_handler(req, res) {
	const input = req.body;
	if (input.action === "create") {
		create(req, res);
	} 
	else if (input.action === "read") {
		read(req, res);
	}
	else if (input.action === "delete") {
		del(req, res);
	}
}

function create(req, res) {
	//Get role
	(dbController.getUserRole(req.user.username, function callback(err, role) {
		if (err) {
			console.log(err);
		}
		else {
			// Check if role can do the action.
			permission = acl.ac.can(role).execute("create").sync().on("stories");
			// Continue if yes, reject if no.
			if (permission.granted) {	
                // Get the input from the request body.
                const input = req.body;
				
                // Story definition from input.
                const story = {
                    id: req.user.username+Date.now(),
                    name: input.story_name,
                    text: "<h4>" + input.story_name + ":</h4>"
                };

                console.log(story);

				// Getting data for user to append.
				(dbController.getUserStories(req.user.username, function callback(err, data) {
					if (err) {
						console.log(err);
					}
					else {
						// Convert to appropriate format for usage.
						parsed = JSON.parse(data);

						// Check if empty, if so, log error.
						if (data === JSON.stringify({})) {
							parsed = [story];
							const new_data = JSON.stringify(parsed);
                        
							(dbController.storeStory(req.user.username, new_data, function callback(err, result) {
								if (err) {
									throw err;
								}
								else {
									res.render("pages/read.ejs", {info: result, story_name: story.name, story_text: story.text });
								}
							}));
						}
						// If not, assume that it is array, push task to array.
						else {
							// Check for duplicates.
							check = false;
							for (i in parsed) {
								if (parsed[i].name === story.name) {
									check = true;
								}
							}

							// Inform user of duplicate.
							if (check === true) {
								res.render("pages/main.ejs", { username: req.user.username, info: "A story by that name already exists." });
							}
							// Add story to array, convert to appropriate format and store in DB.
							else {
								parsed.push(story);
								const new_data = JSON.stringify(parsed);
                        
								(dbController.storeStory(req.user.username, new_data, function callback(err, result) {
									if (err) {
										throw err;
									}
									else {
										res.render("pages/read.ejs", {info: result, story_name: story.name, story_text: story.text });
									}
								}));
							}	
						}
					}
				}));
			}
			else {
				res.render("pages/main.ejs", { username: req.user.username, info : "Denied access"});
			}
		}
	}));
}

function read(req, res) {
	//Get role
	(dbController.getUserRole(req.user.username, function callback(err, role) {
		if (err) {
			console.log(err);
		}
		else {
			// Check if role can do the action.
			permission = acl.ac.can(role).execute("create").sync().on("stories");
			// Continue if yes, reject if no.
			if (permission.granted) {	
                // Get the input from the request body.
                const input = req.body;
                
                // JSON to store found story.
                story = {
                    name: input.story_name,
                    text: ""
                };

				// Getting data for user to append.
				(dbController.getUserStories(req.user.username, function callback(err, data) {
					if (err) {
						console.log(err);
					}
					else {
						// Convert to appropriate format for usage.
                        parsed = JSON.parse(data);
                        
						// Check if empty, if so, inform user.
						if (data === JSON.stringify({})) {
                            res.render("pages/read.ejs", {info: "You don't have any stories saved.", story_name: story.name, story_text: story.text });
                        }

                        // Get correct story data.
                        for (i in parsed) {
                            if (parsed[i].name === input.story_name) {
                                story.text = parsed[i].text;
                            }
                        }

                        // Check if story found in record, if not, inform user.
                        if (story.text === "") {
                            res.render("pages/read.ejs", {info: "No such story saved.", story_name: input.story_name, story_text: "" });
                        }
						// If not, assume it found it and send to user.
						else {
                            res.render("pages/read.ejs", { info: "", story_name: story.name, story_text: story.text });
                        }
					}
				}));
			}
			else {
				res.render("pages/main.ejs", { username: req.user.username, info : "Denied access"});
			}
		}
    }));
}

function update(req, res) {
	//Get role
	(dbController.getUserRole(req.user.username, function callback(err, role) {
		if (err) {
			console.log(err);
		}
		else {
			// Check if role can do the action.
			permission = acl.ac.can(role).execute("create").sync().on("stories");
			// Continue if yes, reject if no.
			if (permission.granted) {	
                // Get the input from the request body.
                const input = req.body;
                console.log(input);
                // JSON to store found story.
                story = {
                    name: input.story_name,
                    text: input.user_input
                };

				// Getting data for user to append.
				(dbController.getUserStories(req.user.username, function callback(err, data) {
					if (err) {
						console.log(err);
					}
					else {
						// Convert to appropriate format for usage.
                        parsed = JSON.parse(data);
                        
						// Check if empty, if so, inform user.
						if (data === JSON.stringify({})) {
                            res.render("pages/read.ejs", {info: "You don't have any stories saved.", story_name: story.name, story_text: story.text });
						}
			
						var data = {
							start_text: story.text
						};

						client.post('generate', data, function(err, resp, body) {
							console.log(body);
							story.text = body.replace("<|endoftext|>","");

							// Get correct story data.
							for (i in parsed) {
								if (parsed[i].name === story.name) {
									console.log(parsed[i]);
									new_text = "";
									if (parsed[i].text === "") {
										new_text = "<p>" + story.text + "</p>";
									}
									else {
										new_text = parsed[i].text + "<p>" + story.text + "</p>";
									}
									parsed[i].text = new_text;
									story.text = new_text;
								}
							}

							const new_data = JSON.stringify(parsed);
							
							(dbController.storeStory(req.user.username, new_data, function callback(err, result) {
								if (err) {
									throw err;
								}
								else {
									// Once new story update saved, render page with new story.
									res.render("pages/read.ejs", { info: "", story_name: story.name, story_text: story.text });
								}
							}));
						});

					}
				}));
			}
			else {
				res.render("pages/main.ejs", { username: req.user.username, info : "Denied access"});
			}
		}
    }));
}

// I have to use "del" because "delete" is reserved.
function del(req, res) {
		//Get role
		(dbController.getUserRole(req.user.username, function callback(err, role) {
			if (err) {
				console.log(err);
			}
			else {
				// Check if role can do the action.
				permission = acl.ac.can(role).execute("create").sync().on("stories");
				// Continue if yes, reject if no.
				if (permission.granted) {	
					// Get the input from the request body.
					const input = req.body;
	
					// Getting data for user to append.
					(dbController.getUserStories(req.user.username, function callback(err, data) {
						if (err) {
							console.log(err);
						}
						else {
							// Convert to appropriate format for usage.
							parsed = JSON.parse(data);
							
							// Check if empty, if so, inform user.
							if (data === JSON.stringify({})) {
								res.render("pages/main.ejs", {info: "You don't have any stories saved.", info: input.story_name });
							}
							
							// Set check boolean.
							check = false;
							
							// Delete story if exists.
							for (i in parsed) {
								console.log(parsed[i]);
								if (parsed[i].name === input.story_name) {
									parsed.splice(i, 1);
									check = true;
								}
							}

							// If story deleted, store new JSON in DB, notify user.
							if (check) {
								// Format for storaage
								new_data = JSON.stringify(parsed);

								// Store back in database.
								(dbController.storeStory(req.user.username, new_data, function callback(err, result) {
									if (err) {
										throw err;
									}
									else {
										res.render("pages/main.ejs", { username: req.user.username, info: "Deleted story named " + input.story_name });
									}
								}));
							}
							else {
								res.render("pages/main.ejs", { username: req.user.username, info: "Story named " + input.story_name + "could not be deleted." });
							}
						}
					}));
				}
				else {
					res.render("pages/main.ejs", { username: req.user.username, info : "Denied access"});
				}
			}
		}));
}

module.exports.crd_handler = crd_handler;
module.exports.update = update