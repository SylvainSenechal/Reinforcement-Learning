// Architecture from : https://github.com/tensorflow/tfjs-examples/blob/master/snake-dqn/dqn.js
// import * as tf from '@tensorflow/tfjs';

const neuralNetwork = (h = 8, w = 8) => {
  const model = tf.sequential()
  model.add(tf.layers.conv2d({
    filters: 32,
    kernelSize: 3,
    strides: 1,
    activation: 'relu',
    inputShape: [h, w, 2]
  }))
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    strides: 1,
    activation: 'relu'
  }))
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.conv2d({
    filters: 64,
    kernelSize: 3,
    strides: 1,
    activation: 'relu'
  }))
  model.add(tf.layers.flatten())
  model.add(tf.layers.dense({units: 10, activation: 'relu'}))
  model.add(tf.layers.dropout({rate: 0.25}))
  model.add(tf.layers.dense({units: 3}))

  return model
}

export default neuralNetwork
