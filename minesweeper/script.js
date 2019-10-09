'use strict';
// NB : code is a little dirty because I used a 1D vector to represent my 2D game..

const SIZE_CASE = 40
const OFFSET_X = 500
const OFFSET_Y = 50

const NB_MINES = 12
const SIZE = 16

const EPSILON = 0.1
const LEARNING_RATE = 0.3
const GAMMA = 0.9

let ctx, canvas
let width, height

let minesweeper // A minesweeper game instance
let AI

const init = () => {
  width = window.innerWidth
  height = window.innerHeight

  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  ctx.canvas.width = width
  ctx.canvas.height = height

  minesweeper = new Minesweeper()
  // AI = new Player('AI')
  // QLearning(ttt, player1, player2)
  loop()
}

const loop = () => {
  draw(minesweeper.grid, minesweeper.neighborsMinesGrid, minesweeper.seenGrid) // Draw the game

  requestAnimationFrame(loop) // Repeat..
}

// class Player {
//   constructor(typeOfPlayer = "random") {
//     this.typeOfPlayer = typeOfPlayer
//     if (this.typeOfPlayer === "AI") this.initQTable()
//   }
//
//   initQTable = () => {
//     this.QTable = new Map()
//   }
//
//   choseAction = grid => { // Espilon greedy action picking :
//     if (Math.random() < EPSILON) {
//       let listePlayable = []
//       for (let i = 0; i < 9; i++) { // Selection all the action that are available
//         if (grid[i] === 0){ // === 0 <=> playable action
//           listePlayable.push(i)
//         }
//       }
//       return Math.floor(Math.random() * listePlayable.length) // Picking one action amongst those available
//     } else {
//       if (this.QTable.get(grid.join('')) === undefined) this.QTable.set(grid.join(''), new Array(9).fill(0)) // We are creating this line in the QTable if the state was never visited before
//       // We are gonna pick the best action, available
//
//       return this.QTable.get(grid.join('')).indexOf(Math.max(...this.QTable.get(grid.join('')))) // Best case considering the state we are in
//     }
//   }
//   choseBestAction = grid => {
//     if (this.QTable.get(grid.join('')) === undefined) this.QTable.set(grid.join(''), new Array(9).fill(0))
//     return this.QTable.get(grid.join('')).indexOf(Math.max(...this.QTable.get(grid.join('')))) // Best case considering the state we are in
//   }
// }

document.onclick = mouse => {
  let [x, y] = [mouse.clientX, mouse.clientY]
  let gridX = Math.floor((x-OFFSET_X) / SIZE_CASE)
  let gridY = Math.floor((y-OFFSET_Y) / SIZE_CASE)
  let indiceGridClicked = gridX + SIZE * gridY
  minesweeper.clicked(indiceGridClicked, "left")
}
document.oncontextmenu = mouse => {
    mouse.preventDefault();
    let [x, y] = [mouse.clientX, mouse.clientY]
    let gridX = Math.floor((x-OFFSET_X) / SIZE_CASE)
    let gridY = Math.floor((y-OFFSET_Y) / SIZE_CASE)
    let indiceGridClicked = gridX + SIZE * gridY
    minesweeper.clicked(indiceGridClicked, "right")
    return false
}


class Minesweeper {
  constructor() {
    this.grid = this.createGrid()
    this.neighborsMinesGrid = this.createNeighborsMinesGrid()
    this.seenGrid = new Int8Array(SIZE*SIZE) // 0 => unreavealed, -1 => flagged, -2 = empty, x > 0 nb surrounding mines
    this.over = false // Game over, or on
    console.log(this)
  }

