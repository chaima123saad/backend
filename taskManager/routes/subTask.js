const express = require('express');
const router = express.Router();
const subtaskController = require('../controllers/subTask');

router.get('/:id', subtaskController.getSubTasks);
router.post('/addSubTask', subtaskController.createSubTask);
router.put('/:id', subtaskController.updateSubTaskById);
router.delete('/:id', subtaskController.deleteSubTaskById);

module.exports = router;