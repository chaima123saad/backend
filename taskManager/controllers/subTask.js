const SubTask = require('../models/subTask');
const Task = require('../models/task');

exports.createSubTask = async (req, res) => {
  try {

    const { name, completed,task } = req.body;
    const newSubTask = new SubTask({ name,completed,task });
    await newSubTask.save();
    const tasks = await Task.findById(task);
    await tasks.updateProgress();
    
    res.status(201).json(newSubTask);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getSubTasks = async (req, res) => {
    const taskId = req.params.id;
    try {
      const task = await Task.findById(taskId).populate('subTask', 'name completed');
      if (!task) {
        return res.status(404).json({ error: 'task not found' });
      }
      res.json({ subTask: task.subTask });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  exports.updateSubTaskById = async (req, res) => {
    try {
      const { name, completed } = req.body;
      const updatedSubTask = await SubTask.findByIdAndUpdate(req.params.id, { name, completed }, { new: true });
      await updatedSubTask.task.updateProgress();

      if (!updatedSubTask) {
        return res.status(404).json({ message: 'SubTask not found' });
      }
      res.json(updatedSubTask);

    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };


  exports.deleteSubTaskById = async (req, res) => {
    try {
      const deletedSubTask = await SubTask.findOneAndDelete({ _id: req.params.id });
      if (!deletedSubTask) {
        return res.status(404).json({ message: 'SubTask not found' });
      }
      await tasks.updateProgress();

      res.json({ message: 'SubTask deleted successfully' });
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
  
  
  