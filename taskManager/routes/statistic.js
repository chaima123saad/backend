const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistics');

const Project = require('../models/project');
const Team = require('../models/team');
const Task = require('../models/task');
router.get('/', statisticsController.getTaskStatistics);

router.get('/completedTasksCount', async (req, res) => {
  try {
    const projects = await Project.find();
    let completedTasksCount = 0;

    for (const project of projects) {
      const completedTasks = await Task.find({ _id: { $in: project.tasks }, progress: 100 });
      completedTasksCount += completedTasks.length;
    }

    res.json({ count: completedTasksCount });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: 'An error occurred' });
  }
});


router.get('/noCompletedTasksCount', async (req, res) => {
    try {
      const projects = await Project.find();
      let noCompletedTasksCount = 0;
  
      for (const project of projects) {
        const noCompletedTasks = await Task.find({ _id: { $in: project.tasks }, progress: { $lt: 100 } });
        noCompletedTasksCount += noCompletedTasks.length;
      }
  
      res.json({ count: noCompletedTasksCount });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  router.get('/totalTasksCount', async (req, res) => {
    try {
      const projects = await Project.find();
      let totalTasksCount = 0;
  
      for (const project of projects) {
        totalTasksCount += project.tasks.length;
      }
  
      res.json({ count: totalTasksCount });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  router.get('/teamProgress/:teamId', async (req, res) => {
    try {
      const teamId = req.params.teamId;
      const team = await Team.findById(teamId).populate('projects');
  
      let totalProgress = 0;
      let totalProjects = 0;
  
      if (team) {
        const { projects } = team;
  
        totalProjects = projects.length;
  
        for (const project of projects) {
          totalProgress += project.progress;
        }
      }
  
      const teamProgress = totalProjects > 0 ? Math.floor(totalProgress / totalProjects) : 0;
  
      res.json({ teamProgress });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });

  router.get('/nearestLimitDate', async (req, res) => {
    try {
      const projects = await Project.find().sort({ limiteDate: 1 }).limit(1);
      res.json({ projects });
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'An error occurred' });
    }
  });
  
  

module.exports = router;
