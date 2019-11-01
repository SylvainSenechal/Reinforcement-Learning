// TODO: best path drawing
import {Grid} from './grid.js'
import Agent from './agent.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.canvas.width = window.innerWidth
ctx.canvas.height = window.innerHeight
ctx.font = '15px serif'

const environnement = new Grid()
const agentGrid = new Agent(environnement)
window.agentGrid = agentGrid

const loop = () => {
  agentGrid.environnement.drawEnvironnement(ctx, canvas, agentGrid.QTable) // Draw the game
  agentGrid.train()
  agentGrid.drawBestPath(ctx, canvas)
  requestAnimationFrame(loop)
}

loop()
