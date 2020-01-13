// Helper functions
const userFunctions = require('../helpers/userHelperFunctions');

module.exports = function userCookieMiddleware (req, res, next) {
	if (req.cookies.userCookie) {
		let user = userFunctions.getUserByToken(req.cookies.userCookie);
		req.session.userId = user.id;
	}
	next();
}