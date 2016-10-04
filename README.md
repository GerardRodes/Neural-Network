# Neural Network

building a neural network on javascript with ES6

##Some testing
**Teaching it a XOR logic gate behaviour**
A XOR gate returns 0 if their inputs are equal, and 1 if not, such that:

Input A | Input B | Output
:---: | :---: | :---:
 0 |  0 |  0
 0 |  1 |  1
 1 |  0 |  1
 1 |  1 |  0

First we define each test that our network will pass into an array, and initilize the network:
```javascript
let brain       = new Brain([2,2,1]),
    data        = []

function rndBinary(){
  return Math.random() >= .5 ? 1 : 0
}
  
for (let i of Array(20000).keys()){
  let x = rndBinary(),
      y = rndBinary()
    
  data.push({
    input:    [x, y],
    expected: x == y ? [0] : [1]
  })
}
```
Finally we just run it throught every test and print the results
```javascript
data.forEach((test, i) => {
  console.log('-----------test #'+i+'-----------')
  console.log('input: '+test.input)
  console.log('expected: '+test.expected)
  brain.feedForward(test.input)
  brain.backProp(test.expected)
  let results = brain.getResults()
  console.log('obtained: '+results[0])
})
```

And this are the screenshots of the console:  
![](https://i.gyazo.com/8522ce2df329a79ff5456fc064804452.png)  
.  
.  
.  
![](https://i.gyazo.com/4afd1627f75e64a3e9460d8984fdef41.png)


_Made thanks to [this excellent video](https://www.youtube.com/watch?v=KkwX7FkLfug)_
