// Architecture from : https://github.com/tensorflow/tfjs-examples/blob/master/snake-dqn/dqn.js
// import * as tf from '@tensorflow/tfjs';

const neuralNetwork = (h = 16, w = 16) => {
  const model = tf.sequential()
  model.add(tf.layers.conv2d({
    filters: 128,
    kernelSize: 3,
    strides: 1,
    activation: 'relu',
    inputShape: [16, w, 2]
  }))
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.conv2d({
    filters: 256,
    kernelSize: 3,
    strides: 1,
    activation: 'relu'
  }))
  model.add(tf.layers.batchNormalization());
  model.add(tf.layers.conv2d({
    filters: 256,
    kernelSize: 3,
    strides: 1,
    activation: 'relu'
  }))
  model.add(tf.layers.flatten())
  model.add(tf.layers.dense({units: 100, activation: 'relu'}))
  model.add(tf.layers.dropout({rate: 0.25}))
  model.add(tf.layers.dense({units: 3}))

  return model
}

export default neuralNetwork
