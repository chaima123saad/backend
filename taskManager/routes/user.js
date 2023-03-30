const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

router.get('/',userController.getAllUsers);
router.get('/:id',userController.getUserById);
router.post('/addUser',userController.createUser);
router.put('/:id',userController.updateUserById);
//router.delete('/:id',userController.deleteUserById);
router.put('/:id',upload.single('profileImage'),userController.updateProfileImage);
router.delete('/:id/',userController.deleteProfileImage);
module.exports = router;
