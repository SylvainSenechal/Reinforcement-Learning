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
const agentSnake = new agent(environnement, brain)

console.log(environnement)
console.log(brain)
console.log(agentSnake)

console.log(agentSnake.brain.getWeights()[10].dataSync())
agentSnake.trainMyBrain()
console.log(agentSnake.brain.getWeights()[10].dataSync())

console.log('FIN')

document.onkeydown = key => environnement.updateDirectionKeyboard(key.keyCode)

const loop = () => {
  agentSnake.environnement.tick++
  agentSnake.environnement.drawEnvironnement(ctx, canvas) // Draw the game
  if (agentSnake.environnement.tick % 10 === 0) { // TODO: game loop in class
    // agentSnake.playOneStepDemo()
    agentSnake.playOneStep()
  }

  requestAnimationFrame(loop) // Repeat..
}

agentSnake.environnement.reset()
loop()
