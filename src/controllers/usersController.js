// Modules
const bcrypt = require('bcrypt');
const { validationResult } = require('express-validator');

// Helper functions
const userFunctions = require('../helpers/userHelperFunctions');

const hasErrorGetMessage = (field, errors) => {
	if(typeof errors != 'undefined') {
		for (const oneError of errors) {
			if (oneError.param == field) {
				return oneError.msg;
			}
		}
	}
	return false;
};

// Controller Methods
const controller = {
	register: (req, res) => {
		// Pasar a usuario logueado
		let userLogged = req.session.userId ? userFunctions.getUserById(req.session.userId) : null;
		res.render('usersRegisterForm', { userLogged });
	},
	store: (req, res) => {
		const errors = validationResult(req);

		// console.log(errors.errors);
		
		if (!errors.isEmpty()) {
			let userLogged = req.session.userId ? userFunctions.getUserById(req.session.userId) : null;
			res.render('usersRegisterForm', { 
				userLogged, 
				errors: errors.errors,
				oldData: req.body,
				hasErrorGetMessage
			});
		} else {
			// Hashear la contraseña
			req.body.password = bcrypt.hashSync(req.body.password, 10);
	
			// Eliminar la prop user_rePassword
			delete req.body.re_password;
	
			// Pasar el nombre final del avatar
			req.body.avatar = req.file.filename;
	
			// Guardar la información del usario y obtener la data que se guardó
			let newUser = userFunctions.storeUser(req.body);
			
			// Pasar a sesión el id del usuario guardado
			req.session.userId = newUser.id;
	
			// Setear la cookie para mantener la sesión iniciada
			res.cookie('userCookie', bcrypt.hashSync(newUser.token, 10), { maxAge: 60000 });
	
			// Redirección al perfil para autologuear
			return res.redirect('/users/profile');
		}
	},
	login: (req, res) => {
		// Pasar a usuario logueado
		let userLogged = req.session.userId ? userFunctions.getUserById(req.session.userId) : null;
		res.render('usersLoginForm', { userLogged });
	},
	processLogin: (req, res) => {
		// Buscar usuario por email
		let user = userFunctions.getUserByEmail(req.body.email);

		// Si encontramos al usuario
		if (user != undefined) {
			// Al ya tener al usuario, comparamos las contraseñas
			if (bcrypt.compareSync(req.body.password, user.password)) {
				// Guardamos el id del usuario en session
				req.session.userId = user.id;

				// Si se tildó recordarme, guardamos una cookie con el ID del usuario
				if (req.body.remember_user) {
					res.cookie('userCookie', bcrypt.hashSync(user.token, 10), { maxAge: 60000 });
				}

				// Redireccionamos al visitante a su perfil
				return res.redirect('/users/profile');
			} else {
				res.send('Credenciales inválidas');
			}
		} else {
			res.send('No hay usuarios registrados con ese email');
		}
	},
	profile: (req, res) => {
		// Tomar de session el Id guardado
		let userId = req.session.userId;

		// Buscar al usuario con ese Id
		let userLogged = userFunctions.getUserById(userId);
		
		// Renderear la vista pasando el usuario
		res.render('userProfile', { userLogged });
	},
	logout: (req, res) => {
		// Destruir la sesión
		req.session.destroy();
		// Borrar la cookie
		res.cookie('userCookie', null, { maxAge: -1 });
		// Redireccionar
		return res.redirect('/');
	}
};

module.exports = controller
