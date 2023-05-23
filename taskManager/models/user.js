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
  speciality:{
    type: String
  },
  team:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Team'
  },
  genre:{
    type: String,
    required: true,
    enum: ['Homme', 'Femme', 'Autre']
  },
  adress:{
    type: String,
    required: true,
  },
  numero:{
    type: String,
    required: true,
  },
  birthDate: {
    type: Date  },
  
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
,
profileImage: {
  type: String,
  default: 'https://res.cloudinary.com/dvw7882vz/image/upload/v1681564075/user_avatar_2.jpg'
},
tasks:[{
  type: mongoose.Schema.Types.ObjectId,
  required: true,
  ref: 'Task',
  default:null
}]

}, 
{
timestamps: true
});

userSchema.pre('remove', async function(next) {
  try {
    
    const team = await mongoose.model('Team').findOne({ members: this._id });
    if (team) {
      team.members.pull(this._id);
      await team.save();
    }
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.pre('save', async function(next) {
  try {
    if (this.team) {
      const team = await mongoose.model('Team').findById(this.team);
      if (team) {
        const isMember = team.members.includes(this._id);
        if (!isMember) {
          team.members.push(this._id);
          await team.save();
        }
      }
    }
    next();
  } catch (error) {
    next(error);
  }
});


userSchema.statics.generatePassword = function () {
  const password = Math.random().toString(36).slice(-8);
  return password;
};

userSchema.methods.generateAuthToken = async function() {
  const token = jwt.sign({ _id: this._id.toString() }, process.env.JWT_SECRET);
  this.tokens = this.tokens.concat({ token });
  return token;
};

userSchema.statics.findByCredentials = async (email, password) => {
  const user = await User.findOne({ email });

  if (!user) {
    throw new Error('User not found');
  }
  const isMatch = bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new Error('Unable to login');
  }
  return user;
};

userSchema.methods.toJSON = function() {
  const user = this.toObject();
  return user;
};

userSchema.methods.isValidPassword = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw error;
  }
};


module.exports = mongoose.model('User', userSchema);


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