const mongoose = require('mongoose');

const teamSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: true  
  },
  members: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  projects: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project'
  }]
},
{
  timestamps: true // Adds createdAt and updatedAt fields to the schema
});

// Remove sensitive data from team object before sending as JSON
// teamSchema.methods.toJSON = function() {
//   const team = this.toObject();
//   delete team.owner;
//   return team;
// };


const Team = mongoose.model('Team', teamSchema);

module.exports = Team;