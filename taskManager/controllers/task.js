const Task = require('../models/task');
const Project = require('../models/project');
exports.createTask = async (req, res) => {
  try {

    const { name, status ,priority  ,project ,users } = req.body;
    const newTask = new Task({ name, status ,priority  ,project ,users });
    await newTask.save();
    res.status(201).json(newTask);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.statueProjectUpdate = async (req, res) => {
  try {
   
    const task = await Task.findByIdAndUpdate(req.params, { status: 'completed' }, { new: true });  

    const projectTasks = await Task.find({ projectId: task.project });
    
    const allTasksCompleted = projectTasks.every(projectTask => projectTask.status === 'completed');
    const completedTasks = projectTasks.filter(projectTask => projectTask.status === 'completed');

    if (allTasksCompleted) {
      await Project.findByIdAndUpdate(task.project, { status: 'completed' }, { new: true });
    }
    else if(completedTasks.length >=1 && !allTasksCompleted) { 
      await Project.findByIdAndUpdate(task.project, { status: 'inProgress' }, { new: true })
    }
    else {
      await Project.findByIdAndUpdate(task.project, { status: 'toDo' }, { new: true })
    }

    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find();
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getCompletedTasksByUserAndProject = async (req, res) => {
  try {
    const userId = req.params.userId;
    const projectId = req.params.projectId;
    const tasks = await Task.find({ user: userId, project: projectId, status: 'completed' });
    res.send(tasks);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Controller function to retrieve a single task by ID
exports.getTaskById = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to update a task by ID
exports.updateTaskById = async (req, res) => {
  try {
    const { title, description, status } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { title, description, status }, { new: true });
    if (!updatedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json(updatedTask);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Controller function to delete a task by ID
exports.deleteTaskById = async (req, res) => {
  try {
    const deletedTask = await Task.findByIdAndDelete(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
