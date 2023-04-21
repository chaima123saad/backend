const Task = require('../models/task');
const Project = require('../models/project');

//will be deleted in the futur 
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

exports.completeTask = async (req, res) => {
  try {
    const taskId = req.params.id;
    const task = await Task.findById(taskId);

    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

//add condition :how the status be completed

    task.status = 'completed';
    await task.save();

    const project = await Project.findById(task.project);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    const allTasksCompleted = project.tasks.every(task => task.status === 'completed');

    if (allTasksCompleted) {
      project.status = 'completed';
      await project.save();
    }

    const completedTasks = await Task.countDocuments({ projectId: project.projectId, status: "completed" });
    if (completedTasks === 1 && !allTasksCompleted) {
      project.status = "inProgress";
      await project.save();
    }

    res.status(200).json({ message: 'Task completed successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to complete task' });
  }
};



exports.getTodoTasks = async (req, res) => {
  const userId = req.params.userId;
  try {
    const tasks = await Task.find({ userId: userId, status: 'toDo' });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getInProgressTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, status: 'inprogress' });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getDoneTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ userId: req.user.id, status: 'done' });
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


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
