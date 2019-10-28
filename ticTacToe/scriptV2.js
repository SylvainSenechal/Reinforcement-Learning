'use strict';

const SIZE_CASE = 100
const OFFSET_X = 50
const OFFSET_Y = 50

const EPSILON = 0.1
const LEARNING_RATE = 0.1
const GAMMA = 0.9

let ctx, canvas
let width, height

let ttt // A tic tac toe game instance
let player1, player2

const init = () => {
  width = window.innerWidth
  height = window.innerHeight

  canvas = document.getElementById('canvas')
  ctx = canvas.getContext('2d')

  ctx.canvas.width = width
  ctx.canvas.height = height

  ttt = new TicTacToe()
  player1 = new Player('AI')
  player2 = new Player()
  QLearning(ttt, player1, player2)
  loop()
}

const loop = () => {
  draw(ttt.grid) // Draw the game

  requestAnimationFrame(loop) // Repeat..
}

class Player {
  constructor(typeOfPlayer = "random") {
    this.typeOfPlayer = typeOfPlayer
    if (this.typeOfPlayer === "AI") this.initQTable()
  }

  initQTable = () => {
    this.QTable = new Map()
  }

  choseAction = grid => { // Espilon greedy action picking :
    if (Math.random() < EPSILON) {
      let listePlayable = []
      for (let i = 0; i < 9; i++) { // Selection all the action that are available
        if (grid[i] === 0){ // === 0 <=> playable action
          listePlayable.push(i)
        }
      }
      return Math.floor(Math.random() * listePlayable.length) // Picking one action amongst those available
    } else {
      if (this.QTable.get(grid.join('')) === undefined) this.QTable.set(grid.join(''), new Array(9).fill(0)) // We are creating this line in the QTable if the state was never visited before
      // We are gonna pick the best action, available
  //     let availableAction = false
  //     let action
  //     do {
  //       action = this.QTable.get(grid.join('')).indexOf(Math.max(...this.QTable.get(grid.join('')))) // Best case considering the state we are in
  // availableAction = true
  //     } while (availableAction === false)


      let action
      // do {
        let valueActions = [...this.QTable.get(grid.join(''))]
        let available = new Array(9).fill().map((i, index) => {
          if (grid[i] === 0) return valueActions[i]
          else return -Infinity
        })
        action = available.indexOf(Math.max(...available))
      action = this.QTable.get(grid.join('')).indexOf(Math.max(...this.QTable.get(grid.join('')))) // Best case considering the state we are in
      return action
    }
  }
  choseBestAction = grid => {
    if (this.QTable.get(grid.join('')) === undefined) this.QTable.set(grid.join(''), new Array(9).fill(0))

    // let availableAction = false
    let action
    // do {
      let valueActions = [...this.QTable.get(grid.join(''))]
      let available = new Array(9).fill().map((i, index) => {
        if (grid[i] === 0) return valueActions[i]
        else return -Infinity
      })
      action = available.indexOf(Math.max(...available))


      // action = this.QTable.get(grid.join('')).indexOf(Math.max(...this.QTable.get(grid.join('')))) // Best case considering the state we are in
      // availableAction = true
    // if(grid[action] === 0 )
    // } while (availableAction === false)
    action = this.QTable.get(grid.join('')).indexOf(Math.max(...this.QTable.get(grid.join('')))) // Best case considering the state we are in

    return action
  }
}


class TicTacToe {
  constructor(player1, player2) {
    this.grid = new Uint8Array(9)
    this.over = false // Game over, or on
    console.log(this.grid)
  }

  reset = () => {
    this.grid = new Uint8Array(9)
    this.over = false
  }
  step = (action) => { // nb : one action is actually one action from ai and the from the random player
    if (this.grid[action] !== 0) {
      this.over = true
      return -100
    }
    this.grid[action] = 1
    let valueWin = this.checkWon()
    if (valueWin === 0 || valueWin === 1 || valueWin === 2) this.over = true
    if (valueWin === 1) return 1 // AI won
    else if (valueWin === 2) return -1 // AI LOST
    else if (valueWin === 0) return 0.5 // TIE
    else { // Game continue and the random player is gonna play :
      let actionRandom = this.randomPlay(this.grid)
      this.grid[actionRandom] = 2
      valueWin = this.checkWon()
      if (valueWin === 0 || valueWin === 1 || valueWin === 2) this.over = true
      if (valueWin === 0) return 0.5
      else if (valueWin === 2) return -1
      else return 0 // the game is still on
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


const QLearning = (game, player1, player2, nbEpisodes = 10000) => {
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


const draw = grid => {
	ctx.clearRect(0, 0, canvas.width, canvas.height)

  ctx.strokeStyle = "#000000"
  for (let i = 0; i < 3; i++) { // Draw the grid skeleton
    for (let j = 0; j < 3; j++) {
      ctx.strokeRect(OFFSET_X+i*SIZE_CASE, OFFSET_Y+j*SIZE_CASE, SIZE_CASE, SIZE_CASE)
    }
  }

  for (let i = 0; i < 9; i++) { // Draw the cases inside the grid for player 1 or 2
    if (grid[i] === 1) {
      ctx.strokeStyle = "#00ff00"
      ctx.beginPath()
      ctx.arc(OFFSET_X+(i%3)*SIZE_CASE + SIZE_CASE/2, OFFSET_Y+Math.floor(i/3)*SIZE_CASE + SIZE_CASE/2, SIZE_CASE/4, 0, 2*Math.PI)
    	ctx.stroke()
    }
    if (grid[i] === 2){
      ctx.strokeStyle = "#ff0000"
      ctx.beginPath()
      ctx.rect(OFFSET_X+(i%3)*SIZE_CASE + SIZE_CASE/4, OFFSET_Y+Math.floor(i/3)*SIZE_CASE + SIZE_CASE/4, SIZE_CASE/2, SIZE_CASE/2)
      ctx.stroke()
    }
  }
}



window.addEventListener('load', init)
// window.addEventListener('resize', resize)
