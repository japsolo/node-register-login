// Modules
const fs = require('fs');
const path = require('path');
const bcrypt = require('bcrypt');
const UIDGenerator = require('uid-generator');
const uidgen = new UIDGenerator(); // Default is a 128-bit UID encoded in base58


// Constants
const userFilePath = path.join(__dirname, '../data/users.json');

// Helper Functions
function getAllUsers() {
	let usersFileContent = fs.readFileSync(userFilePath, 'utf-8');
	let finalUsers = usersFileContent == '' ? [] : JSON.parse(usersFileContent);
	return finalUsers;
}

function storeUser(newUserData) {
	// Setear 1ero el ID
	newUserData = {
		id: generateUserId(),
		...newUserData,
		token: uidgen.generateSync(),
	};
	let allUsers = getAllUsers();
	allUsers.push(newUserData);
	fs.writeFileSync(userFilePath, JSON.stringify(allUsers, null, ' '));
	return newUserData;
}

function generateUserId() {
	let allUsers = getAllUsers();
	if (allUsers.length == 0) {
		return 1;
	}
	let lastUser = allUsers.pop();
	return lastUser.id + 1;
}

function getUserByEmail(email) {
	let allUsers = getAllUsers();
	let userByEmail = allUsers.find(oneUser => oneUser.email == email);
	return userByEmail;
}

function getUserById(id) {
	let allUsers = getAllUsers();
	let userById = allUsers.find(oneUser => oneUser.id == id);
	return userById;
}

function getUserByToken(tokenHash) {
	let allUsers = getAllUsers();
	let userByToken = allUsers.find(oneUser => bcrypt.compareSync(oneUser.token, tokenHash) ? oneUser : null);
	return userByToken;
}

module.exports = { getAllUsers, storeUser, generateUserId, getUserByEmail, getUserById, getUserByToken }