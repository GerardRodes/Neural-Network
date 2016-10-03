import Neuron from './Neuron'

export default class Brain {
	
	constructor(topology) {
		this.topology = topology
		
		console.log('creating brain -> '+this.topology)
		this.buildLayers()
	}

	//Builds the layers with the neurons following the topology
	//adds 1 extra neuron on every layer which is the BIAS neuron
	buildLayers(){
		this.layers = []
		this.topology.forEach(layer => this.layers.push([]))
		
		this.topology.forEach((layerSize, iLayer) => {
			let layer = this.layers[iLayer],
					prevLayer = this.layers[iLayer - 1] || undefined,
					nextLayer = this.layers[iLayer + 1] || undefined
			
			for (let i of Array(layerSize).keys()){
				layer.push(new Neuron(prevLayer, nextLayer, layer, ""+iLayer+i))
			}
			
			let neuronBias 				= new Neuron(prevLayer, nextLayer, layer, ""+iLayer+(layer.length) )
			neuronBias.isBias 		= true
			neuronBias.outputVal 	= 1
			
			layer.push(neuronBias)
		})
		
		this.layers
		.slice(0,this.layers.length - 1)
		.forEach(layer => {
			layer.forEach(neuron => neuron.buildConnections())
		})
	}
	
	feedForward(inputVals){
		if (inputVals.length != this.layers[0].length - 1){
			console.warn('input.length != inputLayer.length')
		}
		
		let inputLayer = this.layers[0]
		
		//Assign the input values into the input neurons
		inputLayer.filter(neuron => !neuron.isBias)
							.forEach((neuron, i) => {
								neuron.outputVal = inputVals[i]
							})
							
		//Forward propagate
		this.layers
		.slice(1)
		.forEach(layer => {
			layer
			.filter(neuron => !neuron.isBias)
			.forEach(neuron => neuron.feedForward())
		})
	}
	
	backProp(targetVals){
		// ***Calculate overall net error***
		let outputLayer 	= this.layers.slice(-1)[0],
				hiddenLayers	= this.layers.slice(1),
				error = 0
				
		// excluding BIAS neuron from output layer
		outputLayer.filter(neuron => !neuron.isBias)
							 .forEach((neuron, i) => {
									let delta = targetVals[i] - neuron.outputVal
									error += delta * delta
								})
		// average error
		error = error / outputLayer.length
		error = Math.sqrt(error)
		console.log('error: '+error)
		
		// ***Calculate output layer gradients***
		outputLayer
		.filter(neuron => !neuron.isBias)
		.forEach((neuron, i) => {
			neuron.calcOutputGradients(targetVals[i])
		})
		
		
		// ***Calculate gradients on hidden layers***
		hiddenLayers
		.slice()
		.reverse()
		.slice(1) //we don't want output layer
		.forEach((layer, i) => {
			let nextLayerOnBrain = this.layers.slice().reverse()[i]

			layer.forEach((neuron, i) => {
				neuron.calcHiddenGradients(nextLayerOnBrain)
			})
		})
		
		
		// ***For all layers from outputs to first hidden layer***
		// update connection weights
		hiddenLayers.slice().reverse().forEach((layer, i) => {
			layer.filter(neuron => !neuron.isBias)
					 .forEach((neuron, i) => neuron.updateInputWeights())
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