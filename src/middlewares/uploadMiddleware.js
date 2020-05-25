const multer = require('multer');
const path = require('path');
const chalk = require('chalk');

const diskStorage = multer.diskStorage({
	destination: (req, file, cb) => {
		console.log(file);
		let avatarsFolderPath = path.join(__dirname, '../../public/images/avatars');
		cb(null, avatarsFolderPath);
	},
	filename: (req, file, cb) => {
		let userName = req.body.full_name.replace(/ /g, '-').toLowerCase();
		let finalName = userName + '-' + Date.now() + path.extname(file.originalname);
		cb(null, finalName);
	}
});

const upload = multer({ 
	storage: diskStorage, 
	fileFilter: (req, file, cb) => {
		let acceptedExtensions = ['.jpg', '.jpeg', '.png'];
		let fileExtension = path.extname(file.originalname);
		let extensionIsOk = acceptedExtensions.includes(fileExtension);
		if (extensionIsOk) {
			cb(null, true);
		} else {
			console.log(chalk.cyan('error de formato, no se subió el archivo'));
			console.log(chalk.cyan('Si este error se muestra, req.file será undefined para el validador'));
			cb(null, false);
		}
	}
});

module.exports = upload;