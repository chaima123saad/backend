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
        ref: 'subTask'
     }],

    project: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'project'
    },

    users:[{
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: 'user'
    }]

  }, {
  timestamps: true // Adds createdAt and updatedAt fields to the schema
  });

  taskSchema.pre('remove', async function(next) {
    try {
      
      const users = await mongoose.model('User').findOne({ tasks: this._id });
      if (users) {
        users.tasks.pull(this._id);
        await users.save();
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


  // Add a virtual property to the schema to get the task's duration in seconds
taskSchema.virtual('durationInSeconds').get(function() {
  const diffInMs = Math.abs(new Date() - this.createdAt);
  return Math.floor(diffInMs / 1000);
});

// Set the toJSON method to include the durationInSeconds virtual property
taskSchema.set('toJSON', { virtuals: true });


const Task = mongoose.model('Task', taskSchema);
module.exports = Task;