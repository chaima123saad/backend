const express = require('express');
const router = express.Router();
const userController = require('../controllers/user');
const multer = require('multer');
const User = require('../models/user');
const path=require('path');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
      const ext = path.extname(file.originalname);
      const filename = `${file.fieldname}-${Date.now()}${ext}`;
      cb(null, filename);
    }
});

const upload = multer({
    storage,
    limits: { fileSize: 1000000 },
    fileFilter: (req, file, cb) => {
      const allowedFileTypes = /jpeg|jpg|png|gif/;
      const ext = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
      const mimeType = allowedFileTypes.test(file.mimetype);
      if (ext && mimeType) {
        cb(null, true);
      } else {
        cb('Error: Only image files with extensions jpeg/jpg/png/gif are allowed.');
      }
    }
})

router.put('/:id', upload.single('profileImage'), userController.updateProfileImage); 
router.delete('/:id', userController.deleteProfileImage); 

router.get('/',userController.getAllUsers);
router.get('/:id',userController.getUserById);
router.post('/addUser',userController.createUser);
//router.put('/:id',userController.updateUserById);
//router.delete('/:id',userController.deleteUserById);

router.delete('/:id/',userController.deleteProfileImage);
module.exports = router;
