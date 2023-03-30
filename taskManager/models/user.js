const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const Task = require('./task');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  lastName: {
    type: String,
    required: true
  },
  email:{
    type: String
  },
  role: {
    type: String,
    required: true,
    enum: ['owner', 'manager', 'employee']
  },
  specialite: {
    type: String,
  },
  
tokens: [{
      token: {
        type: String,
        required: true
      }
    }],
password:{
      type: String

    },
resetToken:{
      type: String
    },
resetTokenExpiration:{
      type: String
    }
,profileImage: {
       type: Buffer
     }
}, 
{
timestamps: true

});

userSchema.statics.generatePassword = function () {
  const password = Math.random().toString(36).slice(-8);
  return password;
};

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
  this.tokens = this.tokens.concat({ token });
  await this.save();
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new Error('Unable to login');
  }
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login');
  }
  return user;
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  return user;
};


const User = mongoose.model('User', userSchema);
module.exports = User;








// Delete all tasks associated with a user before deleting the user
// userSchema.pre('remove', async function(next) {
//   await Task.deleteMany({ owner: this._id });
//   next();
// });

// Remove sensitive data from user object before sending as JSON
// userSchema.methods.toJSON = function() {
//   const user = this.toObject();
//   delete user.password;
//   delete user.tokens;
//   delete user.avatar;
//   return user;
// };