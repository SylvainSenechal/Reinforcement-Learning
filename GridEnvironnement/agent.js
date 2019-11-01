import {ALL_ACTIONS, NB_ACTION, SIZE_GRID} from './grid.js'
import {DRAWING_OFFSET_X, DRAWING_OFFSET_Y, DRAWING_SIZE_CASE} from './grid.js'

const LEARNING_RATE = 0.01
const GAMMA = 0.95
const EPOCH = 100
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

  reconstructBestPath = () => {
    let targetReached = false
    let path = [[0, SIZE_GRID - 1]]
    let iteration = 0
    while (!targetReached && iteration < 50) { // While we are have not reached the target
      iteration++
      let currentCasePath = path[path.length - 1]
      let currentState = currentCasePath[0] + currentCasePath[1] * SIZE_GRID
      if (currentState <= 0 || currentState >= SIZE_GRID * SIZE_GRID) {
        continue
      }
      let bestAction = ALL_ACTIONS[this.argMax(this.QTable[currentState])]

      if (bestAction === 0) {
        path.push([currentCasePath[0] + 1, currentCasePath[1]])
      } else if (bestAction === 1) {
        path.push([currentCasePath[0], currentCasePath[1] - 1])
      } else if (bestAction === 2) {
        path.push([currentCasePath[0] - 1, currentCasePath[1]])
      } else if (bestAction === 3) {
        path.push([currentCasePath[0], currentCasePath[1] + 1])
      }

      if (path[path.length - 1][0] === SIZE_GRID - 1 && path[path.length - 1][1] === 0) {
        targetReached = true
      }
    }
    return path
  }

  drawBestPath = (ctx, canvas) => {

    ///////////////////////
    // Best Path drawing //
    ///////////////////////
    let bestPath = this.reconstructBestPath()
    console.log(bestPath)
    ctx.strokeStyle = "#ff00ff"
    ctx.beginPath()
    ctx.moveTo(
      DRAWING_OFFSET_X + DRAWING_SIZE_CASE / 2,
      DRAWING_OFFSET_Y - DRAWING_SIZE_CASE / 2 + SIZE_GRID * DRAWING_SIZE_CASE
    )
    for (let i = 0; i < bestPath.length; i++) {
      ctx.lineTo(
        bestPath[i][0] * DRAWING_SIZE_CASE + DRAWING_OFFSET_X + DRAWING_SIZE_CASE / 2,
        bestPath[i][1] * DRAWING_SIZE_CASE + DRAWING_OFFSET_Y + DRAWING_SIZE_CASE / 2
      )
    }
    ctx.stroke()
  }
}
