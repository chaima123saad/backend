const Task = require('../models/task');
const Project = require('../models/project');
const User = require('../models/user');
const Subtask =require('../models/subTask');

exports.createTask = async (req, res) => {
  try {
    const { name, status, priority, users, subTask, progress } = req.body;
    const project = await Project.findOne({ status: 'inProgress' });
    if (!project) {
      return res.status(404).json({ message: 'No project found with status "inProgress"' });
    }

    const newTask = new Task({ name, status, priority, project: project._id, users, subTask, progress });
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



exports.getTasks = async (req, res) => {
  const userId = req.params.id;
  try {
    const user = await User.findById(userId).populate('tasks', 'name status priority subTask');
    if (!user) {
      return res.status(404).json({ error: 'user not found' });
    }
    
    for (const task of user.tasks) {
      console.log("task",task);
      await task.updateProgress();
    }
    
    res.json({ tasks: user.tasks });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
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
    const { name, status,subTask } = req.body;
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, { name, status,subTask }, { new: true });
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
    const deletedTask = await Task.deleteOne(req.params.id);
    if (!deletedTask) {
      return res.status(404).json({ message: 'Task not found' });
    }
    res.json({ message: 'Task deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.progressTaskById = async (req, res) => {
  const taskId = req.params.id;

  try {
    const task = await Task.findById(taskId);
    if (!task) {
      return res.status(404).json({ message: 'Task not found' });
    }

    const subtaskIds = task.subTask;
    if (!subtaskIds || !Array.isArray(subtaskIds) || subtaskIds.length === 0) {
      return res.status(200).json({ progress: 0 }); // No subtasks or subtasks is not an array, progress is 0%
    }

    // Retrieve the subtasks by their IDs
    const subtasks = await Subtask.find({ _id: { $in: subtaskIds } });

    // Filter completed subtasks
    const completedSubtasks = subtasks.filter((subtask) => subtask.completed === true);
    const progress = (completedSubtasks.length / subtasks.length) * 100;

    res.status(200).json({ progress });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.getTasksByProjectAndUser = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const userId = req.params.userId;

    const project = await Project.findById(projectId);
    const user = await User.findById(userId);

    if (!project || !user) {
      throw new Error("Project or user not found");
    }

    const tasks = await Task.find({
      project: projectId,
      users: userId,
    });
    for (const task of tasks) {
      console.log("task",tasks);
      await task.updateProgress();
    }
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "An error occurred while fetching tasks" });
  }
};
