const express = require('express');
const router = express.Router();
const { Configuration, OpenAIApi } = require('openai');

router.get('/task-list/:projectName', async (req, res) => {
  const { projectName } = req.params;

  const configuration = new Configuration({
    apiKey: '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',
  });
  const openai = new OpenAIApi(configuration);

  try {
    const completion = await openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: [
        {
          role: 'system',
          content: 'You are a user requesting a task list.',
        },
        {
          role: 'user',
          content: `give me a task list of ${projectName} project`,
        },
      ],
    });

    if (
      completion &&
      completion.data.choices &&
      completion.data.choices.length > 0
    ) {
      const message = completion.data.choices[0].message.content;

      res.json({ listItems: message }); 
    } else {
      res.status(500).json({ error: 'No completion data found.' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred.' });
  }
});

module.exports = router;


