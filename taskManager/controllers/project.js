const Project = require('../models/project');
const Task = require('../models/task');

exports.createProject = async (req, res) => {
  const { name,description,team,clientName,budge,tasks } = req.body;
  try {
    const project = await Project.create({ name,description,team,clientName,budge,tasks});
    res.status(201).json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Server error final :(' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();
    res.json({ projects });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getCompletedProjects = async (req, res) => {
  try {
    const projects = await Project.find({ status: 'completed' });
    res.send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getCompletedProjectsByTeam = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const projects = await Project.find({ team: teamId, status: 'completed' });
    res.send(projects);
  } catch (error) {
    res.status(500).send(error);
  }
};

exports.getProjectById = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    res.json({ project });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.updateProject = async (req, res) => {
  try {
    const { name,description,team,clientName,budge,tasks } = req.body;
    const updatedProject = await Project.findByIdAndUpdate(req.params.id, { name,description,team,clientName,budge,tasks }, { new: true });
    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(updatedProject);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.deleteProject = async (req, res) => {
  const { projectId } = req.params;
  try {
    const project = await Project.findById(projectId);
    if (!project) {
      return res.status(404).json({ error: 'Project not found' });
    }
    await project.remove();
    res.json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.filterProjects = async (req, res) => {

    const { name, status} = req.query;
    const filter = {};
    if (name) {
      filter.name = { $regex: name, $options: 'i' };
    }
    if (status) {
      filter.priority = { $regex: status, $options: 'i' };
    }
    try {
      const projects = await Project.find(filter);
      res.json({ projects });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

  exports.getMembers = async (req, res) => {
    const projectId = req.params.id;
    try {
      const project = await Project.findById(projectId).populate({
        path: 'team',
        populate: { path: 'members', select: 'name email' }
      });
      if (!project) {
        return res.status(404).json({ error: 'Project not found' });
      }
      res.json({ members: project.team.members });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };
  



exports.searchProjects = async (req, res) => {
    const searchTerm = req.query.q;
    try {
      const projects = await Project.find({
        $or: [
          { name: { $regex: searchTerm, $options: 'i'}},
          { description: { $regex: searchTerm, $options: 'i'}},
          { dateFin:{ $regex: searchTerm,$options:'i'}}
        ]
      });
      res.json({ projects });
    } catch (error) {
      res.status(500).json({ error: 'Server error' });
    }
  };

exports.getUsersByProject = async (req, res) => {
  try {
    const projectId = req.params.projectId;
    const project = await Project.findById(projectId);
    const users = project.users;
    res.send(users);
  } catch (error) {
    res.status(500).send(error);
  }
};
