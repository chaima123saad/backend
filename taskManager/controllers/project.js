const Project = require('../models/project');
const Task = require('../models/task');

exports.createProject = async (req, res) => {
  const { name,description,team,status,priority,clientName,budge,tasks,progress } = req.body;
  try {
    const newProject = new Project({ name,description,team,status,priority,clientName,budge,tasks,progress });
    await newProject.save();
    res.status(201).json({ newProject });
  } catch (error) {
    res.status(500).json({ error: 'Server error final :(' });
  }
};

exports.getProjects = async (req, res) => {
  try {
    const projects = await Project.find();

    for (const project of projects) {
      console.log("******project:", project);
      await project.updateProgress();
    }

    res.json(projects);
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

exports.getTaskNumber= async (req, res, next) => {
  const { projectId } = req.params;
  try {
    const taskCount = await Task.countDocuments({ project: projectId });
    res.json({ count: taskCount });
  } catch (error) {
    next(error);
  }
}

exports.getProjectTask= async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId });
    res.json(tasks);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server Error' });
  }
}

exports.getCompletedProjectsByUsers = async (req, res) => {
  try {
    const userId = req.params.userId;
    const projects = await Project.find({ user: userId, status: 'completed' });
    res.send(projects);
  } catch (error) {
    res.status(500).send(error);
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
  try {
    const project =await Project.findById(req.params.id);
    await Project.findByIdAndRemove(project);
    res.status(200).json({ message: 'Project deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
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

  exports.getProjectById = async (req, res) => {
    try {
      const project = await Project.findById(req.params.id);
      if (!project) {
        return res.status(404).json({ message: 'Project not found' });
      }
      res.json(project);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  };
