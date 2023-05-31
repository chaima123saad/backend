const mongoose = require('mongoose');

const ArchiveSchema = new mongoose.Schema({
  deletedProjects: [{
    name:String,
    description: String,
    priority: String,
    clientName: String,
    budget: String,
    limiteDate: Date,
    deletedAt:Date

}],
  deletedUsers: [{
    name: String,
    lastName:String,
    email: String,
    speciality: String,
    genre: String,
    adress:String,
    numero:String,
    birthDate:Date,
    deletedAt:Date

  }],
  deletedTeams: [{
    name: String,
    ownerName: String,
    ownerLastName: String,
    deletedAt:Date
  }],
  
});

const Archive = mongoose.model('Archive', ArchiveSchema);

module.exports = Archive;
