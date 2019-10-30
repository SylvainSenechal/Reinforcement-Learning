const EPSILON = 0.1

export default class Agent {
  constructor(environnement, brain, nbDifferentsActions = 3, replayBufferSize = 1024, batchSize = 128, learningRate = 0.001, gamma = 0.99) {
    this.environnement = environnement
    this.brain = brain

    this.replayMemory = []
    this.replayBufferSize = replayBufferSize
    this.batchSize = batchSize
    this.nbDifferentsActions = nbDifferentsActions
    this.learningRate = learningRate
    this.gamma = gamma
    this.optimizer = tf.train.adam(this.learningRate)

    this.totalReward = 0
  }


  pickAction = nbActions => { // TODO: passer espilon dedans
    if (Math.random() < EPSILON) {
      return Math.floor(Math.random() * nbActions)
    } else {
      let stateTensor = this.environnement.getStateAsTensor(this.environnement.getState())
      return this.brain.predict(stateTensor).argMax(-1).dataSync()[0]
    }
  }
  playOneStep = () => {
    let action = this.pickAction(3) // TODO: 3 with variable
    let currentState = this.environnement.getState()
    let {nextState: nextState, reward, gameOver} = this.environnement.step(action)

    this.replayMemory.push([currentState, nextState, reward, action, gameOver])
    if (gameOver) {
      this.environnement.reset()
    }
  }

  trainMyBrain = () => {
    this.replayMemory = []
    for (let i = 0; i < this.replayBufferSize; i++) {
      this.playOneStep()
    }
    for (let i = 0; i < 5; i++) {
      console.log('epochB : ', i)
      this.train()
    }
  }

  lossFunction = (targetQTable, q) => {
    return tf.tidy(() => {
      return tf.losses.meanSquaredError(targetQTable, q)
    })
  }
  //
  // train = () => {
  //   let batch = this.getBatch(this.batchSize)
  //
  //
  //
  //   function lossFunction(targetQTable, q) {
  //     return tf.tidy(() => {
  //       return tf.losses.meanSquaredError(targetQTable, q)
  //     })
  //   }
  //
  //   // let gradients = tf.variableGrads(lossFunction)
  //   // this.optimizer.applyGradient(gradients.grads)
  //   // tf.dispose()
  //
  //   this.optimizer.minimize(() => {
  //     let currentStateTensor = this.environnement.getStateAsTensor(batch.map(trainingSample => trainingSample[0]))
  //     let actionTensor = tf.tensor1d(batch.map(trainingSample => trainingSample[3]), 'int32')
  //     let q = this.brain.predict(currentStateTensor).mul(tf.oneHot(actionTensor, 3)).sum(-1)
  //
  //     let rewardTensor = tf.tensor1d(batch.map(trainingSample => trainingSample[2]))
  //     let nextStateTensor = this.environnement.getStateAsTensor(batch.map(trainingSample => trainingSample[1]))
  //     let maskGameOver = tf.scalar(1).sub(tf.tensor1d(batch.map(trainingSample => trainingSample[4]))) // This will create a full 0s or 1s tensor that will act as a mask when multiplied with smth else
  //     let nextMaxActionQTable = this.brain.predict(nextStateTensor).max(-1)
  //     let targetQTable = rewardTensor.add(nextMaxActionQTable.mul(maskGameOver).mul(this.gamma))
  //     return tf.losses.meanSquaredError(targetQTable, q)
  //   })
  //   console.log('oui')
  // }

  train = () => {
    let batch = this.getBatch(this.batchSize)
    console.log('TRAIN')
    const lossFunction = () => tf.tidy(() => {
      console.log('UN')
      // let currentStateTensor = batch.map(trainingSample => trainingSample[0]) // TODO: a revoir function getstatetensor, encapsuler avec tf.tensor ?
      let currentStateTensor = this.environnement.getStateAsTensor(batch.map(trainingSample => trainingSample[0]))
      let actionTensor = tf.tensor1d(batch.map(trainingSample => trainingSample[3]), 'int32')
      let q = this.brain.predict(currentStateTensor).mul(tf.oneHot(actionTensor, 3)).sum(-1)
      console.log('DEUX')

      let rewardTensor = tf.tensor1d(batch.map(trainingSample => trainingSample[2]))
      // let nextStateTensor = batch.map(trainingSample => trainingSample[1]) // TODO: a revoir function getstatetensor, encapsuler avec tf.tensor ?
      let nextStateTensor = this.environnement.getStateAsTensor(batch.map(trainingSample => trainingSample[1]))
      console.log('TROIS')
      let maskGameOver = tf.scalar(1).sub(tf.tensor1d(batch.map(trainingSample => trainingSample[4]))) // This will create a full 0s or 1s tensor that will act as a mask when multiplied with smth else
      let nextMaxActionQTable = this.brain.predict(nextStateTensor).max(-1)
      let targetQTable = rewardTensor.add(nextMaxActionQTable.mul(maskGameOver).mul(this.gamma))
      console.log('QUATRE')

      return tf.losses.meanSquaredError(targetQTable, q)
    })
    // let gradients = tf.variableGrads(lossFunction)
    // this.optimizer.applyGradient(gradients.grads)
    // tf.dispose()
    console.log('TRAIN2')

    this.optimizer.minimize(() => {
      console.log('LOSS1')

      let loss = lossFunction()
      console.log('LOSS2')

      return loss
    })
    console.log('oui')
  }

  // train =  () => {
  //   // Get a batch of examples from the replay buffer.
  //   const batch = this.getBatch(this.batchSize);
  //   const lossFunction = () => tf.tidy(() => {
  //     const stateTensor = this.environnement.getStateAsTensor(
  //         batch.map(example => example[0]));
  //     const actionTensor = tf.tensor1d(
  //         batch.map(example => example[3]), 'int32');
  //     const qs = this.brain.apply(stateTensor, {training: true})
  //         .mul(tf.oneHot(actionTensor, 3)).sum(-1);
  //
  //     const rewardTensor = tf.tensor1d(batch.map(example => example[2]));
  //     const nextStateTensor = this.environnement.getStateAsTensor(
  //         batch.map(example => example[1]));
  //     const nextMaxQTensor =
  //         this.brain.predict(nextStateTensor).max(-1);
  //     const doneMask = tf.scalar(1).sub(
  //         tf.tensor1d(batch.map(example => example[4])).asType('float32'));
  //     const targetQs =
  //         rewardTensor.add(nextMaxQTensor.mul(doneMask).mul(this.gamma));
  //     return tf.losses.meanSquaredError(targetQs, qs);
  //   });
  //
  //   // Calculate the gradients of the loss function with repsect to the weights
  //   // of the online DQN.
  //   const grads = tf.variableGrads(lossFunction);
  //   // Use the gradients to update the online DQN's weights.
  //   this.optimizer.applyGradients(grads.grads);
  //   tf.dispose(grads);
  //   // TODO(cais): Return the loss value here?
  // }

  getBatch = samplesSize => {
    let results = []
    for (let i = 0; i < samplesSize; i++) {
      results.push(this.replayMemory[Math.floor(Math.random()*this.replayMemory.length)])
      // results.push(this.replayMemory[i])
    }
    return results
  }
}
