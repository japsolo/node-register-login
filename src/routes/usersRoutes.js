// ************ Require's ************
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');

// ************ Validator ************
const { check, body } = require('express-validator');

// ************ Controller Require ************
const usersController = require('../controllers/usersController');

// ************ Middlewares ************
const authMiddleware = require('../middlewares/authMiddleware');
const guestMiddleware = require('../middlewares/guestMiddleware');

// ************ Multer DiskStorage ************
const diskStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		let avatarsFolderPath = path.join(__dirname, '../../public/images/avatars');		
		let acceptedExtensions = ['.jpg', '.jpeg', '.png'];
		let fileExtension = path.extname(file.originalname);
		let extensionIsOk = acceptedExtensions.find(ext => ext === fileExtension);
		if (extensionIsOk) {
			cb(null, avatarsFolderPath);
		}
		cb(null, path.join(__dirname, '../../public/images/errors'));
	},
	filename: (req, file, cb) => {
		let userName = req.body.full_name.replace(/ /g, '-').toLowerCase();
		let finalName = userName + '-' + Date.now() + path.extname(file.originalname);
		cb(null, finalName);
	}
});

const upload = multer({ storage: diskStorage });

// ************ Validations ************
let registerValidations = [
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
		let acceptedExtensions = ['.jpg', '.jpeg', '.png'];
		if (typeof req.file == 'undefined') {
			throw new Error('Elegí una imagen de perfil');
		} else if (req.file.originalname) {
			let fileExtension = path.extname(req.file.originalname);
			let extensionIsOk = acceptedExtensions.find(ext => ext === fileExtension);
			if (!extensionIsOk) {
				throw new Error('Los formatos válidos son JPG, JPEG y PNG');
			}
		}
		return true;
	}),
];

/* GET - /users/register */
router.get('/register', guestMiddleware, usersController.register);

/* POST - /users/register */
router.post('/register', upload.single('avatar'), registerValidations, usersController.store);

/* GET - /users/login */
router.get('/login', guestMiddleware, usersController.login);

/* POST - /users/login */
router.post('/login', usersController.processLogin);

/* GET - /users/profile */
router.get('/profile', authMiddleware, usersController.profile);

/* GET - /users/logout */
router.get('/logout', usersController.logout);

module.exports = router;
