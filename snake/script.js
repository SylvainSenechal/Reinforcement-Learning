'use strict';
// NB : code is a little dirty because I used a 1D vector to represent my 2D game..

const SIZE_CASE = 40 // number of pixels per case
const OFFSET_X = 500
const OFFSET_Y = 50

const SIZE = 16 // IE : grid will be SIZE*SIZE case

let ctx, canvas
let width, height

let snake // A snake game instance
let AI

const init = () => {
  width = window.innerWidth
  height = window.innerHeight

  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  ctx.canvas.width = width
  ctx.canvas.height = height

  snake = new Snake()
  // AI = new Player('AI')
  // QLearning(ttt, player1, player2)
  loop()
}

document.onkeydown = key => snake.updateDirection(key.keyCode)

const loop = () => {
  snake.tick++
  draw(snake.snake) // Draw the game
  if (snake.tick % 10 === 0) { // TODO: game loop in class
    snake.move()
  }

  requestAnimationFrame(loop) // Repeat..
}

class Snake {
  constructor() {
    // this.grid = new Array(SIZE).fill().map(() => new Array(SIZE).fill(0))// new Int8Array(SIZE*SIZE) // 0=>empty, 1=>snake body, 2=>snake's head, 3=>apple
    this.createSnake()
    this.gameOver = false // Game over, or on
    this.direction = 0 // 0=>right, 1=>top, 2=>left, 3=>bottom
    this.newDirection = 0 // 0=> no change in direction, 1=>turning left, 2=>turning right
    this.tick = 0
    console.log(this)
  }

  createSnake = () => {
    this.snake = [
      [Math.floor(SIZE/2), Math.floor(SIZE/2)],
      [Math.floor(SIZE/2), Math.floor(SIZE/2) + 1]
    ]
  }

  updateDirection = keyCode => {
    if (keyCode === 38) return // 38 <=> keep going straight
    if (keyCode === 37) { // turn left
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
    } else if (keyCode === 39) {// turn right
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

  move = () => {
    let lengthSnake = this.snake.length
    // Moving the head
    if (this.direction === 0) {
      this.snake.push([this.snake[lengthSnake-1][0], this.snake[lengthSnake-1][1] + 1])
    } else if (this.direction === 1) {
      this.snake.push([this.snake[lengthSnake-1][0] - 1, this.snake[lengthSnake-1][1]])
    } else if (this.direction === 2) {
      this.snake.push([this.snake[lengthSnake-1][0], this.snake[lengthSnake-1][1] - 1])
    } else {
      this.snake.push([this.snake[lengthSnake-1][0] + 1, this.snake[lengthSnake-1][1]])
    }
    // Removing the tail
    this.snake.shift()
  }

  addFood = () => {
    let foodAdded = false
    do {
      let newFoodPosition = Math.floor(Math.random()*SIZE*SIZE)
      if (this.grid[newFoodPosition] === 0) { // if position is free we add food
        this.grid[newFoodPosition] = 2
        foodAdded = true
      }
    } while (foodAdded === false)
  }


  // reset = () => {
  //   this.grid = new Uint8Array(9)
  //   this.over = false
  // }


  randomPlay = grid => {
    let listePlayable = []

    for (let i = 0; i < 9; i++) {
      if (grid[i] === 0){ // case jouable
        listePlayable.push(i)
      }
    }
    let playedCase = Math.floor(Math.random() * listePlayable.length)
    return playedCase
  }
}


const draw = (snake) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Drawing body
  ctx.fillStyle = "#000000"
  for (let i = 0; i < snake.length - 1; i++) {
    ctx.fillRect(OFFSET_X+snake[i][1]*SIZE_CASE, OFFSET_Y+snake[i][0]*SIZE_CASE, SIZE_CASE, SIZE_CASE)
  }
  // Drawing head
  ctx.fillStyle = "#ff0000"
  ctx.fillRect(OFFSET_X+snake[snake.length-1][1]*SIZE_CASE, OFFSET_Y+snake[snake.length-1][0]*SIZE_CASE, SIZE_CASE, SIZE_CASE)


  // Draw head
  // for (let i = 0; i < SIZE; i++) {
  //   for (let j  = 0; j < SIZE; j++) {
  //     if (grid[i][j] === 1) {
  //       ctx.fillStyle = "#000000"
  //       ctx.fillRect(OFFSET_X+j*SIZE_CASE, OFFSET_Y+i*SIZE_CASE, SIZE_CASE, SIZE_CASE)
  //     } else if (grid[i][j] === 2) {
  //       ctx.fillStyle = "#ff0000"
  //       ctx.fillRect(OFFSET_X+j*SIZE_CASE, OFFSET_Y+i*SIZE_CASE, SIZE_CASE, SIZE_CASE)
  //     } else if (grid[i][j] === 3){
  //       ctx.fillStyle = "#00ff00"
  //       ctx.fillRect(OFFSET_X+j*SIZE_CASE, OFFSET_Y+i*SIZE_CASE, SIZE_CASE, SIZE_CASE)
  //     }
  //   }
  // }

  // Draw the background grid skeleton
  ctx.strokeStyle = "#aaaaaa"
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      ctx.strokeRect(OFFSET_X+i*SIZE_CASE, OFFSET_Y+j*SIZE_CASE, SIZE_CASE, SIZE_CASE)
    }
  }

}



window.addEventListener('load', init)
// window.addEventListener('resize', resize)