  clicked = (indiceGridClicked, typedOfClick) => {
    if (this.seenGrid[indiceGridClicked] !== 0) return // Case is already revealed, no need to go further
    if (indiceGridClicked < 0 || indiceGridClicked > SIZE*SIZE-1) return // handle clicked outside of the game

    if (typedOfClick === "right") this.seenGrid[indiceGridClicked] = -1 // Flagging the grid
    else { // Revealing the grid
      if (this.grid[indiceGridClicked] === 0) {
        if (this.neighborsMinesGrid[indiceGridClicked] === 0) {
          this.seenGrid[indiceGridClicked] = -2
          // Recursivite sur les mines autours..
          if (! (indiceGridClicked % SIZE === 0)) this.clicked(indiceGridClicked - 1, "left")
          if (! ((indiceGridClicked+1) % SIZE === 0)) this.clicked(indiceGridClicked + 1, "left")
          if (! (indiceGridClicked < SIZE)) this.clicked(indiceGridClicked - SIZE, "left")
          if (! (indiceGridClicked > (SIZE*(SIZE-1)-1))) this.clicked(indiceGridClicked + SIZE, "left")

          if (! (indiceGridClicked % SIZE === 0 || indiceGridClicked < SIZE)) this.clicked(indiceGridClicked - SIZE - 1, "left")
          if (! ((indiceGridClicked+1) % SIZE === 0 || indiceGridClicked < SIZE)) this.clicked(indiceGridClicked - SIZE + 1, "left")
          if (! (indiceGridClicked % SIZE === 0 || indiceGridClicked > (SIZE*(SIZE-1)-1))) this.clicked(indiceGridClicked + SIZE - 1, "left")
          if (! ((indiceGridClicked+1) % SIZE === 0 || indiceGridClicked > (SIZE*(SIZE-1)-1))) this.clicked(indiceGridClicked + SIZE + 1, "left")
        } else {
          this.seenGrid[indiceGridClicked] = this.neighborsMinesGrid[indiceGridClicked]
        }
      }
      else if (this.grid[indiceGridClicked] === 1) {
        console.log('boom')
      }
    }
  }

  createGrid = () => {
    let grid = new Int8Array(SIZE*SIZE)
    for (let i = 0; i < NB_MINES; i++) {
      let availableCase = false
      do {
        let caseMine = Math.floor(Math.random() * SIZE*SIZE)
        if (grid[caseMine] === 0) {
          grid[caseMine] = 1
          availableCase = true
        }
      } while (availableCase === false)
    }
    return grid
  }

  createNeighborsMinesGrid = () => {
    let grid = new Int8Array(SIZE*SIZE)
    for (let i = 0; i < SIZE*SIZE; i++) { // For each case, we are going to count neighbors mines
      let cpt = 0;

      cpt += (i % SIZE === 0) ? 0 : this.grid[i - 1] // bordure gauche
      cpt += ((i+1) % SIZE === 0) ? 0 : this.grid[i + 1] // bordure droite
      cpt += (i < SIZE) ? 0 : this.grid[i - SIZE] // bordure haut
      cpt += (i > (SIZE*(SIZE-1)-1)) ? 0 : this.grid[i + SIZE] // bordure bas

      cpt += (i % SIZE === 0 || i < SIZE) ? 0 : this.grid[i - SIZE - 1] // haut gauche
      cpt += ((i+1) % SIZE === 0 || i < SIZE) ? 0 : this.grid[i - SIZE + 1] // haut droite
      cpt += (i % SIZE === 0 || i > (SIZE*(SIZE-1)-1)) ? 0 : this.grid[i + SIZE - 1] // bas gauche
      cpt += ((i+1) % SIZE === 0 || i > (SIZE*(SIZE-1)-1)) ? 0 : this.grid[i + SIZE + 1] // bas droite

      grid[i] = this.grid[i] === 1 ? 0 : cpt // neighbors counted only when not a mine itself
    }
    return grid
  }
  // reset = () => {
  //   this.grid = new Uint8Array(9)
  //   this.over = false
  // }
  step = (action) => { // nb : one action is actually one action from ai and the from the random player
    if (this.grid[action] !== 0) {
      this.over = true
      return -100
    }
    this.grid[action] = 1
    let valueWin = this.checkWon()
    if (valueWin === 1) {
      this.over = true
      return 1 // AI won
    }
    else if (valueWin === 2) {
      this.over = true
      return -1 // AI LOST
    }
    else if (valueWin === 0) {
      this.over = true
      return 0.5 // TIE
    } else { // Game continue and the random player is gonna play :
      let actionRandom = this.randomPlay(this.grid)
      this.grid[actionRandom] = 2
      valueWin = this.checkWon()
      if (valueWin === 0) {
        this.over = true
        return 0.5
      }
      else if (valueWin === 2) {
        this.over = true
        return -1
      } else return 0 // the game is still on
    }

  }

