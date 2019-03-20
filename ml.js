const tf = require('@tensorflow/tfjs');
require('@tensorflow/tfjs-node');  // Use '@tensorflow/tfjs-node-gpu' if running with GPU.

const model = tf.sequential();
model.add(tf.layers.dense({units: 1, inputShape: [1]}));
// model.add(tf.layers.dense({units: 1, inputShape: [1]}));
model.compile({loss: 'meanSquaredError', optimizer: 'sgd'});
// const xs = tf.tensor2d([1, 2, 3, 4], [4, 1]);
// const ys = tf.tensor2d([1, 3, 5, 7], [4, 1]);

// model.fit(xs, ys, {epochs: 10}).then(() => {
  // model.predict(tf.tensor2d([5], [1, 1])).print();
// });
const xs = tf.tensor([[0, 1, 2, 1, 2, 0, 0, 0, 0, 7], [1, 2, 0, 2, 1, 0, 0, 0, 0, 9], [1, 1, 0, 2, 0, 0, 0, 0, 2, 8], [1, 0, 0, 0, 2, 0, 2, 0, 1, 3], [0, 1, 0, 2, 1, 0, 2, 0, 0, 1], [0, 0, 1, 2, 2, 0, 0, 1, 0, 2], [1, 0, 0, 1, 2, 0, 0, 2, 0, 7], [1, 0, 0, 0, 2, 0, 2, 0, 1, 3], [0, 1, 0, 2, 1, 0, 2, 0, 0, 1], [0, 0, 1, 2, 2, 0, 0, 1, 0, 2], [2, 0, 0, 1, 2, 0, 1, 0, 0, 2], [1, 0, 1, 2, 0, 0, 0, 2, 0, 9], [0, 1, 0, 2, 0, 0, 0, 1, 2, 6], [0, 1, 0, 0, 2, 0, 2, 1, 1, 6], [2, 1, 2, 0, 1, 2, 1, 0, 0, 8], [1, 2, 1, 2, 0, 1, 2, 0, 0, 8], [0, 2, 2, 1, 2, 1, 0, 0, 0, 7], [0, 0, 0, 0, 0, 0, 0, 0, 0, 5], [0, 0, 0, 0, 2, 0, 0, 0, 0, 4], [0, 0, 0, 0, 1, 0, 0, 0, 2, 7], [1, 0, 1, 0, 2, 0, 1, 0, 2, 2], [0, 0, 0, 0, 1, 0, 1, 0, 2, 3], [1, 0, 1, 0, 2, 0, 1, 2, 0, 2], [1, 0, 1, 0, 2, 0, 1, 0, 2, 4], [1, 0, 2, 0, 0, 0, 0, 2, 1, 5], [1, 0, 1, 1, 2, 1, 1, 2, 2, 2], [1, 1, 2, 2, 1, 2, 1, 0, 0, 9]]);
const ys = tf.tensor([1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0, 0, 1, 0, 1, 1, 1, 1, 1, 1, 1, 1]);

// Train the model using the data.
// model.fit(xs, ys, {epochs: 0}).then(() => {
  // Use the model to do inference on a data point the model hasn't seen before:
  // Open the browser devtools to see the output
  // model.predict(tf.tensor2d([5], [1, 1])).print();
  
  // model.predict([5], [1, 1]).print(); //1
  model.predict(tf.tensor2d([1, 1, 0, 2, 0, 2, 0, 0, 0, 5], [10, 1])).print(); //1
  model.predict(tf.tensor2d([1, 1, 0, 2, 0, 0, 2, 0, 0, 5], [10, 1])).print(); //0
  model.predict(tf.tensor2d([2, 1, 0, 1, 2, 0, 0, 0, 0, 9], [10, 1])).print(); //1
  // print(clf.predict([[1,1,0,2,0,2,0,0,0,5]])) #1
  // print(clf.predict([[1,1,0,2,0,0,2,0,0,5]])) #0
  // print(clf.predict([[2,1,0,1,2,0,0,0,0,9]])) #1

// });

// const input = tf.input({shape: [5]});
// const denseLayer1 = tf.layers.dense({units: 10, activation: 'relu'});
// const denseLayer2 = tf.layers.dense({units: 4, activation: 'softmax'});
// const output = denseLayer2.apply(denseLayer1.apply(input));
// const model = tf.model({inputs: input, outputs: output});
// model.predict(tf.ones([2, 5])).print();