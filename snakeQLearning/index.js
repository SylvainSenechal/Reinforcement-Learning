import {Snake} from './snakeGame.js'
import Agent from './agent.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let width = window.innerWidth
let height = window.innerHeight
ctx.canvas.width = width
ctx.canvas.height = height

const environnement = new Snake()
const agentSnake = new Agent(environnement)
window.agentSnake = agentSnake
console.log(environnement)
console.log(agentSnake)

document.onkeydown = key => {
  environnement.updateDirectionKeyboard(key.keyCode)
  agentSnake.environnement.step(0)
}

const loop = () => {
  agentSnake.environnement.tick++
  agentSnake.environnement.drawEnvironnement(ctx, canvas) // Draw the game
  if (agentSnake.environnement.tick % 2 === 0) { // TODO: game loop in class
    agentSnake.playGreedy()
  }

  requestAnimationFrame(loop) // Repeat..
}
agentSnake.train()
agentSnake.environnement.reset()
loop()
