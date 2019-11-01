export const ACTION_RIGHT = 0
export const ACTION_TOP = 1
export const ACTION_LEFT = 2
export const ACTION_BOTTOM = 3
export const ALL_ACTIONS = [ACTION_RIGHT, ACTION_TOP, ACTION_LEFT, ACTION_BOTTOM]
export const NB_ACTION = ALL_ACTIONS.length
export const SIZE_GRID = 3

const REWARD_WIN = 1
const REWARD_WALL = - 1

const DRAWING_OFFSET_X = 500 // pixels offset for drawing the whole scene in the middle of the page
const DRAWING_OFFSET_Y = 50
const DRAWING_SIZE_CASE = 40 // number of pixels per case (1 case => 40x40 pixels)

export class Grid {
  constructor() {
    this.world = [
      [0, 0, 1],
      [0, -1, 0],
      [0, 0, 0]
    ]
    this.agentX = 1
    this.agentY = 1

  }

  reset = () => {
    this.agentX = 1
    this.agentY = 1
  }

  getState = () => this.agentX + this.agentY * SIZE_GRID

  step = action => {
    // 0 => right, 1 => top, 2 => left, 3 bottom
    let reward = 0
    let nextState
    let gameOver = false

    if (action === ACTION_RIGHT) {
      this.agentX = this.agentX === SIZE_GRID - 1 ? SIZE_GRID - 1 : this.agentX + 1
    } else if (action === ACTION_TOP) {
      this.agentY = this.agentY === 0 ? 0 : this.agentY - 1
    } else if (action === ACTION_LEFT) {
      this.agentX = this.agentX === 0 ? 0 : this.agentX - 1
    } else if (action === ACTION_BOTTOM){
      this.agentY = this.agentY === SIZE_GRID - 1 ? SIZE_GRID - 1 : this.agentY + 1
    } else {
      console.error(`Action : ${action} is not a correct action`)
    }

    if (this.checkGameOver()) {
      console.log('fin')
      gameOver = true
      reward = REWARD_WIN
    } else if (this.world[this.agentY][this.agentX] === 1) {
      reward = REWARD_WALL
    }

    nextState = this.agentX + this.agentY * SIZE_GRID
    return {reward: reward, nextState: nextState, gameOver: gameOver}
  }

  checkGameOver = () => this.world[this.agentY][this.agentX] === 1
  // TODO: colorer rouge vert bonus malus
  drawEnvironnement = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // Drawing Agent position
    ctx.fillStyle = "#000000"
    ctx.fillRect(
      DRAWING_OFFSET_X + this.agentX * DRAWING_SIZE_CASE,
      DRAWING_OFFSET_Y + this.agentY * DRAWING_SIZE_CASE,
      DRAWING_SIZE_CASE,
      DRAWING_SIZE_CASE
    )

    // Draw the background grid skeleton
    ctx.strokeStyle = "#aaaaaa"
    for (let i = 0; i < SIZE_GRID; i++) {
      for (let j = 0; j < SIZE_GRID; j++) {
        ctx.strokeRect(
          DRAWING_OFFSET_X + i * DRAWING_SIZE_CASE,
          DRAWING_OFFSET_Y + j * DRAWING_SIZE_CASE,
          DRAWING_SIZE_CASE,
          DRAWING_SIZE_CASE
        )
      }
    }
  }
}
