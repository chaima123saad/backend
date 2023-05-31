const mongoose = require('mongoose');
const Task = require('./task');

const projectSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      required: true,
      trim: true
    },
    team: {
      type: mongoose.Schema.Types.ObjectId,
      required: false,
      ref: 'Team'
    },
    status: {
      type: String,
      enum: ['completed', 'inProgress', 'toDo'],
      default: 'toDo'
    },
    priority: {
      type: String,
      enum: ['low', 'high', 'medium']
    },
    clientName: {
      type: String,
      required: false
    },
    budget: {
      type: String,
      required: false
    },
    tasks: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: false
      }
    ],
    progress: {
      type: Number
    },
    limiteDate: {
      type: Date  },
  },
  {
    timestamps: true
  }
);
projectSchema.pre('save', async function (next) {
  if (this.isNew && this.team) {
    await mongoose.models.Team.updateOne(
      { _id: this.team },
      { $push: { projects: this._id } }
    );
  }
  next();
});

projectSchema.pre('findOneAndUpdate', async function (next) {
  if (this._update.team) {
    const teamId = this._update.team;

    try {
      const team = await mongoose.models.Team.findById(teamId);

      if (team) {
        await team.updateOne({ $addToSet: { projects: this._conditions._id } });
      }
    } catch (error) {
      console.log(error);
    }
  }

  next();
});




projectSchema.pre('deleteOne', { document: false, query: true }, async function(next) {
  try {

    const projectId = this.getQuery()["_id"];
    const team = await mongoose.model('Team').findOne({ projects: projectId });
    if (team) {
      team.projects.pull(projectId);
      await team.save();
    }
    next();
  } catch (error) {
    next(error);
  }
});

projectSchema.methods.updateProgress = async function () {
  const taskCount = this.tasks.length;
  console.log(taskCount);

  if (taskCount === 0) {
    this.progress = 0;
  } else {

    const completedTaskCount = await Task.countDocuments({ _id: { $in: this.tasks }, status: "completed" });
    const progress = (completedTaskCount / taskCount) * 100;
    this.progress = Math.floor(progress);
  }

  await this.save();
};



const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
