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

    priority: {
      type: Number,
      required: true
    },
    // sousTache: [{
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: 'sousTache'
    //   }],

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


  // Add a virtual property to the schema to get the task's duration in seconds
taskSchema.virtual('durationInSeconds').get(function() {
  const diffInMs = Math.abs(new Date() - this.createdAt);
  return Math.floor(diffInMs / 1000);
});

// Set the toJSON method to include the durationInSeconds virtual property
taskSchema.set('toJSON', { virtuals: true });


const Task = mongoose.model('Task', taskSchema);
module.exports = Task;