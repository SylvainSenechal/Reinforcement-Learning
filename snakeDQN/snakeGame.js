const SIZE = 8 // the size of the grid will be SIZE*SIZE

const SIZE_CASE = 40 // number of pixels per case (1 case => 40x40 pixels)
const OFFSET_X = 500 // pixels offset for drawing the whole scene in the middle of the page
const OFFSET_Y = 50

const REWARD_FOOD = 10 // eating something
const REWARD_LOST = -10 // losing the game
const REWARD_NOTHING = -0.2 // moving without eating or losing

export default class Snake {
  constructor() {
    this.createSnake()
    this.addFood()
    // this.gameOver = false // Game over, or on
    this.direction = 0 // 0=>right, 1=>top, 2=>left, 3=>bottom
    // this.newDirection = 0 // 0=> no change in direction, 1=>turning left, 2=>turning right
    this.tick = 0
  }

  reset = () => {
    this.createSnake()
    this.addFood()
    this.direction = 0
    console.log('reset')
  }

  createSnake = () => { // Snake created in the middle
    this.snake = [
      [Math.floor(SIZE/2), Math.floor(SIZE/2)],
      [Math.floor(SIZE/2), Math.floor(SIZE/2) + 1]
    ]
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
    if (action === 0) return // keep going straight
    if (action === 1) {
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
    } else if (action === 2) { // turning right from current direction
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

  step = action => {
    this.updateDirection(action)
    let lengthSnake = this.snake.length
    // Moving the head
    if (this.direction === 0) { // going right
      this.snake.push([this.snake[lengthSnake-1][0], this.snake[lengthSnake-1][1] + 1])
    } else if (this.direction === 1) { // going top
      this.snake.push([this.snake[lengthSnake-1][0] - 1, this.snake[lengthSnake-1][1]])
    } else if (this.direction === 2) { // going left
      this.snake.push([this.snake[lengthSnake-1][0], this.snake[lengthSnake-1][1] - 1])
    } else { // going down
      this.snake.push([this.snake[lengthSnake-1][0] + 1, this.snake[lengthSnake-1][1]])
    }

    //////////////////////////////
    // Checking if game is lost //
    //////////////////////////////
    let gameOver = false
    // if the head of the snake is outside the grid, game over
    if (this.snake[lengthSnake][0] >= SIZE || this.snake[lengthSnake][0] < 0 || this.snake[lengthSnake][1] >= SIZE || this.snake[lengthSnake][1] < 0) {
      gameOver = true
    }
    for (let i = 0; i < this.snake.length-1; i++) { // we are checking if the head is touching the body, -1 beacause last element is the head
      if (this.snake[lengthSnake][0] === this.snake[i][0] && this.snake[lengthSnake][1] === this.snake[i][1]) {
        gameOver = true
      }
    }

    if (gameOver) {
      return {reward: REWARD_LOST, gameOver}
    }


    // Check if we are eating the fruit
    let reward = REWARD_NOTHING
    if (this.snake[lengthSnake][1] === this.foodX && this.snake[lengthSnake][0] === this.foodY) {
      this.addFood()
      reward = REWARD_FOOD
    } else {
      this.snake.shift()
    }
    // if (this.snake[lengthSnake-1][1] === 1 && this.snake[lengthSnake-1][0] === 1) {
    //   reward = 10000
    // }

    let nextState = this.getState()
    return {nextState, reward, gameOver}
  }

  getState = () => {
    // return {
    //   "bodySnake": [...this.snake], // TODO: check slice
    //   "foodPos": [this.foodX, this.foodY]
    // }
    return {
      "bodySnake": [...this.snake],//.slice(), // TODO: check slice
      "foodPos": [this.foodX, this.foodY]
    }
  }

  getStateAsTensor = state => {
    // Creating a grid tensor of size [nbSamples, SIZE=width, SIZE=height, DEPTH=2]
    // Depth is 2 : the first for body parts, the second for food position
    if (!Array.isArray(state)) { // Dealing with the single state case
      state = [state]
    }
    let nbSamples = state.length // (ie : 1 example of id 0)
    let buffer = tf.buffer([nbSamples, SIZE, SIZE, 2]) // TODO: remove 1 optional ?

    for (let i = 0; i < nbSamples; i++) {
      if (state[i] == null) { // TODO: gerer state[n] == null ? voir pourquoi
        continue
      }
      state[i].bodySnake.forEach((bodyPart, index) => {
        buffer.set(index === 0 ? 2 : 1, i, bodyPart[0], bodyPart[1], 0)
      })
      state[i].foodPos.forEach((food, index) => {
        buffer.set(1, i, food[0], food[1], 1)
      })
    }

    // this.snake.forEach((bodyPart, index) => {
    //   // In the first depth : placing 2 if bodyPart is the head, 1 else,
    //   buffer.set(index === 0 ? 2 : 1, nbSamples, bodyPart[0], bodyPart[1], 0)
    // })
    // // In the second depth : placing 1 at the food position
    // buffer.set(1, nbSamples, this.foodX, this.foodY, 1)

    return buffer.toTensor()
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
