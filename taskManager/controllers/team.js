const Team = require('../models/team');

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

exports.getTeamById = async (req, res) => {
  try {
    const team = await Team.findById(req.params.id).populate('members').populate('projects');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    res.json(team);
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