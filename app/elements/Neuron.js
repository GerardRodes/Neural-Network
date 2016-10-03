const ETA 	= 0.15 //  overall net learning rate [0...1]
const ALPHA = 0.5	 // momentum, multiplier of last deltaWeight[0..n]

export default class Neuron {
	
	constructor(prevLayer, nextLayer, layer, id) {
		this.myLayer 		= layer
		this.nextLayer 	= nextLayer || false
		this.prevLayer 	= prevLayer || false
		this.isBias			= false
		this.id 				= id
		
		console.log('created: '+this)
	}
	
	toString(){
		return this.isBias ? 'Neuron '+this.id+' (BIAS)' : 'Neuron '+this.id;
	}

	buildConnections() {
		this.connections = []
		//creates a connection for each neuron on next layer
		this.nextLayer
		.filter(neuron => !neuron.isBias)
		.forEach(neuron => {
			let weight = Math.random(),
					connection = {
						weight: 			weight,
						deltaWeight: 	0,
						toNeuron: 		neuron.id
					}
			
			this.connections.push(connection)
		})
	}
	
	getConnection(id){
		return this.connections.filter(conn => conn.toNeuron == id)[0]
	}
	
	feedForward() {
		let sum = 0
		
		//Sum the previus layer's outputs (which are our inputs)
		//Include the bias node from the previus layer
		this.prevLayer
		.forEach(neuron => {
			sum += neuron.outputVal * neuron.getConnection(this.id).weight
		})
		this.outputVal = this.transferFunction(sum)
	}
	
	calcOutputGradients(targetVal) {
		let delta = targetVal - this.outputVal
		this.gradient = delta * this.transferFunctionDerivative(this.outputVal)
	}
	
	calcHiddenGradients(nextLayer) {
		let dow = this.sumDOW(nextLayer)
		this.gradient = dow * this.transferFunctionDerivative(this.outputVal)
	}
	
	updateInputWeights() {
		// The weights to be updated are in the connections
		// in the neurons in the preceding layer
		this.prevLayer.forEach((neuron, i) => {
			let oldDeltaWeight = neuron.getConnection(this.id).deltaWeight,
					newDeltaWeight =
						// Individual input, magnified by the gradient and train rate:
						ETA * neuron.outputVal * this.gradient +
						// Also add momentum = a fraction of the previus delta weight
						ALPHA * oldDeltaWeight;
						
				neuron.getConnection(this.id).deltaWeight = newDeltaWeight
				neuron.getConnection(this.id).weight += newDeltaWeight
		})
	}
	
	// tanh -output range [-1.0, 1.0]
	transferFunction(x) {
		return Math.tanh(x)
	}

	// tanh derivative
	transferFunctionDerivative(x) {
		return 1 - x * x
	}
	
	sumDOW(nextLayer){
		let sum = 0
		// sum our contributions of the errors at the nodes we feed
		nextLayer.filter(neuron => !neuron.isBias)
						 .forEach((neuron, i) => {
								sum += this.connections[i].weight * neuron.gradient
							})
		
		return sum
	}

}
