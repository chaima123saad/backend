const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team');

router.get('/', teamController.getAllTeams);
router.post('/addTeam', teamController.createTeam);
//router.put('/:id', teamController.updateTeamById);
router.delete('/deleteTeam/:id', teamController.deleteTeamById);
router.delete('/:teamId/:userId', teamController.deleteTeamMember);
router.put('/:teamId/addMemberToTeam', teamController.addMemberToTeam );
router.put('/:teamId/updateTeamOwner', teamController.updateTeamOwner );

router.get('/:teamId/:userId', teamController.findTeamMember );
router.get('/:id/members',teamController.getMembers);

module.exports = router;