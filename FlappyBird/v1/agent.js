import {ALL_ACTIONS, NB_ACTION} from './grid.js'
// import {DRAWING_OFFSET_X, DRAWING_OFFSET_Y, DRAWING_SIZE_CASE} from './grid.js'

const LEARNING_RATE = 0.2
const GAMMA = 0.99
const EPOCH = 100
const EPSILON_PICK_ACTION_FULL_GREEDY = 0

// TODO: epsilon
export default class Agent {
  constructor(environnement) {
    this.environnement = environnement
    // this.QTable = new Array(SIZE_GRID*SIZE_GRID).fill().map( () => new Array(NB_ACTION).fill(0))
    this.QTable = new Array(Math.pow(2, 21 - 7 - 7+ 4)).fill().map( () => new Array(NB_ACTION).fill(0))
    this.nbEpoch = 0
    this.nbUpdateQTable = 0
    this.lastNbUpdate = 0
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

    return {reward: reward, nextState: nextState, action: action}
  }

  train = () => {
    console.log('nbUpd: ', this.nbUpdateQTable)
    console.log('Diff : ', this.nbUpdateQTable - this.lastNbUpdate)
    this.lastNbUpdate = this.nbUpdateQTable
    for (let i = 0; i < EPOCH; i++) {
      this.nbEpoch++
      if (this.nbEpoch % 100 === 0) console.log(this.nbEpoch)
      this.environnement.reset()
      let currentState = this.environnement.getState()
      while (!this.environnement.checkGameOver()) {
        let epsilon = 0.01
        let {reward, nextState, action} = this.playStep(epsilon, currentState)
        let nextAction = this.pickActionEpsilonGreedy(EPSILON_PICK_ACTION_FULL_GREEDY, nextState)

        this.QTable[currentState][action] = this.QTable[currentState][action] + LEARNING_RATE * (reward + GAMMA * this.QTable[nextState][nextAction] - this.QTable[currentState][action])
        currentState = nextState
        this.nbUpdateQTable +=1
      }
    }
  }
}
