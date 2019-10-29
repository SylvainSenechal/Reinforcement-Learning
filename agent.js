const EPSILON = 0.99

export default class Agent {
  constructor(environnement, brain) {
    this.environnement = environnement
    this.brain = brain

    this.replayMemory = []
    this.replayBufferSize = 10
  }


  pickAction = nbActions => { // TODO: passer espilon dedans
    if (Math.random() < EPSILON) {
      return Math.floor(Math.random() * nbActions)
    } else {
      let stateTensor = this.environnement.getStateAsTensor()
      return brain.predict(stateTensor).argMax(-1).dataSync()[0]
    }
  }
  playOneStep = () => {
    let action = this.pickAction(3) // TODO: 3 with variable
    let currentState = this.environnement.getStateAsTensor()
    let {reward, nextState, gameOver} = this.environnement.step(action)

    this.replayMemory.push([currentState, nextState, reward, action])
  }

  trainMyBrain = () => {
    for (let i = 0; i < this.replayBufferSize; i++) {
      this.playOneStep()
    }

    this.train()
  }

  train = () => {

  }
}

// train :
// remplir le buffer
// faire le train
// on peut tester aorès
