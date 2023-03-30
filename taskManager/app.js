const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const app = express();

dotenv.config({ path: './config.env' });

app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const uri = process.env.MONGODB_URI;
mongoose.connect(uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database connection successful'))
  .catch(err => console.error('Database connection error:', err));

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
