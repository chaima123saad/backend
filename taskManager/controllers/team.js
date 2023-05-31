const Team = require('../models/team');
const User = require('../models/user');
const Archive = require('../models/archive');
const Project = require('../models/project');

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

exports.getTeamById = async (req, res) => {
  const teamId = req.params.teamId;
  Team.findById(teamId)
    .then((team) => {
      if (!team) {
        return res.status(404).json({ message: 'Team not found' });
      }
      res.status(200).json(team);
    })
    .catch((error) => {
      console.error(error);
      res.status(500).json({ message: 'Internal server error' });
    });

  }

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
    const team = await Team.findById(req.params.id).populate({
      path: 'members',
      match: { role: 'owner' },
    });

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const owner = team.members.find(member => member.role === 'owner');
const archivedTeam = {
  name: team.name,
  ownerName: owner ? owner.name : null,
  ownerLastName: owner ? owner.lastName : null,
  deletedAt: new Date(),
};


    await Archive.updateOne({}, { $push: { deletedTeams: archivedTeam } });

    await Team.findByIdAndRemove(req.params.id);

    res.status(200).json({ message: 'Team deleted', team: archivedTeam });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};




exports.getMembers = async (req, res) => {
  const teamId = req.params.teamId;
  try {
    const team = await Team.findById(teamId).populate('members', 'name lastName email profileImage role speciality tasks');
    if (!team) {
      return res.status(404).json({ error: 'Team not found' });
    }
    res.json({ members: team.members });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.teamMembers = async  (req, res) => {
  const teamId = req.params.teamId;

  // Retrieve team members from the database based on the teamId
  User.find({ teamId })
    .then((teamMembers) => {
      res.json(teamMembers);
    })
    .catch((error) => {
      console.log(error);
      res.status(500).json({ error: 'Failed to retrieve team members' });
    });
};
exports.deleteTeamMember = async (req, res) => {
  try {
    const { teamId, memberId } = req.params;
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }
    console.log("memberId",memberId);
    const memberIndex = team.members.findIndex(member => member._id.toString() === memberId);
    console.log("memeberindex",memberIndex);
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

exports.updateTeamMember = async (req, res) => {
  const { teamId, memberId } = req.params;
  const { role } = req.body;
  try {
    const team = await Team.findById(teamId);

    if (!team) {
      return res.status(404).json({ error: "Team not found" });
    }
    const memberIndex = team.members.findIndex((m) => m.toString() === memberId);
    if (memberIndex === -1) {
      return res.status(404).json({ error: "Member not found" });
    }
   const user = await User.findById(memberId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    if (role === "owner") {
      const currentOwnerIndex = team.members.findIndex((m) => m.role === "owner");
      if (currentOwnerIndex !== -1) {
        team.members[currentOwnerIndex].role = "employee";
        const currentOwnerUser = await User.findOne({ teamId, role: "owner" });
        if (currentOwnerUser) {
          currentOwnerUser.role = "employee";
          await currentOwnerUser.save();
        }
      }
    }
    team.members[memberIndex].role = role;
    user.role = role;
    await team.save();
    await user.save();
    res.json({ message: "Member role updated successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.teamProjects = async (req, res) => {
  try {
    const { teamId } = req.params;
    console.log("teamId",teamId);
    const projects = await Project.find({team: teamId });

    res.json({ projects });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
};

