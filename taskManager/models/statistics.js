const mongoose = require('mongoose');

const statisticsSchema = new mongoose.Schema({
  project: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: 'Project'
  },
  taskCount: {
    type: Number,
    required: true,
    default: 0
  },
  completedTaskCount: {
    type: Number,
    required: true,
    default: 0
  }
},
{
  timestamps: true // Adds createdAt and updatedAt fields to the schema
});

const Statistics = mongoose.model('Statistics', statisticsSchema);
module.exports = Statistics;
