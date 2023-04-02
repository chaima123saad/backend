const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task');

router.get('/', taskController.getAllTasks);
router.post('/addTask', taskController.createTask);
router.put('/:id', taskController.updateTaskById);
router.delete('/:id', taskController.deleteTaskById);
router.put('/:id/complete', taskController.completeTask );

module.exports = router;
