const DRAWING_OFFSET_X = 50 // pixels offset for drawing the whole scene in the middle of the page
const DRAWING_OFFSET_Y = 150

const WIDTH_GAME = 600
const HEIGHT_GAME = 400

const PIPE_WIDTH = 60
const TICK_BETWEEN_NEW_PIPE = 100
const HOLE_PIPE_PERCENTAGE = 0.32
const SPEED_PIPES = 3

const ACTION_DONT_FLY = 0
const ACTION_FLY = 1
export const ALL_ACTIONS = [ACTION_DONT_FLY, ACTION_FLY]
export const NB_ACTION = ALL_ACTIONS.length

const REWARD_STILL_ALIVE = 1
const REWARD_DEATH = - 1

const SIZE_BIRD = 25
const GRAVITY_POWER = 0.5
const FLY_UP_VERTICAL_SPEED = 5
const BIRD_MAX_Y = HEIGHT_GAME + DRAWING_OFFSET_Y - SIZE_BIRD
const BIRD_MIN_Y = DRAWING_OFFSET_Y + SIZE_BIRD

export class FlappyBird {
	constructor(ctx, canvas) {
		this.ctx = ctx
		this.canvas = canvas

		this.birdX = DRAWING_OFFSET_X + 50
		this.birdY = DRAWING_OFFSET_Y + 300 // jeu.positionY + this.size + (jeu.height-this.size)*Math.random()
		this.birdVerticalSpeed = 0

		this.listPipes = []
		this.timeLastPipeCreated = - TICK_BETWEEN_NEW_PIPE
		this.tick = 0
	}

	createPipe = () => {
		if (this.timeLastPipeCreated + TICK_BETWEEN_NEW_PIPE < this.tick) {
			let h1Part = Math.random() * (1 - HOLE_PIPE_PERCENTAGE)
			let height1 = HEIGHT_GAME * h1Part
			let height2 = HEIGHT_GAME - height1 - HOLE_PIPE_PERCENTAGE * HEIGHT_GAME
			this.listPipes.push({
				x: WIDTH_GAME + DRAWING_OFFSET_X,
				y1: DRAWING_OFFSET_Y,
				width: PIPE_WIDTH,
				height1: height1,
				height2: height2,
				y2: HEIGHT_GAME + DRAWING_OFFSET_Y - height2
			})

			this.timeLastPipeCreated = this.tick
		}
	}

	updatePipesPosition = () => {
		for (let i = 0; i < this.listPipes.length; i++) {
			this.listPipes[i].x -= SPEED_PIPES
		}
	}

	removePastPipes = () => {
		if ((this.birdX - this.listPipes[0].x) > (this.listPipes[0].width + SIZE_BIRD)){
			this.listPipes.shift()
		}
	}

	checkCollisionPipe = () => {
		var midPipe = this.listPipes[0].x + (this.listPipes[0].width / 2)
		var widthHalfPipe = midPipe - this.listPipes[0].x
		if (Math.abs(midPipe - this.birdX) < (SIZE_BIRD + widthHalfPipe)) { // Si on est au niveau du pipe
			if ((this.birdY - SIZE_BIRD) < (this.listPipes[0].height1 + this.listPipes[0].y1) // Si on est sur le haut
			|| ((this.birdY + SIZE_BIRD) > (this.listPipes[0].y2))) { // Ou le bas du pipe, collision
				return true
			}
		}
		return false
	}

	moveBird = action => {
		if (action === ACTION_FLY) {
			this.birdVerticalSpeed = - FLY_UP_VERTICAL_SPEED
		} else if (action === ACTION_DONT_FLY) {
			this.birdVerticalSpeed += GRAVITY_POWER
		}

		this.birdY += this.birdVerticalSpeed

		if (this.birdY > BIRD_MAX_Y ) {
			this.birdY = BIRD_MAX_Y
		} else if (this.birdY < BIRD_MIN_Y) {
			this.birdY = BIRD_MIN_Y
		}
	}

	step = action => {
		this.tick++
		this.createPipe()
		this.moveBird(action)
		this.checkCollisionPipe()
		this.updatePipesPosition()
		this.removePastPipes()
		// return {reward: reward, nextState: nextState}
	}

