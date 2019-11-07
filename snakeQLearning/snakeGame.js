const SIZE = 12 // the size of the grid will be SIZE*SIZE

const SIZE_CASE = 40 // number of pixels per case (1 case => 40x40 pixels)
const OFFSET_X = 500 // pixels offset for drawing the whole scene in the middle of the page
const OFFSET_Y = 50

const REWARD_FOOD = 10 // eating something
const REWARD_LOST = - 10 // losing the game
const REWARD_NOTHING = - 0.05 // moving without eating or losing

export const FORWARD = 0
export const TURN_LEFT = 1
export const TURN_RIGHT = 2
export const ALL_ACTIONS = [FORWARD, TURN_LEFT, TURN_RIGHT]
export const NB_ACTION = ALL_ACTIONS.length

export class Snake {
  constructor() {
    this.grid = this.createGrid()
    this.createSnake()
    this.addFood()
    this.direction = 0 // 0=>right, 1=>top, 2=>left, 3=>bottom
    this.tick = 0

  }

  reset = () => {
    this.grid = this.createGrid()
    this.createSnake()
    this.addFood()
    this.direction = 0
  }

  createGrid = () => new Array(SIZE).fill().map( () => new Uint8Array(SIZE)) //new Array(SIZE).fill().map( () => new Array(SIZE).fill(0))

  createSnake = () => { // Snake created in the middle
    this.snake = [
      [Math.floor(SIZE/2), Math.floor(SIZE/2)],
      [Math.floor(SIZE/2), Math.floor(SIZE/2) + 1]
    ]
    this.grid[Math.floor(SIZE/2)][Math.floor(SIZE/2)] = 1
    this.grid[Math.floor(SIZE/2)][Math.floor(SIZE/2) + 1] = 1
  }

  addFood = () => {
    let availablePlace = true
    let newFoodPositionX = 0
    let newFoodPositionY = 0
    do {
      availablePlace = true
      newFoodPositionX = Math.floor(Math.random()*SIZE)
      newFoodPositionY = Math.floor(Math.random()*SIZE)
      for (let i = 0; i < this.snake.length; i++) {
        if (newFoodPositionX === this.snake[i][1] && newFoodPositionY === this.snake[i][0]) {
          availablePlace = false // TODO: add break statement ?
        }
      }
    } while (availablePlace === false)
    this.foodX = newFoodPositionX
    this.foodY = newFoodPositionY
    this.grid[this.foodY][this.foodX] = 2
  }

  updateDirectionKeyboard = keyCode => {
    // Directions : 0 => right, 1 => top, 2 => left, 3 => bottom
    if (keyCode === 38) return // 38 <=> keep going straight
    if (keyCode === 37) { // turning left from current direction
      switch (this.direction) {
        case 0:
          this.direction = 1
          break
        case 1:
          this.direction = 2
          break
        case 2:
          this.direction = 3
          break
        case 3:
          this.direction = 0
          break
      }
    } else if (keyCode === 39) { // turning right from current direction
      switch (this.direction) {
        case 0:
          this.direction = 3
          break
        case 1:
          this.direction = 0
          break
        case 2:
          this.direction = 1
          break
        case 3:
          this.direction = 2
          break
      }
    }
  }

  updateDirection = action => {
    if (action === FORWARD) return // keep going straight
    if (action === TURN_LEFT) {
      switch (this.direction) { // turning left from current direction
        case 0:
          this.direction = 1
          break
        case 1:
          this.direction = 2
          break
        case 2:
          this.direction = 3
          break
        case 3:
          this.direction = 0
          break
      }
    } else if (action === TURN_RIGHT) { // turning right from current direction
      switch (this.direction) {
        case 0:
          this.direction = 3
          break
        case 1:
          this.direction = 0
          break
        case 2:
          this.direction = 1
          break
        case 3:
          this.direction = 2
          break
      }
    }
  }

  checkGameOver = () => {
    let lengthSnake = this.snake.length - 1
    // if the head of the snake is outside the grid, game over
    if (this.snake[lengthSnake][0] >= SIZE || this.snake[lengthSnake][0] < 0 || this.snake[lengthSnake][1] >= SIZE || this.snake[lengthSnake][1] < 0) {
      return true
    }
    for (let i = 0; i < this.snake.length-1; i++) { // we are checking if the head is touching the body, -1 beacause last element is the head
      if (this.snake[lengthSnake][0] === this.snake[i][0] && this.snake[lengthSnake][1] === this.snake[i][1]) {
        return true
      }
    }
  }

