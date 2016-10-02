import Neuron from './Neuron'

export default class Brain {
	
	constructor(topology) {
		this.topology = topology
		this.buildLayers()
	}

	//Builds the layers with the neurons following the topology
	//adds 1 extra neuron on every layer which is the BIAS neuron
	buildLayers(){
		this.layers = []
		
		this.topology.forEach((layerSize, iLayer) => {
			let layer = [],
					numNeuronsNextLayer = iLayer == this.topology.length - 1 ? 0 : this.topology[iLayer + 1]
			
			console.log('creating layer '+iLayer+' with a size of '+layerSize+' and '+numNeuronsNextLayer+' connections on every neuron')
			for(let i = 0; i <= layerSize; i++){
				var neuron = new Neuron(numNeuronsNextLayer, i, this.layers[iLayer - 1])
				neuron.isBias = false
				layer.push(neuron)
				// console.log('neuron created on layer '+iLayer)
			}
			
			// setting the BIAS neuron outputVal to 1
			layer.slice(-1)[0].outputVal = 1
			layer.slice(-1)[0].isBias = true
			this.layers.push(layer)
		})
	}
	
	feedForward(inputVals){
		if (inputVals.length != this.layers[0].length - 1){
			console.warn('Number of inputs different than neurons on first layer')
		}
		
		let inputLayer = this.layers[0]
		
		//Assign the input values into the input neurons
		inputLayer.filter(neuron => !neuron.isBias)
							.forEach((neuron, i) => {
								neuron.outputVal = inputVals[i]
							})
		//Forward propagate
		this.layers.forEach((layer, iLayer) => {
			//we don't want the input layer
			if (iLayer != 0) {
				layer.forEach((neuron, iNeuron) => {
					// we don't want the BIAS
					if (!neuron.isBias){
						neuron.feedForward()	
					}
				})
			}
		})
	}
	
	backProp(targetVals){
		// ***Calculate overall net error***
		let outputLayer 	= this.layers.slice(-1)[0],
				hiddenLayers	= this.layers.slice(1, this.layers.length),
				error = 0
				
		// excluding BIAS neuron from output layer
		outputLayer = outputLayer.filter(neuron => !neuron.isBias)
		outputLayer.forEach((neuron, i) => {
			let delta = targetVals[i] - neuron.outputVal
			console.log('delta: '+delta)
			error += delta * delta
			console.log('error: '+error)
		})
		// average error
		error = error / outputLayer.length
		error = Math.sqrt(error)
		console.log('average error: '+error)
		
		// ***Calculate output layer gradients***
		outputLayer.forEach((neuron, i) => {
			neuron.calcOutputGradients(targetVals[i])
		})
		
		
		// ***Calculate gradients on hidden layers***
		hiddenLayers.slice().reverse().forEach((layer, i) => {
			// we don't want the output layer
			if (i != 0){ 
				let nextLayerOnBrain = hiddenLayers.slice().reverse()[i - 1]

				layer.forEach((neuron, i) => {
					neuron.calcHiddenGradients(nextLayerOnBrain)
				})
				
			}
		})
		
		
		// ***For all layers from outputs to first hidden layer***
		// update connection weights
		
		this.layers.slice(1).reverse().forEach((layer, i) => {
			let prevLayerOnBrain = this.layers.slice().reverse()[i + 1]
			layer.forEach((neuron, i) => neuron.updateInputWeights(prevLayerOnBrain))
		})
	}
	
	getResults(resultVals){
		let results = [],
				outputLayer = this.layers.slice(-1)[0]
		
		//excluding BIAS neuron
		outputLayer.filter(neuron => !neuron.isBias)
							 .forEach(neuron => {
							   results.unshift(neuron.outputVal)			 	 
							 })
							 
		return results			
	}
	
}