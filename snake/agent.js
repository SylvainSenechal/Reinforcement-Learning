export default class Agent {
  constructor(environnement, brain, nbDifferentsActions = 3, replayBufferSize = 8192, batchSize = 64, learningRate = 0.01, gamma = 0.99, epsilon = 0.99) {
    this.environnement = environnement
    this.brain = brain
    this.brain.summary()

    this.replayMemory = []
    this.replayBufferSize = replayBufferSize
    this.batchSize = batchSize
    this.nbDifferentsActions = nbDifferentsActions
    this.learningRate = learningRate
    this.gamma = gamma
    this.epsilon = epsilon
    this.optimizer = tf.train.adam(this.learningRate)

    this.totalReward = 0
  }


  pickAction = (nbActions, epsilon) => {
    if (Math.random() < epsilon) {
      return Math.floor(Math.random() * nbActions)
    } else {
      let stateTensor = this.environnement.getStateAsTensor(this.environnement.getState())
      return this.brain.predict(stateTensor).argMax(-1).dataSync()[0]
    }
  }
  playOneStep = () => {
    let action = this.pickAction(3, this.epsilon) // TODO: 3 with variable
    let currentState = this.environnement.getState()
    let {nextState: nextState, reward, gameOver} = this.environnement.step(action)
    this.totalReward += reward
    this.replayMemory.push([currentState, nextState, reward, action, gameOver])
    if (gameOver) {
      this.environnement.reset()
    }
  }

  playOneStepDemo = () => {
    let action = this.pickAction(3, 0) // TODO: 3 with variable
    let currentState = this.environnement.getState()
    let {nextState: nextState, reward, gameOver} = this.environnement.step(action)
    if (gameOver) {
      this.environnement.reset()
    }
  }

  trainMyBrain = () => {
    for (let epoch = 0; epoch < 10; epoch++) { // For each epoch :
      this.replayMemory = []
      this.totalReward = 0
      // Fill the replay buffer
      for (let i = 0; i < this.replayBufferSize; i++) {
        this.playOneStep()
      }
      console.log(this.replayMemory.length)
      console.log('Total reward : ', this.totalReward)
      // Train on several batch
      for (let batch = 0; batch < 100; batch++) {
        if (batch % 10 === 0) {
          console.log(`Epoch : ${epoch} Batch : ${batch}`)
          console.log(this.epsilon)
        }
        this.epsilon = Math.max(0.2, this.epsilon * 0.999)
        this.train()
      }
    }
  }

  // lossFunction = (targetQTable, q) => {
  //   return tf.tidy(() => {
  //     return tf.losses.meanSquaredError(targetQTable, q)
  //   })
  // }

  train = () => {
    let batch = this.getBatch(this.batchSize)

    // Get a batch of examples from the replay buffer.

    const lossFunction = () => tf.tidy(() => {
      const stateTensor = this.environnement.getStateAsTensor(
          batch.map(example => example[0]));
      const actionTensor = tf.tensor1d(
          batch.map(example => example[3]), 'int32');
      const qs = this.brain.apply(stateTensor, {training: true})
          .mul(tf.oneHot(actionTensor, 3)).sum(-1);

      const rewardTensor = tf.tensor1d(batch.map(example => example[2]));
      const nextStateTensor = this.environnement.getStateAsTensor(
          batch.map(example => example[1]));
      const nextMaxQTensor =
          this.brain.predict(nextStateTensor).max(-1);
      const doneMask = tf.scalar(1).sub(
          tf.tensor1d(batch.map(example => example[4])).asType('float32'));
      const targetQs =
          rewardTensor.add(nextMaxQTensor.mul(doneMask).mul(this.gamma));
      return tf.losses.meanSquaredError(targetQs, qs);
    });

    // Calculate the gradients of the loss function with repsect to the weights
    // of the online DQN.
    const grads = tf.variableGrads(lossFunction);
    // Use the gradients to update the online DQN's weights.
    this.optimizer.applyGradients(grads.grads);
    tf.dispose(grads);
    // TODO(cais): Return the loss value here?



    //
    // const lossFunction = () => tf.tidy(() => {
    //   let currentStateTensor = this.environnement.getStateAsTensor(batch.map(trainingSample => trainingSample[0]))
    //   let actionTensor = tf.tensor1d(batch.map(trainingSample => trainingSample[3]), 'int32')
    //   // let q = this.brain.predict(currentStateTensor).mul(tf.oneHot(actionTensor, 3)).sum(-1)
    //   let q = this.brain.apply(currentStateTensor, {training: true}).mul(tf.oneHot(actionTensor, 3)).sum(-1)
    //
    //   let rewardTensor = tf.tensor1d(batch.map(trainingSample => trainingSample[2]))
    //   let nextStateTensor = this.environnement.getStateAsTensor(batch.map(trainingSample => trainingSample[1]))
    //   let maskGameOver = tf.scalar(1).sub(tf.tensor1d(batch.map(trainingSample => trainingSample[4]))).asType('float32') // This will create a full 0s or 1s tensor that will act as a mask when multiplied with smth else
    //   let nextMaxActionQTable = this.brain.predict(nextStateTensor).max(-1)
    //   let targetQTable = rewardTensor.add(nextMaxActionQTable.mul(maskGameOver).mul(this.gamma))
    //   return tf.losses.meanSquaredError(targetQTable, q)
    // })
    //
    // const grads = tf.variableGrads(lossFunction);
    // // Use the gradients to update the online DQN's weights.
    // this.optimizer.applyGradients(grads.grads);
    // tf.dispose(grads);
    //
    // // this.optimizer.minimize(() => {
    // //   let loss = lossFunction()
    // //   return loss
    // // })
  }

  getBatch = samplesSize => {
    let results = []
    for (let i = 0; i < samplesSize; i++) {
      results.push(this.replayMemory[Math.floor(Math.random()*this.replayMemory.length)])
      // results.push(this.replayMemory[i])
    }
    return results
  }
}
