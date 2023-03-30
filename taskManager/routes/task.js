const express = require('express');
const router = express.Router();
const taskController = require('../controllers/task');

router.get('/', taskController.getAllTasks);

router.get('/:id', taskController.getTaskById);

router.post('/addTask', taskController.createTask);

router.put('/:id', taskController.updateTaskById);

router.delete('/:id', taskController.deleteTaskById);

router.patch('/status/:id', taskController.statueProjectUpdate );


module.exports = router;
