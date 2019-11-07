import {ALL_ACTIONS, NB_ACTION} from './snakeGame.js'

const LEARNING_RATE = 0.01
const GAMMA = 0.8
const EPOCH = 50000
const EPSILON_PICK_ACTION_FULL_GREEDY = 0
const NB_GAME_BENCHMARK = 200

export default class Agent {
  constructor(environnement) {
    this.environnement = environnement
    // Size + 1 : Last state is the lost state
    this.QTable = new Array(Math.pow(3, 15) + 1).fill().map( () => new Array(NB_ACTION).fill(0))
    this.nbEpoch = 0
    this.nbUpdatesQTable = 0
  }

  pickActionEpsilonGreedy = (epsilon, currentState) => {
    if (Math.random() < epsilon) {
      return Math.floor(Math.random() * NB_ACTION)
    } else {
      return ALL_ACTIONS[this.argMax(this.QTable[currentState])]
    }
  }

  argMax = array => array.indexOf(Math.max(...array))


  playOneStep = (epsilon, currentState) => {
    let action = this.pickActionEpsilonGreedy(epsilon, currentState)
    let {reward, nextState} = this.environnement.step(action)

    return {reward: reward, nextState: nextState, action: action}
  }

  playGreedy = () => {
    let currentState = this.environnement.getState()
    let action = this.pickActionEpsilonGreedy(0, currentState)
    this.environnement.step(action)
    if (this.environnement.checkGameOver()) this.environnement.reset()
  }

  benchmarkAgent = () => {
    this.totalRewardBenchmark = 0
    for (let i = 0; i < NB_GAME_BENCHMARK; i++) {
      this.environnement.reset()
      let currentState = this.environnement.getState()
      let nbIteration = 0 // Used in case snake is doing a loop and never lose the game
      while (!this.environnement.checkGameOver() && nbIteration < 1000) {
        nbIteration++
        let {reward, nextState, action} = this.playOneStep(EPSILON_PICK_ACTION_FULL_GREEDY, currentState)
        currentState = nextState
      }
      this.totalRewardBenchmark += this.environnement.snake.length
    }
    this.totalRewardBenchmark = this.totalRewardBenchmark / NB_GAME_BENCHMARK // computing average snake length
  }

  train = () => {
    for (let i = 0; i < EPOCH; i++) {
      this.nbEpoch++
      if (this.nbEpoch % 1000 === 0) {
        // console.log('Epoch : ', this.nbEpoch)
        // console.log('nbUpdatesQTable : ', this.nbUpdatesQTable)
        this.benchmarkAgent()
        console.log('Value benchmark : ', this.totalRewardBenchmark)
      }
      this.environnement.reset()
      let currentState = this.environnement.getState()

      while (!this.environnement.checkGameOver()) {
        this.nbUpdatesQTable++
        let epsilon = 0.01
        let {reward, nextState, action} = this.playOneStep(epsilon, currentState)
        let nextAction = this.pickActionEpsilonGreedy(EPSILON_PICK_ACTION_FULL_GREEDY, nextState)
        this.QTable[currentState][action] = this.QTable[currentState][action] + LEARNING_RATE * (reward + GAMMA * this.QTable[nextState][nextAction] - this.QTable[currentState][action])
        currentState = nextState
      }
    }
  }
}
