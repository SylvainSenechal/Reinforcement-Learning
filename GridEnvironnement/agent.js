import {ALL_ACTIONS, NB_ACTION, SIZE_GRID} from './grid.js'

const LEARNING_RATE = 0.01
const GAMMA = 0.95
const EPOCH = 2000
const EPSILON_PICK_ACTION_FULL_GREEDY = 0

// TODO: epsilon
export default class Agent {
  constructor(environnement) {
    this.environnement = environnement
    this.QTable = new Array(SIZE_GRID*SIZE_GRID).fill().map( () => new Array(NB_ACTION).fill(0))
    this.nbEpoch = 0
  }

  pickActionEpsilonGreedy = (epsilon, currentState) => {
    if (Math.random() < epsilon) {
      return Math.floor(Math.random() * NB_ACTION)
    } else {
      return ALL_ACTIONS[this.argMax(this.QTable[currentState])]
    }
  }

  argMax = array => array.indexOf(Math.max(...array))

  playStep = (epsilon, currentState) => {
    let action = this.pickActionEpsilonGreedy(epsilon, currentState)
    let {reward, nextState} = this.environnement.step(action)
    // console.log(reward)
    // console.log(nextState)
    // console.log(gameOver)
    return {reward: reward, nextState: nextState, action: action}
  }

  train = () => {
    for (let i = 0; i < EPOCH; i++) {
      this.nbEpoch++
      if (this.nbEpoch % 10000 === 0) console.log(this.nbEpoch)
      this.environnement.reset()
      let currentState = this.environnement.getState()

      while (!this.environnement.checkGameOver()) {
        let epsilon = 0.5
        let {reward, nextState, action} = this.playStep(epsilon, currentState)
        let nextAction = this.pickActionEpsilonGreedy(EPSILON_PICK_ACTION_FULL_GREEDY, nextState)

        this.QTable[currentState][action] = this.QTable[currentState][action] + LEARNING_RATE * (reward + GAMMA * this.QTable[nextState][nextAction] - this.QTable[currentState][action])
        currentState = nextState
      }
    }
  }
}