  step = action => {
    this.updateDirection(action)
    let lengthSnake = this.snake.length
    // Moving the head
    if (this.direction === 0) { // going right
      this.snake.push([this.snake[lengthSnake-1][0], this.snake[lengthSnake-1][1] + 1])
      this.grid[this.snake[lengthSnake-1][0]][this.snake[lengthSnake-1][1] + 1] = 1
    } else if (this.direction === 1) { // going top
      this.snake.push([this.snake[lengthSnake-1][0] - 1, this.snake[lengthSnake-1][1]])
      if (this.snake[lengthSnake-1][0] - 1 >= 0) {
        this.grid[this.snake[lengthSnake-1][0] - 1][this.snake[lengthSnake-1][1]] = 1
      }
    } else if (this.direction === 2) { // going left
      this.snake.push([this.snake[lengthSnake-1][0], this.snake[lengthSnake-1][1] - 1])
      this.grid[this.snake[lengthSnake-1][0]][this.snake[lengthSnake-1][1] - 1] = 1
    } else { // going down
      this.snake.push([this.snake[lengthSnake-1][0] + 1, this.snake[lengthSnake-1][1]])
      if (this.snake[lengthSnake-1][0] + 1 < SIZE) {
        this.grid[this.snake[lengthSnake-1][0] + 1][this.snake[lengthSnake-1][1]] = 1
      }
    }

    // Checking if game is lost
    let gameOver = this.checkGameOver()


    if (gameOver) {
      let nextState = Math.pow(3, 15)
      return {reward: REWARD_LOST, nextState: nextState}
    }


    // Check if we are eating the fruit
    let reward = REWARD_NOTHING
    if (this.snake[lengthSnake][1] === this.foodX && this.snake[lengthSnake][0] === this.foodY) {
      this.addFood()
      reward = REWARD_FOOD
    } else {
      this.grid[this.snake[0][0]][this.snake[0][1]] = 0
      this.snake.shift()
    }


    let nextState = this.getState()
    return {reward: reward, nextState: nextState}
  }

