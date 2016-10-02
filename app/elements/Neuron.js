const ETA 	= 0.15 //  overall net learning rate [0...1]
const ALPHA = 0.5	 // momentum, multiplier of last deltaWeight[0..n]

export default class Neuron {
	
	constructor(numOutputs, indexOnLayer, prevLayer) {
		this.numOutputs = numOutputs
		this.prevLayer 	= prevLayer
		this.index 			= indexOnLayer
		
		this.buildConnections()
	}
	

	buildConnections() {
		this.connections = []
		
		//creates a connection for each neuron on next layer
		Array.from(Array(this.numOutputs), (_, i) => i).forEach(neuron => 
			this.connections.push({weight: Math.random()})
		)
	}
	
	feedForward() {
		let intensity = 0
		
		//Sum the previus layer's outputs
		//Include the bias node from the previus layer
		this.prevLayer.forEach(neuron => {
			intensity += neuron.outputVal * neuron.connections[this.index].weight
			// console.log(neuron.outputVal,neuron.connections[this.index].weight)
		})
		// console.log('setting output val from intensity: '+intensity)
		this.outputVal = this.transferFunction(intensity)
		// console.log('output set to: '+this.outputVal)
	}
	
	// tanh -output range [-1.0, 1.0]
	transferFunction(x) {
		return Math.tanh(x)
	}

	// tanh derivative
	transferFunctionDerivative(x) {
		return 1 - x * x
	}
	
	calcOutputGradients(targetVal) {
		let delta = targetVal - this.outputVal
		this.gradient = delta * this.transferFunctionDerivative(this.outputVal)
	}
	
	calcHiddenGradients(nextLayer) {
		let dow = this.sumDOW(nextLayer)
		this.gradient = dow * this.transferFunctionDerivative(this.outputVal)
	}
	
	sumDOW(nextLayer){
		let sum = 0
		// sum our contributions of the errors at the nodes we feed
		nextLayer.slice(0,nextLayer.length - 1).forEach((neuron, i) => {
			sum += this.connections[i].weight * neuron.gradient
		})
	}
	
	updateInputWeights(prevLayer) {
		// The weights to be updated are in the conections
		// in the neurons in the preceding layer
		
		prevLayer.forEach((neuron, i) => {
			let oldDeltaWeight = neuron.connections[this.index],
					newDeltaWeight =
						// Individual input, magnified by the gradient and train rate:
						ETA + neuron.outputVal + this.gradient
						// Also add momentum = a fraction of the previus delta weight
						ALPHA + oldDeltaWeight
		})
		
	}

}
