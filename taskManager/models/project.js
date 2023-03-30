const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
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
    type:mongoose.Schema.Types.ObjectId,
    required: false,
    ref:'Team'
  },
  status:{
    type: String,
    enum: ['completed', 'inProgress', 'toDo'],
    dafault:'toDo'

    },
  clientName: {
      type: String,
      required: false
    },
  budge: {
      type: String,
      required: false
    },
  tasks: [{
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Task',
      required:false
      }]
  },
  
  {
    timestamps: true
  }
  
  );

const Project = mongoose.model('Project', projectSchema);
module.exports = Project;