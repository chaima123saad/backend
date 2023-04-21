
class TextDataGenerator {
    constructor(textData, vocabSize) {
      this.textData = textData;
      this.vocabSize = vocabSize;
      this.tokenizer = new natural.WordTokenizer();
    }
  
    *dataGenerator(sequenceLength, batchSize, shuffle, repeat, stepsPerEpoch) {
      const numSequences = Math.floor((this.textData.length - sequenceLength) / batchSize) * batchSize;
      const numBatches = numSequences / batchSize;
  
      const sequences = [];
      for (let i = 0; i < numSequences; i++) {
        const start = i;
        const end = i + sequenceLength;
        const sequence = this.textData.slice(start, end);
        sequences.push(sequence);
      }
  
      if (shuffle) {
        for (let i = sequences.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [sequences[i], sequences[j]] = [sequences[j], sequences[i]];
        }
      }
  
      while (true) {
        for (let i = 0; i < numBatches; i++) {
          const start = i * batchSize;
          const end = start + batchSize;
          const batchSequences = sequences.slice(start, end);
  
          const batchInputs = [];
          const batchOutputs = [];
          for (const sequence of batchSequences) {
            const tokens = this.tokenizer.tokenize(sequence);
            const integerSequence = tokens.map(token => this.tokenMap.get(token) ?? this.vocabSize - 1);
            const input = integerSequence.slice(0, -1);
            const output = integerSequence.slice(1);
            batchInputs.push(input);
            batchOutputs.push(output);
          }
  
          yield [tf.tensor2d(batchInputs), tf.tensor2d(batchOutputs)];
        }
  
        if (!repeat) {
          break;
        }
      }
    }
  
    dataset(sequenceLength, batchSize, shuffle, repeat, stepsPerEpoch) {
      const generator = this.dataGenerator(sequenceLength, batchSize, shuffle, repeat, stepsPerEpoch);
      return tf.data.generator(generator);
    }
  }
  
export default { TextDataGenerator };
  