// ************ Require's ************
const express = require('express');
const router = express.Router();

// ************ Controller Require ************
const usersController = require('../controllers/usersController');

// ************ Middlewares ************
const authMiddleware = require('../middlewares/authMiddleware');
const guestMiddleware = require('../middlewares/guestMiddleware');
const validator = require('../middlewares/validatorsMiddleware');
const upload = require('../middlewares/uploadMiddleware');

/* GET - /users/register */
router.get('/register', guestMiddleware, usersController.register);

/* POST - /users/register */
router.post('/register', upload.single('avatar'), validator.register, usersController.store);

/* GET - /users/login */
router.get('/login', guestMiddleware, usersController.login);

/* POST - /users/login */
router.post('/login', usersController.processLogin);

/* GET - /users/profile */
router.get('/profile', authMiddleware, usersController.profile);

/* GET - /users/logout */
router.get('/logout', usersController.logout);

module.exports = router;
