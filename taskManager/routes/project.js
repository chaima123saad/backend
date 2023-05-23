const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');

router.get('/projects/completed', projectController.getCompletedProjects);
router.get('/:projectId/tasks/count', projectController.getTaskNumber);
router.get('/:projectId/tasks', projectController.getProjectTask);
router.get('/:id', projectController.getMembers);

router.get('/',projectController.getProjects);
router.get('/project/:id',projectController.getProjectById);
router.post('/addProject', projectController.createProject);
router.put('/updateProject/:id', projectController.updateProject);
router.delete('/deleteProject/:id', projectController.deleteProject);
router.get('/filter', projectController.filterProjects);
router.get('/teams/:userId/projects/completed', projectController.getCompletedProjectsByUsers);

module.exports = router;

