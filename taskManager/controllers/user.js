const User = require('../models/user');
const sendWelcomeEmail = require('../email');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const path= require('path');
const Team = require('../models/user');
const cloudinary = require('cloudinary').v2;
const jwt = require('jsonwebtoken');
const Archive = require('../models/archive');

exports.createUser = async (req, res) => {
  try {
    const { email, name, lastName, adress, numero, genre, team, role,speciality, birthDate, profileImage, tasks,progress } = req.body;
    const password = User.generatePassword();
    const newUser = new User({ email, name, lastName, adress, numero, genre, team, role,speciality, birthDate, profileImage, tasks, password,progress });
    sendWelcomeEmail(email, name, password);
    newUser.password = await bcrypt.hash(password, 8);
    const token = jwt.sign({ userId: newUser._id }, process.env.JWT_SECRET);
    await newUser.save();
    res.status(201).json({ user: newUser, token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getAllUsers = async (req, res) => {
  try {
 
    const users = await User.find();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    await user.updateProg();
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateUserById = async (req, res) => {
  try {
    const { email,name, lastName,adress ,numero,genre,team,role,speciality, tasks } = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { email,name, lastName,adress ,numero,genre,team,role,speciality, tasks }, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const archivedUser = {
      name: user.name,
      email: user.email,
      role: user.role,
      lastName:user.lastName,
      speciality: user.speciality,
      genre: user.genre,
      adress:user.adress,
      numero:user.numero,
      birthDate:user.birthDate,
      deletedAt: new Date(),

    };

    await Archive.updateOne({}, { $push: { deletedUsers: archivedUser } });

    await User.findByIdAndRemove(req.params.id);

    res.status(200).json({ message: 'User deleted', user: archivedUser });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

cloudinary.config({
  cloud_name: "dvw7882vz",
  api_key: "482828472586643",
  api_secret: "2Uh5CMgQI2doIyBWDTCs41XnqmA"
});

exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.profileImage && !user.profileImage.includes("https://res.cloudinary.com/dvw7882vz/image/upload/v1681564075/user_avatar_2.jpg")) {
      const public_id = 'user_avatar_2';
      await cloudinary.uploader.destroy(public_id);
    }

    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const result = await cloudinary.uploader.upload(req.file.path);
    user.profileImage = result.secure_url;
    await user.save();

    res.status(200).json({ message: "Profile image updated successfully", user });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to update profile image" });
  }
};
exports.deleteProfileImage = async (req, res) => {
  try {
  
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profileImageUrl = user.profileImage;
    if (profileImageUrl && !profileImageUrl.includes("https://res.cloudinary.com/dvw7882vz/image/upload/v1681564075/user_avatar_2.jpg")) {
      return res.status(400).json({ message: "Cannot delete default profile image" });
    }

    const publicId = 'user_avatar_2';
    await cloudinary.uploader.destroy(publicId);

    user.profileImage = 'https://res.cloudinary.com/dvw7882vz/image/upload/v1681564075/user_avatar_2.jpg';
    await user.save();

    res.status(200).json({ message: "Profile image deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete profile image" });
  }
}