  checkWon = () => { // Evaluate the state of the game
    // AI wins :
    if (this.grid[0] === 1 && this.grid[4] === 1 && this.grid[8] === 1) { // Diago 1
      return 1
    }
    if (this.grid[2] === 1 && this.grid[4] === 1 && this.grid[6] === 1) { // Diago 2
      return 1
    }
    for (let i = 0; i < 3; i++) {
      if (this.grid[i*3] === 1 && this.grid[i*3 + 1] === 1 && this.grid[i*3 + 2] === 1) { // 3 lignes
        return 1
      }
      if (this.grid[i] === 1 && this.grid[i+3] === 1 && this.grid[i+6] === 1) { // 3 colonnes
        return 1
      }
    }
    // Random computer wins :
    if (this.grid[0] === 1 && this.grid[4] === 1 && this.grid[8] === 1) { // Diago 1
      return 2
    }
    if (this.grid[2] === 1 && this.grid[4] === 1 && this.grid[6] === 1) { // Diago 2
      return 2
    }
    for (let i = 0; i < 3; i++) {
      if (this.grid[i*3] === 1 && this.grid[i*3 + 1] === 1 && this.grid[i*3 + 2] === 1) { // 3 lignes
        return 2
      }
      if (this.grid[i] === 1 && this.grid[i+3] === 1 && this.grid[i+6] === 1) { // 3 colonnes
        return 2
      }
    }
    // Tie game
    if (!this.grid.includes(0)) return 0
    // Game on
    return -1
  }

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


const QLearning = (game, player1, player2, nbEpisodes = 1000000) => {
  // From Sutton & Barto page 131 http://incompleteideas.net/book/RLbook2018.pdf :
  for (let i = 0; i < nbEpisodes; i++) { // loop for each episodes
    // console.log('i : ', i)
    game.reset() // Initialize the environnement
    while (!game.over) { // While the environnement is not terminal
      let currentState = [...game.grid] // voir passer en string ?
      let action = player1.choseAction(currentState) // Pick an action from the environnement with Epsilon-greedy
      // game.step(player2.step())
      let reward = game.step(action) // Take the action chosen, get a reward and the new environnement (which is updated in : game.grid)
                                     // NB : next environnement is when we play the action, and then the other player too, so its actually 2 "step" for a 2 player game
      if (reward !== 0) { // if game is over :
        let currentQtable = player1.QTable.get(currentState.join(''))
        currentQtable[action] = reward //currentQtable[action] + LEARNING_RATE*(reward - currentQtable[action]) // Update our QTable
        player1.QTable.set(currentState.join(''), currentQtable)
      } else {
        let nextBestAction = player1.choseBestAction(game.grid) // Pick the next best action that we should take according to our Qtable
        if (player1.QTable.get(currentState.join('')) === undefined) player1.QTable.set(currentState.join(''), new Array(9).fill(0))
        let currentQtable = player1.QTable.get(currentState.join(''))
        // console.log(currentQtable)
        currentQtable[action] = currentQtable[action] + LEARNING_RATE*(reward + GAMMA*player1.QTable.get(game.grid.join(''))[nextBestAction] - currentQtable[action]) // Update our QTable
        player1.QTable.set(currentState.join(''), currentQtable)
      }
    }
  }
}


const draw = (grid, neighbors, currentInfos) => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

