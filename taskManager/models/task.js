const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    status:{
    type: String,
    required: true,
    enum: ['completed', 'inProgress', 'toDo']
    },

    priority:{
      type: String,
      enum: ['low', 'high', 'medium']
      },
      
    subTask: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SubTask'
     }],

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Project'
    },

    users:[{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'User'
    }],
    progress:{
      type: Number,
    }

  }, {
  timestamps: true // Adds createdAt and updatedAt fields to the schema
  });

  const SubTask = require('../models/subTask');

  taskSchema.methods.updateProgress = async function () {
    const subtaskCount = this.subTask.length;
    console.log(subtaskCount);
    if (subtaskCount === 0) {
      this.progress = 0;
    } else {
      const completedSubtaskCount = await SubTask.countDocuments({ _id: { $in: this.subTask }, completed: true });
      console.log("completedSubtaskCount",completedSubtaskCount);
      const progress = (completedSubtaskCount / subtaskCount) * 100;
      console.log(progress);
      this.progress = Math.floor(progress);
    }
    await this.save();
  };
  
  

  taskSchema.pre('deleteOne', { document: false, query: true }, async function(next) {
    try {
      const taskId = this.getQuery()["_id"];
      const user = await mongoose.model('User').findOne({ tasks: taskId });
      if (user) {
        user.tasks.pull(taskId);
        await user.save();
      }
      next();
    } catch (error) {
      next(error);
    }
  });
  
  taskSchema.pre('save', async function(next) {
    try {
      if (this.users) {
        const users = await mongoose.model('User').findById(this.users);
        if (users) {
          const isTask = users.tasks.includes(this._id);
          if (!isTask) {
            users.tasks.push(this._id);
            await users.save();
          }
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  });

  taskSchema.pre('save', async function(next) {
    try {
      if (this.project) {
        const project = await mongoose.model('Project').findById(this.project);
        if (project) {
          const isProject = project.tasks.includes(this._id);
          if (!isProject) {
            project.tasks.push(this._id);
            await project.save();
          }
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  });

const Task = mongoose.model('Task', taskSchema);
module.exports = Task;