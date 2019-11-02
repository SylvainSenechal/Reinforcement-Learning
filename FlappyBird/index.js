import {FlappyBird} from './flappyBird.js'
import Agent from './agent.js'

const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')
ctx.canvas.width = window.innerWidth
ctx.canvas.height = window.innerHeight
// ctx.font = '15px serif'

const environnement = new FlappyBird()
const agentFlappyBird = new Agent(environnement)
window.agentFlappyBird = agentFlappyBird

const loop = () => {
  agentFlappyBird.environnement.drawEnvironnement(ctx, canvas) // Draw the game
	agentFlappyBird.environnement.step(0)
  requestAnimationFrame(loop)
}

loop()


// function loop(){ // Voir l'ordre des fonctions
// 	createPipes()
//
// 	gravity()
//   updatePipesPosition()
//   removePastPipes() // attention a l'ordre collision et remove pipes
//   collisions()
//   updateScore()
//
//   restoreGame()
//   dessin();
//
//   requestAnimationFrame(loop);
// }
