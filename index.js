'use strict';

import environnement from './snakeGame.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let width = window.innerWidth
let height = window.innerHeight
ctx.canvas.width = width
ctx.canvas.height = height

const snake = new environnement()
console.log(snake)

document.onkeydown = key => snake.updateDirection(key.keyCode)

const loop = () => {
  snake.tick++
  snake.drawEnvironnement(ctx, canvas) // Draw the game
  if (snake.tick % 10 === 0) { // TODO: game loop in class
    snake.step()
  }

  requestAnimationFrame(loop) // Repeat..
}

loop()
