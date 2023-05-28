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
    }
  },
  {
    timestamps: true
  }
);

projectSchema.methods.updateProgress = async function () {
  console.log("helloooooooooooooooooooooo");
  const taskCount = this.tasks.length;
  console.log(taskCount);

  if (taskCount === 0) {
    this.progress = 0;
    console.log("freeeeeeeeeeeeeeeeeeeeeeeee");
  } else {
    console.log("treeeeeeeeeeeeeeeeeeeeeeeee");

    const completedTaskCount = await Task.countDocuments({ _id: { $in: this.tasks }, status: "completed" });
    console.log("completedTaskCount", completedTaskCount);
    const progress = (completedTaskCount / taskCount) * 100;
    console.log(progress);
    this.progress = Math.floor(progress);
  }

  await this.save();
};

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;
