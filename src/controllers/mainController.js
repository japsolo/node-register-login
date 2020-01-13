// Helper functions
const userFunctions = require('../helpers/userHelperFunctions');

const controller = {
	index: (req, res) => {
		// Pasar a usuario logueado
		let userLogged = req.session.userId ? userFunctions.getUserById(req.session.userId) : null;
		
		res.render('index', { userLogged });
	},
};

module.exports = controller
