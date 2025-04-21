const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const upload = multer({ dest: 'profilePicture/' });

const userController = require('../controllers/user.controller');

router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/getuser', userController.getUser);
router.post('/updateProfilePicture', upload.single('profilePicture'), userController.updateProfilePicture);

module.exports = router;