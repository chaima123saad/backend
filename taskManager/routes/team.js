const express = require('express');
const router = express.Router();
const teamController = require('../controllers/team');

router.get('/', teamController.getAllTeams);
router.post('/addTeam', teamController.createTeam);
router.get('/:teamId', teamController.getTeamById);
//router.put('/:id', teamController.updateTeamById);
router.delete('/deleteTeam/:id', teamController.deleteTeamById);
router.delete('/:teamId/members/:memberId', teamController.deleteTeamMember);
router.put('/:teamId/addMemberToTeam', teamController.addMemberToTeam );
router.put('/:teamId/updateTeamOwner', teamController.updateTeamOwner );

//router.get('/:teamId/:userId', teamController.findTeamMember );
router.get('/:teamId/members',teamController.getMembers);
//router.get('/:teamId/members',teamController.teamMembers);
router.put("/:teamId/members/:memberId", teamController.updateTeamMember);

module.exports = router;