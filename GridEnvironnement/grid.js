export const ACTION_RIGHT = 0
export const ACTION_TOP = 1
export const ACTION_LEFT = 2
export const ACTION_BOTTOM = 3
export const ALL_ACTIONS = [ACTION_RIGHT, ACTION_TOP, ACTION_LEFT, ACTION_BOTTOM]
export const NB_ACTION = ALL_ACTIONS.length
export const SIZE_GRID = 10

const REWARD_WIN = 1
const REWARD_BAD_SPOT = - 1
const NB_BAD_SPOT_REWARD = 18

const DRAWING_OFFSET_X = 50 // pixels offset for drawing the whole scene in the middle of the page
const DRAWING_OFFSET_Y = 50
const DRAWING_SIZE_CASE = 80 // number of pixels per case (1 case => 40x40 pixels)

export class Grid {
  constructor() {
    this.world = this.createWorld()
  }

  createWorld = () => {
    let map = new Array(SIZE_GRID).fill().map( () => new Array(SIZE_GRID).fill(0))
    map[0][SIZE_GRID - 1] = REWARD_WIN // TOP RIGHT reward
    this.agentX = 0
    this.agentY = SIZE_GRID - 1 // Agent Starting LEFT BOTTOM
    // Adding some bad reward spots :
    let spotAdded = 0
    while (spotAdded < NB_BAD_SPOT_REWARD) {
      let x = Math.floor(Math.random() * SIZE_GRID)
      let y = Math.floor(Math.random() * SIZE_GRID)
      if (map[x][y] === 0 && !(x === SIZE_GRID - 1 && y === 0)) { // Adding spot only where place is available
        map[x][y] = REWARD_BAD_SPOT
        spotAdded += 1
      }
    }
    return map
  }

  reset = () => {
    this.agentX = 0
    this.agentY = SIZE_GRID - 1// Agent Starting LEFT BOTTOM
  }

  getState = () => this.agentX + this.agentY * SIZE_GRID

  step = action => {
    // 0 => right, 1 => top, 2 => left, 3 bottom
    let reward = 0
    let nextState

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
      if (this.world[this.agentY][this.agentX] === REWARD_WIN) {
        reward = REWARD_WIN
      } else if (this.world[this.agentY][this.agentX] === REWARD_BAD_SPOT) {
        reward = REWARD_BAD_SPOT
      }
    }


    nextState = this.agentX + this.agentY * SIZE_GRID
    return {reward: reward, nextState: nextState}
  }

  checkGameOver = () => this.world[this.agentY][this.agentX] === 1 || this.world[this.agentY][this.agentX] === - 1
  // TODO: colorer rouge vert bonus malus
  // TODO: GRID CSS
  drawEnvironnement = (ctx, canvas, QTable) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // // Drawing Agent position
    // ctx.fillStyle = "#000000"
    // ctx.fillRect(
    //   DRAWING_OFFSET_X + this.agentX * DRAWING_SIZE_CASE,
    //   DRAWING_OFFSET_Y + this.agentY * DRAWING_SIZE_CASE,
    //   DRAWING_SIZE_CASE,
    //   DRAWING_SIZE_CASE
    // )

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

    ctx.strokeStyle = "#aaaaaa"
    for (let i = 0; i < SIZE_GRID; i++) {
      for (let j = 0; j < SIZE_GRID; j++) {
        if (this.world[j][i] === 1) {
          ctx.fillStyle = "#00ff00"
          ctx.beginPath()
          ctx.arc(DRAWING_OFFSET_X + i * DRAWING_SIZE_CASE + DRAWING_SIZE_CASE / 2, DRAWING_OFFSET_Y + j * DRAWING_SIZE_CASE + DRAWING_SIZE_CASE / 2, 10, 0, Math.PI*2);
          ctx.fill()
        }
        if (this.world[j][i] === - 1) {
          ctx.fillStyle = "#ff0000"
          ctx.beginPath()
          ctx.arc(DRAWING_OFFSET_X + i * DRAWING_SIZE_CASE + DRAWING_SIZE_CASE / 2, DRAWING_OFFSET_Y + j * DRAWING_SIZE_CASE + DRAWING_SIZE_CASE / 2, 10, 0, Math.PI*2);
          ctx.fill()
        }
      }
    }

    ////////////////////
    // QTable drawing //
    ////////////////////
    for (let i = 0; i < SIZE_GRID; i++) {
      for (let j = 0; j < SIZE_GRID; j++) {
        let state = i + j * SIZE_GRID
        let a = 0
        ctx.fillStyle = QTable[state][ACTION_RIGHT] >= 0 ? `rgba(0, 255, 0, ${QTable[state][ACTION_RIGHT]})` : `rgba(255, 0, 0, ${Math.abs(QTable[state][ACTION_RIGHT])})`
        ctx.fillText(QTable[state][ACTION_RIGHT].toFixed(2), DRAWING_OFFSET_X + i * DRAWING_SIZE_CASE + 45, DRAWING_OFFSET_Y + j * DRAWING_SIZE_CASE + 45)

        ctx.fillStyle = QTable[state][ACTION_TOP] >= 0 ? `rgba(0, 255, 0, ${QTable[state][ACTION_TOP]})` : `rgba(255, 0, 0, ${Math.abs(QTable[state][ACTION_TOP])})`
        ctx.fillText(QTable[state][ACTION_TOP].toFixed(2), DRAWING_OFFSET_X + i * DRAWING_SIZE_CASE + 25, DRAWING_OFFSET_Y + j * DRAWING_SIZE_CASE + 15)

        ctx.fillStyle = QTable[state][ACTION_LEFT] >= 0 ? `rgba(0, 255, 0, ${QTable[state][ACTION_LEFT]})` : `rgba(255, 0, 0, ${Math.abs(QTable[state][ACTION_LEFT])})`
        ctx.fillText(QTable[state][ACTION_LEFT].toFixed(2), DRAWING_OFFSET_X + i * DRAWING_SIZE_CASE + 3, DRAWING_OFFSET_Y + j * DRAWING_SIZE_CASE + 45)

        ctx.fillStyle = QTable[state][ACTION_BOTTOM] >= 0 ? `rgba(0, 255, 0, ${QTable[state][ACTION_BOTTOM]})` : `rgba(255, 0, 0, ${Math.abs(QTable[state][ACTION_BOTTOM])})`
        ctx.fillText(QTable[state][ACTION_BOTTOM].toFixed(2), DRAWING_OFFSET_X + i * DRAWING_SIZE_CASE + 25, DRAWING_OFFSET_Y + j * DRAWING_SIZE_CASE + 70)
      }
    }
  }
}
