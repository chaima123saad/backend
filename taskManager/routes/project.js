const express = require('express');
const router = express.Router();
const projectController = require('../controllers/project');

router.get('/', projectController.getProjects);
router.post('/addProject', projectController.createProject);
router.put('/:id', projectController.updateProject);
router.delete('/:id', projectController.deleteProject);
router.get('/filter', projectController.filterProjects);
router.get('/projects/completed', projectController.getCompletedProjects);
router.get('/teams/:teamId/projects/completed',projectController.getCompletedProjectsByTeam);

router.get('/:id',projectController.getMembers);

module.exports = router;