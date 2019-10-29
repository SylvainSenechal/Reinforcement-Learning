import snake from './snakeGame.js'
import neuralNetwork from './neuralNetwork.js'
import agent from './agent.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
let width = window.innerWidth
let height = window.innerHeight
ctx.canvas.width = width
ctx.canvas.height = height

const environnement = new snake()
const brain = neuralNetwork()
const agentSnake = new agent(snake, brain)

console.log(snake)

document.onkeydown = key => environnement.updateDirectionKeyboard(key.keyCode)

const loop = () => {
  environnement.tick++
  environnement.drawEnvironnement(ctx, canvas) // Draw the game
  if (environnement.tick % 10 === 0) { // TODO: game loop in class
    environnement.step()
  }

  requestAnimationFrame(loop) // Repeat..
}

loop()
