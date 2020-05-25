const path = require('path');
const chalk = require('chalk');

// ************ Validator ************
const { body } = require('express-validator');

module.exports = {
	register: [
		// El nombre no puede estar vacío
		body('full_name', 'Dejanos saber tu nombre').notEmpty(),
		// El email no puede estar vacío y debe ser un formato de email válido
		body('email')
			.notEmpty().withMessage('El correo no puede estar vacío').bail()
			.isEmail().withMessage('Ingresá un formato de correo valido'),
		// El password no puede estar vacío y debe tener más de 5 letras
		body('password')
			.notEmpty().withMessage('Ingresá una contraseña').bail()
			.isLength({ min: 5 }).withMessage('La contraseña debe tener más de 5 caracteres'),
		// Si se escribió un password, el re_password debe ser igual
		body('re_password', 'Las contraseñas no coinciden')
			.exists()
			.custom((value, { req }) => req.body.password.length < 5 || value === req.body.password),
		// Se debe elegir un país
		body('country', 'Elegí un país de nacimiento').notEmpty(),
		// Se debe elegir una imagen
		body('avatar').custom((value, { req }) => {
			console.log(chalk.red('Que vino en req.file'));
			console.log(chalk.red(req.file));

			let acceptedExtensions = ['.jpg', '.jpeg', '.png'];
			if (typeof req.file == 'undefined') {
				throw new Error('Elegí una imagen de perfil');
			} else if (req.file.originalname) {
				let fileExtension = path.extname(req.file.originalname);
				let extensionIsOk = acceptedExtensions.includes(fileExtension);
				if (!extensionIsOk) {
					throw new Error('Los formatos válidos son JPG, JPEG y PNG');
				}
			}
			return true;
		}),
	]
}