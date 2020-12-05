//javascript code here

//https://stackoverflow.com/questions/44877904/how-do-you-import-a-javascript-package-from-a-cdn-script-tag-in-react

const ai = window.neataptic;

window.addEventListener('load', async function() {
    // your code here
    var network = new ai.Network(2,1);

    var trainingSet = [
    { input: [0,0], output: [0] },
    { input: [0,1], output: [1] },
    { input: [1,0], output: [1] },
    { input: [1,1], output: [0] }
    ];

    //neuroevolution
    await network.evolve(trainingSet, {
    equal: true,
    error: 0.01
    });

    alert(network.activate([1,1]));

    //backpropagation

    var network2 = new ai.architect.Perceptron(2, 4, 1);

    network2.train(trainingSet, {
        error: 0.01
    });
      
    alert(network2.activate([1,1]));



})