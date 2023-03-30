const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statistics');

router.get('/', statisticsController.getTaskStatistics);

module.exports = router;
