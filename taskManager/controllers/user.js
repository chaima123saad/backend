const User = require('../models/user');
const sendWelcomeEmail = require('../email');
const bcrypt = require('bcryptjs');
const multer = require('multer');
const upload = multer();
const fs = require('fs');
const path= require('path');
const Team = require('../models/user');

exports.createUser = async (req, res) => {
  try {
    const { name, lastName, email, role, specialite, team, profileImage, tasks } = req.body;
    const password = User.generatePassword();

    const newUser = new User({ name, lastName, email, role, specialite, team, profileImage, tasks, password });
    await newUser.save();

    await Team.updateOne({ _id: team }, { $push: { members: newUser._id } });

    await sendWelcomeEmail(email, name, password);

    newUser.password = await bcrypt.hash(password, 8);
    await newUser.save();

    const token = newUser.generateAuthToken();
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
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateUserById = async (req, res) => {
  try {
    const { firstName, lastName, email, password, role, specialite} = req.body;
    const updatedUser = await User.findByIdAndUpdate(req.params.id, { firstName, lastName, email, password, role, specialite}, { new: true });
    if (!updatedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteUserById = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.id);
    if (!deletedUser) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.updateProfileImage = async (req, res) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const oldProfileImagePath = user.profileImage;
    if (oldProfileImagePath !== "public/images/default-avatar.jpg") {
      fs.unlinkSync(path.join(__dirname, '..', '', oldProfileImagePath));
    }
    
    user.profileImage = req.file.path.replace("public/", "");
    await user.save();
    res.status(200).json({ message: "Profile image updated successfully" });
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

    const profileImagePath = user.profileImage;
    if (!profileImagePath || profileImagePath === 'public/images/default-avatar.jpg') {
      return res.status(400).json({ message: "Cannot delete default profile image" });
    }

    fs.unlinkSync(path.join(__dirname, '..', '', profileImagePath));
    user.profileImage = 'public/images/default-avatar.jpg';
    await user.save();

    res.status(200).json({ message: "Profile image deleted successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to delete profile image" });
  }
}
