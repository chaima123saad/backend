// const express = require('express');
// const router = express.Router();
// const dotenv = require('dotenv');
// const axios = require('axios');
// dotenv.config({ path: './config.env' });

// router.post('/', async (req, res) => {
//     const { message } = req.body;
  
//     try {
//       const response = await axios.post('https://api.openai.com/v1/engines/davinci/completions', {
//         prompt: `User: ${message}\nBot:`,
//         max_tokens: 50,
//         temperature: 0.5,
//         n: 1,
//         stop: '\n',
//       }, {
//         headers: {
//           'Content-Type': 'application/json',
//           'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
//         },
//       });
  
//       const { choices } = response.data;
//       const chatbotResponse = choices[0].text.trim();
  
//       res.json({ message: chatbotResponse });
//     } catch (error) {
//       console.log(error);
//       res.status(500).json({ message: 'Internal server error' });
//     }
//   });
  
//   module.exports = router;
