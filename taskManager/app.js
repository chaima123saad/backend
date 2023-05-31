const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();
const http = require('http');
const server = http.createServer(app);
const socketio = require('socket.io');
const io = socketio(server);
const Chat = require('./models/chat');
const User = require('./models/user');
const Project = require ('./models/project');
const Team=require('./models/team');
const fs = require('fs');

dotenv.config({ path: './config.env' });

const corsOptions = {
  origin: ['http://localhost:3000', 'http://localhost:2000'],
  methods: 'GET,PUT,POST,DELETE',
  transports: ['websocket'],
  allowedHeaders: 'Content-Type,Authorization',
  credentials: true // add this line
};

app.use(cors(corsOptions));

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With'); // add X-Requested-With header
  res.setHeader('Access-Control-Allow-Credentials', 'true'); // add this line
  next();
});

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connection successful'))
  .catch(err => console.error('Database connection error:', err));

io.on('connection', (socket) => {
  console.log(`Socket ${socket.id} connected`);

  socket.on('join-team', (teamId) => {
    socket.join(`team-${teamId}`);
  });

  socket.on('disconnect', () => {
    console.log(`Socket ${socket.id} disconnected`);
  });
});

app.post('/chat', async (req, res) => {
  const { teamId, senderId, message } = req.body;

  const chat = new Chat({
    team: teamId,
    sender: senderId,
    message
  });
  await chat.save();

  io.to(`team-${teamId}`).emit('chat-message', {
    senderId,
    message,
    createdAt: chat.createdAt
  });

  res.sendStatus(200);
});

app.get('/chat/:teamId', async (req, res) => {
  const { teamId } = req.params;

  try {
    const chats = await Chat.find({ team: teamId }).populate('sender');
    res.json(chats);
  } catch (error) {
    console.error(error);
    res.sendStatus(500);
  }
});

const userRoutes = require('./routes/user');
const teamRoutes =require('./routes/team');
const projectRoutes= require('./routes/project');
const taskRoutes= require('./routes/task');
const subtaskRoutes= require('./routes/subTask');
const statisticRoutes =require('./routes/statistic');
const chatGpt=require('./routes/chatGpt');
const login=require('./routes/login');
const archiveRoutes = require('./routes/archive');



app.get('/export-data', async (req, res) => {
  try {
    const users = await User.find();
    const projects = await Project.find();
    const teams = await Team.find();
    const exportedData = {
      users,
      projects,
      teams
    };
    const formattedData = JSON.stringify(exportedData);
    const exportFilePath = 'exported_data.json';
    fs.writeFile(exportFilePath, formattedData, (error) => {
      if (error) {
        console.error('Error exporting data:', error);
        res.sendStatus(500);
      } else {
        console.log('Data exported successfully.');
        res.download(exportFilePath);
      }
    });
  } catch (error) {
    console.error('Error fetching data:', error);
    res.sendStatus(500);
  }
});


app.use('/users',userRoutes);
app.use('/teams',teamRoutes);
app.use('/projects',projectRoutes);
app.use('/tasks',taskRoutes);
app.use('/subtasks',subtaskRoutes);
app.use('/statistics',statisticRoutes);
app.use('/login',login);
app.use('/chatGpt',chatGpt);
app.use('/archives', archiveRoutes);

const port = 2000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
