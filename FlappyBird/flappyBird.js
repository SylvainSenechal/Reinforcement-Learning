const DRAWING_OFFSET_X = 50 // pixels offset for drawing the whole scene in the middle of the page
const DRAWING_OFFSET_Y = 50

const WIDTH_GAME = 900
const HEIGHT_GAME = 900
const PIPE_WIDTH = WIDTH_GAME / 10
const TICK_BETWEEN_NEW_PIPE = 100
const HOLE_PIPE_PERCENTAGE = 0.10
const SPEED_PIPES = 3
const GRAVITY_POWER = 0.7
const ACTION_FLY = 1
const ACTION_DONT_FLY = 0
const REWARD_STILL_ALIVE = 1
const REWARD_DEATH = - 1
const SIZE_BIRD = 25

export class FlappyBird {
	constructor() {

		this.birdX = DRAWING_OFFSET_X + 50
		this.birdY = DRAWING_OFFSET_Y + 300 // jeu.positionY + this.size + (jeu.height-this.size)*Math.random()
		this.birdVerticalSpeed = 0

		this.listPipes = []
		this.timeLastPipeCreated = 0
		this.tick = 0
	}

	createPipe = () => {
		if (this.timeLastPipeCreated + TICK_BETWEEN_NEW_PIPE < this.tick) {
			let h1Part = Math.random() * (1 - HOLE_PIPE_PERCENTAGE)
			this.listPipes.push({
				x: WIDTH_GAME + DRAWING_OFFSET_X,
				y1: DRAWING_OFFSET_Y,
				width: PIPE_WIDTH,
				height1: HEIGHT_GAME * h1Part,
				height2: HEIGHT_GAME - this.height1 - HOLE_PIPE_PERCENTAGE * HEIGHT_GAME,
				y2: HEIGHT_GAME + DRAWING_OFFSET_Y - this.height2
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
		if (this.listPipes.length > 0) { // Car au tout debut y'a aucun pipes
			if ((this.birdX - this.listPipes[0].x) > (this.listPipes[0].width + SIZE_BIRD)){
				this.listPipes.splice(0,1) // TODO: voir autre operateur
			}
		}
	}

	checkCollisionPipe = () => {
		if (this.listPipes.length > 0) {
			var midPipe = this.listPipes[0].x + (this.listPipes[0].width / 2)
			var widthHalfPipe = midPipe - this.listPipes[0].x
			if (Math.abs(midPipe - this.birdX) < (SIZE_BIRD + widthHalfPipe)) { // Si on est au niveau du pipe
				if ((this.birdY - SIZE_BIRD) < (this.listPipes[0].height1 + jeu.listePipes[0].y1) // Si on est sur le haut
				|| ((this.birdY + SIZE_BIRD) > (this.listPipes[0].y2))) { // Ou le bas du pipe, collision
					return true
				}
			}
		}
		return false
	}

	moveBird = action => {
		this.birdVerticalSpeed += GRAVITY_POWER
		if (this.birdVerticalSpeed > 15) { // Max speed
			this.birdVerticalSpeed = 15
		}

		if (action === ACTION_FLY) {
			if (this.birdVerticalSpeed > 0) {
				this.birdVerticalSpeed = 0
			}
			this.birdVerticalSpeed -= 1
		} else if (action === ACTION_DONT_FLY) {

		}


		if (this.birdVerticalSpeed < - 15){
				this.birdVerticalSpeed = - 15
		}

		this.birdY += this.birdVerticalSpeed

		if (this.birdY > HEIGHT_GAME + DRAWING_OFFSET_Y - SIZE_BIRD ){
			this.birdY = HEIGHT_GAME + DRAWING_OFFSET_Y - SIZE_BIRD
		} else if (this.birdY < DRAWING_OFFSET_Y + SIZE_BIRD){
			this.birdY = DRAWING_OFFSET_Y + SIZE_BIRD
		}
	}

	step = action => {
		this.tick++
		this.moveBird(action)
		this.checkCollisionPipe()
		this.createPipe()
		this.updatePipesPosition()
		this.removePastPipes()
		// return {reward: reward, nextState: nextState}
	}

	drawEnvironnement = (ctx, canvas) => {
		ctx.clearRect(0, 0, canvas.width, canvas.height)
		console.log(this.listPipes)
		console.log(this.tick)
		// Drawing pipes
		ctx.fillStyle = "#83f442"
		for (let p of this.listPipes) {
			ctx.fillRect(p.x, p.y1, p.width, p.height1) // top pipe
			ctx.fillRect(p.x, p.y2, p.width, p.height2) // bottom pipe
		}

		// Drawing bird
		ctx.beginPath()
		ctx.arc(this.birdX, this.birdY, SIZE_BIRD, 0, 2*Math.PI)
		ctx.fill()

		// Drawing game frame
		ctx.strokeRect(DRAWING_OFFSET_X, DRAWING_OFFSET_Y, WIDTH_GAME, HEIGHT_GAME)
	}
}
