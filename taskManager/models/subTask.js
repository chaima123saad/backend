const mongoose = require('mongoose');
const subTaskSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    completed:{
    type: String,
    required: true,
    enum: ['yes', 'no'],
    default: 'no'
    },
    task:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'task'
     },
    
  }, {
  timestamps: true
  });

  subTaskSchema.pre('remove', async function(next) {
    try {
      
      const task = await mongoose.model('Task').findOne({ subTask: this._id });
      if (task) {
        task.subTask.pull(this._id);
        await task.save();
      }
      next();
    } catch (error) {
      next(error);
    }
  });
  
  subTaskSchema.pre('save', async function(next) {
    try {
      if (this.task) {
        const task = await mongoose.model('Task').findById(this.task);
        if (task) {
          const issubTask = task.subTask.includes(this._id);
          if (!issubTask) {
            task.subTask.push(this._id);
            await task.save();
          }
        }
      }
      next();
    } catch (error) {
      next(error);
    }
  });


const subTask = mongoose.model('subTask', subTaskSchema);
module.exports = subTask;