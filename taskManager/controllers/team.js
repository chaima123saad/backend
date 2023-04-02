const Team = require('../models/team');
const User = require('../models/user');
exports.createTeam = async (req, res) => {
  try {
    const { name, members,owner,projects } = req.body;
    const newTeam = new Team({ name,members,owner,projects });
    await newTeam.save();
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find().populate('members').populate('projects');
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateTeamById = async (req, res) => {
  try {
    const { name, members,owner,projects } = req.body;
    const updatedTeam = await Team.findByIdAndUpdate(req.params.id, { name, members,owner,projects }, { new: true });
    if (!updatedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(updatedTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


exports.deleteTeamById = async (req, res) => {
  try {
    const deletedTeam = await Team.findByIdAndDelete(req.params.id);
    if (!deletedTeam) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json({ message: 'Team deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.getMembers = async (req, res) => {
  const teamId = req.params.id;
  try {
    const team = await Team.findById(teamId).populate('members', 'name email');
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json({ members: team.members });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.deleteTeamMember = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    const memberIndex = team.members.findIndex(member => member._id.toString() === memberId);
    team.members.splice(memberIndex, 1);
    await team.save();
    res.status(200).json({ message: 'Member removed from the team' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.addMemberToTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { userId, role } = req.body;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (team.members.find(member => member._id.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a member of the team' });
    }
    team.members.push(userId);
    if(role ==="owner"){
    team.owner = user._id;
    }
    await team.save();
    res.status(200).json({ message: 'User added to the team successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.findTeamMember = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;
    console.log(teamId);
    console.log(memberId);
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    const member = team.members.find(member => member._id.toString() === memberId);
    if (!member) {
      return res.status(404).json({ message: 'Member not found in the team' });
    }
    res.status(200).json({ member });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



exports.updateTeamOwner = async (req, res) => {
  try {
    const { teamId } = req.params;
    const { ownerId } = req.body;
    console.log(teamId);
    const team = await Team.findById(teamId);
    console.log(team );
    if (!team) {
      return res.status(404).json({ message:'Team not found'});
    }
    const newOwner = await User.findOne({ _id: ownerId });
    if (!newOwner) {
      return res.status(404).json({ message:'User not found'});
    }
    if (!team.members.includes(newOwner._id)) {
      return res.status(400).json({ message:'New owner must be a member of the team'});
    }
    team.owner = newOwner._id;
    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};