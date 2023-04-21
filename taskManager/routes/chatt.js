// const express = require('express');
// const router = express.Router();
// const natural = require('natural');
// const tf = require('@tensorflow/tfjs-node');
// const { GPT2 } = require('tfjs-gpt2');
// const GPT = new GPT2(modelParams);
// const TextDataGenerator = require('../controllers/textDataGenerator');



// // Define a POST route to tokenize, create token-ID mapping and convert text data to integer sequences
// router.post('/preprocess', (req, res) => {
//   const sentence = req.body.sentence;
//   const tokenizer = new natural.WordTokenizer();
//   const tokens = tokenizer.tokenize(sentence);

//   const tokenMap = new Map();
//   let index = 0;
//   for (const token of tokens) {
//     if (!tokenMap.has(token)) {
//       tokenMap.set(token, index);
//       index++;
//     }
//   }

//   const integerSequence = tokens.map(token => tokenMap.get(token));

//   res.json({ tokens, tokenMap, integerSequence });
// });

// // Define a POST route to train a GPT model
// router.post('/train', async (req, res) => {
//   // Define the parameters for the GPT model
//   const modelParams = {
//     vocabSize: req.body.vocabSize,
//     contextLength: req.body.contextLength,
//     embeddingSize: req.body.embeddingSize,
//     numLayers: req.body.numLayers,
//     dropoutRate: req.body.dropoutRate,
//     transformer: {
//       numHeads: req.body.numHeads,
//       hiddenSize: req.body.hiddenSize,
//       filterSize: req.body.filterSize,
//     },
//   };

//   // Create a TextDataGenerator to prepare the input data
//   const textData = req.body.textData;
//   const dataGenerator = new TextDataGenerator(textData, modelParams.vocabSize);

//   // Define the GPT model architecture
//   const gpt = new GPT(modelParams);
//   const model = gpt.createModel();
//   model.compile({
//     loss: tf.losses.sparseCategoricalCrossentropy(),
//     optimizer: tf.train.adam(),
//   });

//   // Prepare the input and output data for training
//   const sequenceLength = req.body.sequenceLength;
//   const batchSize = req.body.batchSize;
//   const numEpochs = req.body.numEpochs;
//   const stepsPerEpoch = Math.floor((textData.length - sequenceLength) / batchSize);
//   const inputDataset = dataGenerator.dataset(
//     sequenceLength,
//     batchSize,
//     true, // shuffle
//     true, // repeat
//     stepsPerEpoch // stepsPerEpoch
//   );
//   const outputDataset = dataGenerator.dataset(
//     sequenceLength,
//     batchSize,
//     true, // shuffle
//     true, // repeat
//     stepsPerEpoch // stepsPerEpoch
//   );

//   // Train the model
//   await model.fit(inputDataset, outputDataset, {
//     epochs: numEpochs,
//     callbacks: {
//       onEpochEnd: async (epoch, logs) => {
//         console.log(`Epoch ${epoch + 1}: loss = ${logs.loss.toFixed(6)}`);
//       },
//     },
//   });

//   // Save the trained model
//   await model.save('gpt-model');

//   res.json({ success: true });
// });

// module.exports = router;