  getState = () => {
    let headX = this.snake[this.snake.length - 1][0]
    let headY = this.snake[this.snake.length - 1][1]
    let front1, front2, front3, front4, front5
    let left1, left2, left3, left4, left5
    let right1, right2, right3, right4, right5
    if (this.direction === 0) { // right
      front1 = headY + 1 >= SIZE ? 1 : this.grid[headX][headY + 1]
      front2 = headY + 2 >= SIZE ? 1 : this.grid[headX][headY + 2]
      front3 = headY + 3 >= SIZE ? 1 : this.grid[headX][headY + 3]
      front4 = headY + 4 >= SIZE ? 1 : this.grid[headX][headY + 4]
      front5 = headY + 5 >= SIZE ? 1 : this.grid[headX][headY + 5]
      left1 = headX - 1 < 0 ? 1 : this.grid[headX - 1][headY]
      left2 = headX - 2 < 0 ? 1 : this.grid[headX - 2][headY]
      left3 = headX - 3 < 0 ? 1 : this.grid[headX - 3][headY]
      left4 = headX - 4 < 0 ? 1 : this.grid[headX - 4][headY]
      left5 = headX - 5 < 0 ? 1 : this.grid[headX - 5][headY]
      right1 = headX + 1 >= SIZE ? 1 : this.grid[headX + 1][headY]
      right2 = headX + 2 >= SIZE ? 1 : this.grid[headX + 2][headY]
      right3 = headX + 3 >= SIZE ? 1 : this.grid[headX + 3][headY]
      right4 = headX + 4 >= SIZE ? 1 : this.grid[headX + 4][headY]
      right5 = headX + 5 >= SIZE ? 1 : this.grid[headX + 5][headY]
    } else if (this.direction === 1) { // top
      front1 = headX - 1 < 0 ? 1 : this.grid[headX - 1][headY]
      front2 = headX - 2 < 0 ? 1 : this.grid[headX - 2][headY]
      front3 = headX - 3 < 0 ? 1 : this.grid[headX - 3][headY]
      front4 = headX - 4 < 0 ? 1 : this.grid[headX - 4][headY]
      front5 = headX - 5 < 0 ? 1 : this.grid[headX - 5][headY]
      left1 = headY - 1 < 0 ? 1 : this.grid[headX][headY - 1]
      left2 = headY - 2 < 0 ? 1 : this.grid[headX][headY - 2]
      left3 = headY - 3 < 0 ? 1 : this.grid[headX][headY - 3]
      left4 = headY - 4 < 0 ? 1 : this.grid[headX][headY - 4]
      left5 = headY - 5 < 0 ? 1 : this.grid[headX][headY - 5]
      right1 = headY + 1 >= SIZE ? 1 : this.grid[headX][headY + 1]
      right2 = headY + 2 >= SIZE ? 1 : this.grid[headX][headY + 2]
      right3 = headY + 3 >= SIZE ? 1 : this.grid[headX][headY + 3]
      right4 = headY + 4 >= SIZE ? 1 : this.grid[headX][headY + 4]
      right5 = headY + 5 >= SIZE ? 1 : this.grid[headX][headY + 5]
    } else if (this.direction === 2) { // left
      front1 = headY - 1 < 0 ? 1 : this.grid[headX][headY - 1]
      front2 = headY - 2 < 0 ? 1 : this.grid[headX][headY - 2]
      front3 = headY - 3 < 0 ? 1 : this.grid[headX][headY - 3]
      front4 = headY - 4 < 0 ? 1 : this.grid[headX][headY - 4]
      front5 = headY - 5 < 0 ? 1 : this.grid[headX][headY - 5]
      left1 = headX + 1 >= SIZE ? 1 : this.grid[headX + 1][headY]
      left2 = headX + 2 >= SIZE ? 1 : this.grid[headX + 2][headY]
      left3 = headX + 3 >= SIZE ? 1 : this.grid[headX + 3][headY]
      left4 = headX + 4 >= SIZE ? 1 : this.grid[headX + 4][headY]
      left5 = headX + 5 >= SIZE ? 1 : this.grid[headX + 5][headY]
      right1 = headX - 1 < 0 ? 1 : this.grid[headX - 1][headY]
      right2 = headX - 2 < 0 ? 1 : this.grid[headX - 2][headY]
      right3 = headX - 3 < 0 ? 1 : this.grid[headX - 3][headY]
      right4 = headX - 4 < 0 ? 1 : this.grid[headX - 4][headY]
      right5 = headX - 5 < 0 ? 1 : this.grid[headX - 5][headY]
    } else {  // bottom
      front1 = headX + 1 >= SIZE ? 1 : this.grid[headX + 1][headY]
      front2 = headX + 2 >= SIZE ? 1 : this.grid[headX + 2][headY]
      front3 = headX + 3 >= SIZE ? 1 : this.grid[headX + 3][headY]
      front4 = headX + 4 >= SIZE ? 1 : this.grid[headX + 4][headY]
      front5 = headX + 5 >= SIZE ? 1 : this.grid[headX + 5][headY]
      left1 = headY + 1 >= SIZE ? 1 : this.grid[headX][headY + 1]
      left2 = headY + 2 >= SIZE ? 1 : this.grid[headX][headY + 2]
      left3 = headY + 3 >= SIZE ? 1 : this.grid[headX][headY + 3]
      left4 = headY + 4 >= SIZE ? 1 : this.grid[headX][headY + 4]
      left5 = headY + 5 >= SIZE ? 1 : this.grid[headX][headY + 5]
      right1 = headY - 1 < 0 ? 1 : this.grid[headX][headY - 1]
      right2 = headY - 2 < 0 ? 1 : this.grid[headX][headY - 2]
      right3 = headY - 3 < 0 ? 1 : this.grid[headX][headY - 3]
      right4 = headY - 4 < 0 ? 1 : this.grid[headX][headY - 4]
      right5 = headY - 5 < 0 ? 1 : this.grid[headX][headY - 5]
    }

    let state = "" + front1 + front2 + front3 + front4 + front5 + left1 + left2 + left3 + left4 + left5 + right1 + right2 + right3 + right4 + right5
    return parseInt(state, 3)
  }


  drawEnvironnement = (ctx, canvas) => {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    // Drawing body
    ctx.fillStyle = "#000000"
    for (let i = 0; i < this.snake.length - 1; i++) {
      ctx.fillRect(OFFSET_X+this.snake[i][1]*SIZE_CASE, OFFSET_Y+this.snake[i][0]*SIZE_CASE, SIZE_CASE, SIZE_CASE)
    }
    // Drawing head
    ctx.fillStyle = "#ff0000"
    ctx.fillRect(OFFSET_X+this.snake[this.snake.length-1][1]*SIZE_CASE, OFFSET_Y+this.snake[this.snake.length-1][0]*SIZE_CASE, SIZE_CASE, SIZE_CASE)
    // Drawing food
    ctx.fillStyle = "#00ff00"
    ctx.fillRect(OFFSET_X+this.foodX*SIZE_CASE, OFFSET_Y+this.foodY*SIZE_CASE, SIZE_CASE, SIZE_CASE)

    // Draw the background grid skeleton
    ctx.strokeStyle = "#aaaaaa"
    for (let i = 0; i < SIZE; i++) {
      for (let j = 0; j < SIZE; j++) {
        ctx.strokeRect(OFFSET_X+i*SIZE_CASE, OFFSET_Y+j*SIZE_CASE, SIZE_CASE, SIZE_CASE)
      }
    }
  }
}
