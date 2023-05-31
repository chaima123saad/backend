const mongoose = require('mongoose');
const User = require('./user');
const Project = require('./project');

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
  timestamps: true
});


teamSchema.pre('deleteOne', { document: false, query: true }, async function(next) {
  try {
    const teamId = this.getQuery()["_id"];
    const project = await mongoose.model('Project').findOne({ team: teamId });
    if (project) {
      project.team=null;
      await project.save();
    }
    next();
  } catch (error) {
    next(error);
  }
});


teamSchema.pre('save', async function (next) {
  const team = this;

  // Update members' team field
  await mongoose.models.User.updateMany(
    { _id: { $in: team.members } },
    { $set: { team: team._id } }
  );
 
  // Update projects' team field
  await mongoose.models.Project.updateMany(
    { _id: { $in: team.projects } },
    { $set: { team: team._id } }
  );

  next();
});

const Team = mongoose.model('Team', teamSchema);

module.exports = Team;