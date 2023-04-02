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


dotenv.config({ path: './config.env' });

app.use(cors());
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


const userRoutes = require('./routes/user');
const teamRoutes =require('./routes/team');
const projectRoutes= require('./routes/project');
const taskRoutes= require('./routes/task');
const statisticRoutes =require('./routes/statistic');
const login=require('./routes/login');

app.use('/users',userRoutes);
app.use('/teams',teamRoutes);
app.use('/projects',projectRoutes);
app.use('/tasks',taskRoutes);
app.use('/statistics',statisticRoutes);
app.use('/login',login);

const port = 2000;
app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
