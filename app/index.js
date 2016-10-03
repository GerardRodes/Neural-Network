import Drawer from './elements/Drawer'
import Brain from './elements/Brain'

import styles from './main.css'

(function(){
	
	let container 	= document.getElementById('app'),
			drawer 			= new Drawer(container),
			brain 			= new Brain([2,2,1]),
			data				= []
	
	
	// setting data training to teach NN XOR logic
	
	function rndBinary(){
		return Math.random() >= .5 ? 1 : 0
	}
	
	for (let i of Array(50000).keys()){
		
		let x = rndBinary(),
				y = rndBinary()
		
		data.push({
			input: 		[x, y],
			expected: x == y ? [0] : [1]
		})
	}
	
	data.forEach((test, i) => {
		console.log('-----------test #'+i+'-----------')
		console.log('input: '+test.input)
		console.log('expected: '+test.expected)
		brain.feedForward(test.input)
		brain.backProp(test.expected)
		let results = brain.getResults()
		console.log('obtained: '+results[0])
	})
	
	
	console.dir(brain)
	
})();