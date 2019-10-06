'use strict';

let genetic
let ctx, canvas
let width, height
let viewX = 0
let viewY = 0
let up, down, right, left




const init = () => {
  width = window.innerWidth
  height = window.innerHeight

  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')
  ctx.canvas.width = width
  ctx.canvas.height = height

  loop()
}

// Simulation loop
const loop = () => {

  requestAnimationFrame(loop) // Repeat..
}

class TicTacToe {
  constructor() {
    this.grid = new Int8Array(9);
    console.log(this.grid)
  }

  checkWon = () => {
    console.log('oui')
  }
}
let a = new TicTacToe()
console.log(a)
console.log(a.checkWon())




const draw = () => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)
  for(u=0; u<jeu.nbGamesXaxis; u++){
    for(v=0; v<jeu.nbGamesYaxis; v++){
      for(i=0; i<3; i++){
        for(j=0; j<3; j++){
          ctx.strokeRect(jeu.positionX+i*jeu.widthCase + u*jeu.widthCase*4, jeu.positionY+j*jeu.widthCase + v*jeu.widthCase*4, jeu.widthCase, jeu.widthCase);
        }
      }
    }
  }

  for(u=0; u<jeu.nbGamesXaxis; u++){
    for(v=0; v<jeu.nbGamesYaxis; v++){
      for(i=0; i<3; i++){
        for(j=0; j<3; j++){
          if(jeu.listGame[(u*10)+v].grid[j][i] == 1){
            ctx.strokeStyle = "#00ff00"
            ctx.beginPath()
            ctx.arc(jeu.positionX+i*jeu.widthCase + jeu.widthCase/2 + u*jeu.widthCase*4, jeu.positionY+j*jeu.widthCase + jeu.widthCase/2 + v*jeu.widthCase*4, jeu.widthCase/4, 0, 2*Math.PI)
          	ctx.stroke()
          }
          if(jeu.listGame[(u*10)+v].grid[j][i] == 2){
            ctx.strokeStyle = "#ff0000"
            ctx.strokeRect(jeu.positionX+i*jeu.widthCase + jeu.widthCase/4 + u*jeu.widthCase*4, jeu.positionY+j*jeu.widthCase + jeu.widthCase/4 + v*jeu.widthCase*4, jeu.widthCase/2, jeu.widthCase/2);
          }
        }
      }
    }
  }

  ctx.strokeStyle = "#000000"
  ctx.strokeText("J1Won : " + jeu.j1Won, 50, 40)
  ctx.strokeText("J2Won : " + jeu.j2Won, 350, 40)
  ctx.strokeText("Matchs null : " + jeu.noWin, 700, 40)
}



window.addEventListener('load', init)
// window.addEventListener('resize', resize)