	getState = () => {
		// Getting the green value of a pixel
		let state1 = this.ctx.getImageData(this.birdX + 50, HEIGHT_GAME / 2, 1, 1).data[1] === 0 ? 0 : 1
		let state2 = this.ctx.getImageData(this.birdX + 50, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 40, 1, 1).data[1] === 0 ? 0 : 1
		let state3 = this.ctx.getImageData(this.birdX + 50, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 40, 1, 1).data[1] === 0 ? 0 : 1
		let state4 = this.ctx.getImageData(this.birdX + 50, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 80, 1, 1).data[1] === 0 ? 0 : 1
		let state5 = this.ctx.getImageData(this.birdX + 50, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 80, 1, 1).data[1] === 0 ? 0 : 1

		let state6 = this.ctx.getImageData(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y, 1, 1).data[1] === 0 ? 0 : 1
		let state7 = this.ctx.getImageData(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 40, 1, 1).data[1] === 0 ? 0 : 1
		let state8 = this.ctx.getImageData(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 40, 1, 1).data[1] === 0 ? 0 : 1
		let state9 = this.ctx.getImageData(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 80, 1, 1).data[1] === 0 ? 0 : 1
		let state10 = this.ctx.getImageData(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 80, 1, 1).data[1] === 0 ? 0 : 1
		let state11 = this.ctx.getImageData(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 120, 1, 1).data[1] === 0 ? 0 : 1
		let state12 = this.ctx.getImageData(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 120, 1, 1).data[1] === 0 ? 0 : 1

		let state13 = this.ctx.getImageData(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y, 1, 1).data[1] === 0 ? 0 : 1
		let state14 = this.ctx.getImageData(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 60, 1, 1).data[1] === 0 ? 0 : 1
		let state15 = this.ctx.getImageData(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 60, 1, 1).data[1] === 0 ? 0 : 1
		let state16 = this.ctx.getImageData(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 120, 1, 1).data[1] === 0 ? 0 : 1
		let state17 = this.ctx.getImageData(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 120, 1, 1).data[1] === 0 ? 0 : 1
		let state18 = this.ctx.getImageData(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 180, 1, 1).data[1] === 0 ? 0 : 1
		let state19 = this.ctx.getImageData(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 180, 1, 1).data[1] === 0 ? 0 : 1

		// TODO: inside draw
		this.ctx.strokeStyle = "#cc00cc"
		this.ctx.strokeRect(this.birdX + 50, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y, 1, 1)
		this.ctx.strokeRect(this.birdX + 50, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 40, 1, 1)
		this.ctx.strokeRect(this.birdX + 50, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 40, 1, 1)
		this.ctx.strokeRect(this.birdX + 50, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 80, 1, 1)
		this.ctx.strokeRect(this.birdX + 50, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 80, 1, 1)

		this.ctx.strokeRect(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y, 1, 1)
		this.ctx.strokeRect(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 40, 1, 1)
		this.ctx.strokeRect(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 40, 1, 1)
		this.ctx.strokeRect(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 80, 1, 1)
		this.ctx.strokeRect(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 80, 1, 1)
		this.ctx.strokeRect(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 120, 1, 1)
		this.ctx.strokeRect(this.birdX + 100, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 120, 1, 1)

		this.ctx.strokeRect(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y, 1, 1)
		this.ctx.strokeRect(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 60, 1, 1)
		this.ctx.strokeRect(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 60, 1, 1)
		this.ctx.strokeRect(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 120, 1, 1)
		this.ctx.strokeRect(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 120, 1, 1)
		this.ctx.strokeRect(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y + 180, 1, 1)
		this.ctx.strokeRect(this.birdX + 150, HEIGHT_GAME / 2 + DRAWING_OFFSET_Y - 180, 1, 1)

		let yMin = DRAWING_OFFSET_Y + SIZE_BIRD
		let y = this.birdY - yMin
		let position
		for (let i = 0; i < 16; i++) {
			if (y >= i * HEIGHT_GAME / 16 && y < (i + 1) * HEIGHT_GAME / 16) {
				position = i
				this.ctx.fillStyle = "#cc00cc"
				this.ctx.fillRect(this.birdX - 25, i * HEIGHT_GAME / 16 + DRAWING_OFFSET_Y, SIZE_BIRD*2, HEIGHT_GAME / 16)
			} else {
				this.ctx.strokeRect(this.birdX - 25, i * HEIGHT_GAME / 16 + DRAWING_OFFSET_Y, SIZE_BIRD*2, HEIGHT_GAME / 16)
			}
		}
		let state = "" + position.toString(2) + state1 + state2 + state3 + state4 + state5 + state6 + state7 + state8 + state9 + state10 + state11 + state12 + state13 + state14 + state15 + state16 + state17 + state18 + state19
		return parseInt(state, 2)
	}

	drawEnvironnement = () => {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
		// console.log(this.tick)
		// Drawing pipes
		this.ctx.fillStyle = "#83f442"
		for (let p of this.listPipes) {
			this.ctx.fillRect(p.x, p.y1, p.width, p.height1) // top pipe
			this.ctx.fillRect(p.x, p.y2, p.width, p.height2) // bottom pipe
		}

		// Drawing bird
		this.ctx.fillStyle = "#0000ff"
		this.ctx.beginPath()
		this.ctx.arc(this.birdX, this.birdY, SIZE_BIRD, 0, 2*Math.PI)
		this.ctx.fill()

		// Drawing game frame
		this.ctx.strokeStyle = "#000000"
		this.ctx.strokeRect(DRAWING_OFFSET_X, DRAWING_OFFSET_Y, WIDTH_GAME, HEIGHT_GAME)
	}
}
