//Module requirements.
const AccessControl = require('role-acl');


// Set up access control object.
const ac = new AccessControl();

/*
	Users can CRUD their own stories
	Admins have an additional permission for all administration tasks.
*/

// Grant user permissions.
ac.grant('user')
	.execute('create').on('stories')
	.execute('read').on('stories')
	.execute('update').on('stories')
	.execute('delete').on('stories');

// Create admin role which extends user role.
ac.grant('admin').extend('user');

// Grant admin permissions.
ac.grant('admin')
	.execute('admin').on('stories')

module.exports.ac = ac;