
export default class Drawer {

	constructor(container) {
		this.container	= container
		this.canvas 		= document.createElement('canvas')
		this.context 		= this.canvas.getContext("2d")
		this.canvasData = this.context.getImageData(0, 0, this.canvas.width, this.canvas.height)
		this.mouse 			= {}
		this.paths			= []
		this.color 			= {r: 0, g: 0, b: 0, a: 255}
		this.stroke 		= 1
		
		this.handleMouseMove()
		this.handleMouseDown()
		this.handleMouseUp()
		this.handleMouseLeave()
		
		this.buildStrokeSelector()
		
		this.render()
	}
	
	
	//methods
	
	draw() {
		this.paths.forEach((pathInfo, i) => {
			this.context.beginPath()
			this.context.moveTo(pathInfo.path[0].x, pathInfo.path[0].y)
			this.context.lineWidth = pathInfo.width
			pathInfo.path.forEach((pixel, i) => {
				this.context.lineTo(pixel.x, pixel.y)
			})
		})
		this.context.stroke()
	}
	
	pixelsAreEqual(pixelA, pixelB){
		return pixelA.x == pixelB.x && pixelA.y == pixelB.y
	}
	
	buildStrokeSelector(){
		this.strokeSelector = document.createElement('INPUT')
		this.strokeSelector.setAttribute('type', 'range')
		this.strokeSelector.min 					= 1
		this.strokeSelector.max 					= 20
		this.strokeSelector.step 					= 1
		this.strokeSelector.defaultValue 	= 1
		
		this.strokeSelector.addEventListener('input', e => {
			this.stroke = e.target.value
			this.strokeValue.textContent = this.stroke
		})
	}
	
	//event handlers
	
	handleMouseMove(){
		this.canvas.addEventListener('mousemove', e => {
			this.mouse.x = e.offsetX
			this.mouse.y = e.offsetY
			
			if (this.mouse.isDown) {
				this.paths.slice(-1)[0].path.push({x:e.offsetX, y:e.offsetY})
				this.draw()
			}
		})
	}
	
	handleMouseDown(){
		this.canvas.addEventListener('mousedown', e => {
			this.mouse.isDown = true
			this.paths.push({
				width: this.stroke,
				path: []
			})
		})
	}
	
	handleMouseUp(){
		this.canvas.addEventListener('mouseup', e => {
			this.mouse.isDown = false
		})
	}
	
	handleMouseLeave(){
		this.canvas.addEventListener('mouseleave', e => {
			this.mouse.isDown = false
		})
	}

	render(){
		let canvasWrapper = document.createElement('div')
		canvasWrapper.setAttribute('id','canvas-wrapper')
		
		let strokeWrapper = document.createElement('div')
		strokeWrapper.setAttribute('id','stroke-wrapper')
		
		this.strokeValue = document.createElement('div')
		this.strokeValue.textContent = this.stroke
		this.strokeValue.setAttribute('id','stroke-width')
		
		
		strokeWrapper.appendChild(this.strokeSelector)
		strokeWrapper.appendChild(this.strokeValue)
		
		canvasWrapper.appendChild(this.canvas)
		canvasWrapper.appendChild(strokeWrapper)
		
		this.container.appendChild(canvasWrapper)
	}
}