import {FlappyBird} from './flappyBird.js'
import Agent from './agent.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.canvas.width = window.innerWidth
ctx.canvas.height = window.innerHeight
// ctx.font = '15px serif'

const environnement = new FlappyBird(ctx, canvas)
const agentFlappyBird = new Agent(environnement)
window.agentFlappyBird = agentFlappyBird

let action = 0
document.onkeydown = key => {
  action = 1
}

document.onkeyup = key => {
  action = 0
}

const loop = () => {
  agentFlappyBird.environnement.drawEnvironnement() // Draw the game
	// agentFlappyBird.environnement.step(action)
  agentFlappyBird.train()
  requestAnimationFrame(loop)
}
loop()
