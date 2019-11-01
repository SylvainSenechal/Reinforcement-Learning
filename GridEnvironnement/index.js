import {Grid} from './grid.js'
import Agent from './agent.js'


const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.canvas.width = window.innerWidth
ctx.canvas.height = window.innerHeight


const environnement = new Grid()
const agentGrid = new Agent(environnement)
window.agentGrid = agentGrid
const loop = () => {
  agentGrid.environnement.drawEnvironnement(ctx, canvas) // Draw the game

  requestAnimationFrame(loop)
}
agentGrid.train()
loop()
