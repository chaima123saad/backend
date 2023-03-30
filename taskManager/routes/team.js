const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team');

router.get('/', teamController.getAllTeams);
router.get('/:id', teamController.getTeamById);
router.post('/addTeam', teamController.createTeam);
router.put('/:id', teamController.updateTeamById);
router.delete('/:id', teamController.deleteTeamById);
router.get('/:id/members',teamController.getMembers);

module.exports = router;