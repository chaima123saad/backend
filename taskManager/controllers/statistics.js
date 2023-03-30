const Statistics = require('../models/statistics');
const Task = require('../models/task');

// Get statistics for all tasks
exports.getTaskStatistics = async (req, res) => {
  try {
    const tasks = await Task.find({});
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'inProgress').length;

    const statistics = new Statistics({
      totalTasks,
      completedTasks,
      inProgressTasks
    });

    res.send(statistics);
  } catch (error) {
    res.status(500).send(error);
  }
};

// Get statistics for a specific user
exports.getUserStatistics = async (req, res) => {
  try {
    const userId = req.params.id;
    const tasks = await Task.find({ assignee: userId });
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.status === 'completed').length;
    const inProgressTasks = tasks.filter(task => task.status === 'inProgress').length;

    const statistics = new Statistics({
      totalTasks,
      completedTasks,
      inProgressTasks,
      user: userId
    });

    res.send(statistics);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getDashboardData = async (req, res) => {
  const userId = req.user.userId;

  try {
    // Find the user in the database
    const user = await User.findById(userId);
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    // Return the user's dashboard data
    res.json({ name: user.name, role: user.role, specialite: user.specialite });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
