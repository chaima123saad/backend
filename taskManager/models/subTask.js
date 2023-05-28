const mongoose = require('mongoose');
const subTaskSchema = new mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    completed:{
    type: Boolean,
    required: true,
    default: false
    },
    task:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task'
     },
    
  }, {
  timestamps: true
  });


  
  subTaskSchema.pre('save', async function(next) {
    try {
      console.log("myid ",this._id);

      if (this.task) {
        const task = await mongoose.model('Task').findById(this.task);
        console.log("****",task);
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

  subTaskSchema.pre('findOneAndDelete', { document: false, query: true }, async function(next) {
    try {
      const subTaskId = this.getQuery()["_id"];
      const task = await mongoose.model('Task').findOne({ subTask: subTaskId });
      if (task) {
        task.subTask.pull(subTaskId);
        await task.save();
      }
      next();
    } catch (error) {
      next(error);
    }
  });

const SubTask = mongoose.model('SubTask', subTaskSchema);
module.exports = SubTask;