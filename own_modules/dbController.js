// Module requirements.
const sqlite3 = require("sqlite3");
const path = require("path");

// Database file requirements.
const db = new sqlite3.Database(path.join(__dirname, "..", "database", "users.db"));


// Function to store a user.
function storeUser(username, passwordHash, role, callback) {
	empty_data = JSON.stringify({});
	db.run("INSERT INTO accounts (username, password, role, stories) VALUES($username, $password, $role, $stories)", { 
		$username: username, 
		$password: passwordHash, 
		$role: role, 
		$stories: empty_data, 
		}, (err) => {
			if (err) {
				callback(err, null);
			} 
			else {
				callback(null, "User stored successfully.");
			}
		}
	);
}

// Function to store a story.
function storeStory(username, stories, callback) {
	db.run("UPDATE accounts SET stories=$input WHERE username=$name;", {
			$input: stories,
			$name: username,
		}, (err) => {
			if (err) {
				callback(err, null);
			} 
			else {
				callback(null, "Story stored successfully.");
			}
		}
	);
}

// Function to retrieve all users by a username.
function getUserByName(username, callback) {
	db.get("SELECT * FROM accounts WHERE USERNAME=$name", {
			$name: username
		}, (err, row) => {
			if (err) {
				callback(err, null);
			}
			else {
				callback(null, row);
			}
		}
	);
}

// Function to retrieve all users by a username. 
function getUserRole(username, callback) { 
	db.get("SELECT role FROM accounts WHERE USERNAME=$name", { 
			$name: username 
		}, (err, row) => { 
			if (err) { 
				callback(err, null); 
			} 
			else { 
				callback(null, row.role); 
			} 
		} 
	); 
} 

// Function to retrieve "stories" by a username. 
function getUserStories(username, callback) { 
	db.get("SELECT stories FROM accounts WHERE USERNAME=$name", { 
			$name: username 
		}, (err, row) => { 
			if (err) { 
				callback(err, null); 
			} 
			else { 
				callback(null, row.stories); 
			} 
		} 
	); 
} 
 
module.exports.storeUser = storeUser;
module.exports.storeStory = storeStory;
module.exports.getUserByName = getUserByName;
module.exports.getUserRole = getUserRole;
module.exports.getUserStories = getUserStories; 
	
