import {ALL_ACTIONS, NB_ACTION, SIGHT} from './snakeGame.js'
import {RIGHT, TOP, LEFT, BOTTOM} from './snakeGame.js'
import {OFFSET_X, OFFSET_Y, SIZE_CASE} from './snakeGame.js'

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
  // for (let i = 0; i < this.snake.length - 1; i++) {
  //   ctx.fillRect(OFFSET_X+this.snake[i][1]*SIZE_CASE, OFFSET_Y+this.snake[i][0]*SIZE_CASE, SIZE_CASE, SIZE_CASE)
  // }
  drawQTable = (ctx, canvas) => {
    let headX = this.environnement.snake[this.environnement.snake.length - 1][0]
    let headY = this.environnement.snake[this.environnement.snake.length - 1][1]
    ctx.fillStyle = 'rgba(125, 135, 150, 0.5)'
    let currentState = this.environnement.getState()
    let actions = this.QTable[currentState]
    if (this.environnement.direction === RIGHT) {
      for (let i = 1; i < SIGHT + 1; i++) {
        ctx.fillRect(OFFSET_X + (headY + i) * SIZE_CASE, OFFSET_Y + headX * SIZE_CASE, SIZE_CASE, SIZE_CASE) // front
        ctx.fillRect(OFFSET_X + headY * SIZE_CASE, OFFSET_Y + (headX - i) * SIZE_CASE, SIZE_CASE, SIZE_CASE) // left
        ctx.fillRect(OFFSET_X + headY * SIZE_CASE, OFFSET_Y + (headX + i) * SIZE_CASE, SIZE_CASE, SIZE_CASE) // right
        ctx.fillText(actions[0].toFixed(2), 5 + OFFSET_X + (headY + 1) * SIZE_CASE, 25 + OFFSET_Y + headX * SIZE_CASE) // front
        ctx.fillText(actions[1].toFixed(2), 5 + OFFSET_X + headY * SIZE_CASE, 25 + OFFSET_Y + (headX - 1) * SIZE_CASE) // left
        ctx.fillText(actions[2].toFixed(2), 5 + OFFSET_X + headY * SIZE_CASE, 25 + OFFSET_Y + (headX + 1) * SIZE_CASE) // right
      }
    } else if (this.environnement.direction === TOP) {
      for (let i = 1; i < SIGHT + 1; i++) {
        ctx.fillRect(OFFSET_X + headY * SIZE_CASE, OFFSET_Y + (headX - i) * SIZE_CASE, SIZE_CASE, SIZE_CASE)
        ctx.fillRect(OFFSET_X + (headY - i) * SIZE_CASE, OFFSET_Y + headX * SIZE_CASE, SIZE_CASE, SIZE_CASE)
        ctx.fillRect(OFFSET_X + (headY + i)* SIZE_CASE, OFFSET_Y + headX * SIZE_CASE, SIZE_CASE, SIZE_CASE)
        ctx.fillText(actions[0].toFixed(2), 5 + OFFSET_X + headY * SIZE_CASE, 25 + OFFSET_Y + (headX - 1) * SIZE_CASE) // front
        ctx.fillText(actions[1].toFixed(2), 5 + OFFSET_X + (headY - 1) * SIZE_CASE, 25 + OFFSET_Y + headX * SIZE_CASE) // left
        ctx.fillText(actions[2].toFixed(2), 5 + OFFSET_X + (headY + 1)* SIZE_CASE, 25 + OFFSET_Y + headX * SIZE_CASE) // right
      }
    } else if (this.environnement.direction === LEFT) {
      for (let i = 1; i < SIGHT + 1; i++) {
        ctx.fillRect(OFFSET_X + (headY - i) * SIZE_CASE, OFFSET_Y + headX * SIZE_CASE, SIZE_CASE, SIZE_CASE)
        ctx.fillRect(OFFSET_X + headY * SIZE_CASE, OFFSET_Y + (headX + i) * SIZE_CASE, SIZE_CASE, SIZE_CASE)
        ctx.fillRect(OFFSET_X + headY * SIZE_CASE, OFFSET_Y + (headX - i) * SIZE_CASE, SIZE_CASE, SIZE_CASE)
        ctx.fillText(actions[0].toFixed(2), 5 + OFFSET_X + (headY - 1) * SIZE_CASE, 25 + OFFSET_Y + headX * SIZE_CASE) // front
        ctx.fillText(actions[1].toFixed(2), 5 + OFFSET_X + headY * SIZE_CASE, 25 + OFFSET_Y + (headX + 1) * SIZE_CASE) // left
        ctx.fillText(actions[2].toFixed(2), 5 + OFFSET_X + headY * SIZE_CASE, 25 + OFFSET_Y + (headX - 1) * SIZE_CASE) // right
      }
    } else {  // bottom
      for (let i = 1; i < SIGHT + 1; i++) {
        ctx.fillRect(OFFSET_X + headY * SIZE_CASE, OFFSET_Y + (headX + i) * SIZE_CASE, SIZE_CASE, SIZE_CASE)
        ctx.fillRect(OFFSET_X + (headY + i) * SIZE_CASE, OFFSET_Y + headX * SIZE_CASE, SIZE_CASE, SIZE_CASE)
        ctx.fillRect(OFFSET_X + (headY - i)* SIZE_CASE, OFFSET_Y + headX * SIZE_CASE, SIZE_CASE, SIZE_CASE)
        ctx.fillText(actions[0].toFixed(2), 5 + OFFSET_X + headY * SIZE_CASE, 25 + OFFSET_Y + (headX + 1) * SIZE_CASE) // front
        ctx.fillText(actions[1].toFixed(2), 5 + OFFSET_X + (headY + 1) * SIZE_CASE, 25 + OFFSET_Y + headX * SIZE_CASE) // left
        ctx.fillText(actions[2].toFixed(2), 5 + OFFSET_X + (headY - 1) * SIZE_CASE, 25 + OFFSET_Y + headX * SIZE_CASE) // right
      }
    }
  }
}
