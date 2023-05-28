const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task');

// Assuming you're using Node.js and Express.js
  
router.get('/:id', taskController.getTasks);
router.post('/addTask', taskController.createTask);
router.put('/:id', taskController.updateTaskById);
router.delete('/:id', taskController.deleteTaskById);
router.put('/:id/complete', taskController.completeTask );
router.get('/:id/progress', taskController.progressTaskById);
router.get("/user/:userId/project/:projectId", taskController.getTasksByProjectAndUser);
  

module.exports = router;