  // Draw the background grid skeleton
  ctx.fillStyle = "#222222"
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      ctx.fillRect(OFFSET_X+i*SIZE_CASE, OFFSET_Y+j*SIZE_CASE, SIZE_CASE, SIZE_CASE)
    }
  }

  // // Draw all mines
  // for (let i = 0; i < SIZE*SIZE; i++) {
  //   if (grid[i] === 1) {
  //     ctx.strokeStyle = "#ff0000"
  //     ctx.beginPath()
  //     ctx.arc(OFFSET_X+(i%SIZE)*SIZE_CASE + SIZE_CASE/2, OFFSET_Y+Math.floor(i/SIZE)*SIZE_CASE + SIZE_CASE/2, SIZE_CASE/4, 0, 2*Math.PI)
  //   	ctx.stroke()
  //   }
  // }

  // // Draw all informations
  // for (let i = 0; i < SIZE*SIZE; i++) {
  //   if (neighbors[i] !== 0) {
  //     ctx.strokeStyle = "#ff0000"
  //     ctx.beginPath()
  //     // ctx.arc(OFFSET_X+(i%SIZE)*SIZE_CASE + SIZE_CASE/2, OFFSET_Y+Math.floor(i/SIZE)*SIZE_CASE + SIZE_CASE/2, SIZE_CASE/4, 0, 2*Math.PI)
  //     ctx.strokeText(neighbors[i], OFFSET_X+(i%SIZE)*SIZE_CASE + SIZE_CASE/2, OFFSET_Y+Math.floor(i/SIZE)*SIZE_CASE + SIZE_CASE/2)
  //     ctx.stroke()
  //   }
  // }

  // Draw player's own current informations
  for (let i = 0; i < SIZE*SIZE; i++) {
    if (currentInfos[i] === 0) { // hidden grid case
    ctx.fillStyle = "#888888"
      ctx.fillRect(OFFSET_X+(i%SIZE)*SIZE_CASE, OFFSET_Y+Math.floor(i/SIZE)*SIZE_CASE, SIZE_CASE, SIZE_CASE)
    }
    if (currentInfos[i] > 0) { // opened grid case with 1 or mines neighboring mines
      ctx.strokeStyle = "#00ff00"
      ctx.beginPath()
      ctx.strokeText(currentInfos[i], OFFSET_X+(i%SIZE)*SIZE_CASE + SIZE_CASE/2, OFFSET_Y+Math.floor(i/SIZE)*SIZE_CASE + SIZE_CASE/2)
      ctx.stroke()
    }
    if (currentInfos[i] === -1) { // flagged grid case
      ctx.strokeStyle = "#ff0000"
      ctx.beginPath()
      ctx.strokeText("?", OFFSET_X+(i%SIZE)*SIZE_CASE + SIZE_CASE/2, OFFSET_Y+Math.floor(i/SIZE)*SIZE_CASE + SIZE_CASE/2)
      ctx.stroke()
    }
    if (currentInfos[i] === -2) { // open, empty, grid case
      ctx.fillStyle = "#eeeeee"
      ctx.beginPath()
      ctx.fillRect(OFFSET_X+(i%SIZE)*SIZE_CASE, OFFSET_Y+Math.floor(i/SIZE)*SIZE_CASE, SIZE_CASE, SIZE_CASE)
      // ctx.strokeText(currentInfos[i], OFFSET_X+(i%SIZE)*SIZE_CASE + SIZE_CASE/2, OFFSET_Y+Math.floor(i/SIZE)*SIZE_CASE + SIZE_CASE/2)
      ctx.stroke()
    }
  }

  // draw the lines of the grid
  ctx.strokeStyle = "#aaaaaa"
  for (let i = 0; i < SIZE; i++) {
    for (let j = 0; j < SIZE; j++) {
      ctx.strokeRect(OFFSET_X+i*SIZE_CASE, OFFSET_Y+j*SIZE_CASE, SIZE_CASE, SIZE_CASE)
    }
  }

}



window.addEventListener('load', init)
// window.addEventListener('resize', resize)
