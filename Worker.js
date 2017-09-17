importScripts("Util.js")
importScripts("Neuron.js")
importScripts("Network.js")
importScripts("Darwin.js")

/* EQUATION TO NEURAL NETWORK*/

var conditions = [];

var solutions = [];

/*
for (var x = 1; x < 5; x++) {

    conditions.push([x])
    solutions.push([x])

}
*/


for (var x = 0; x < 5; x++) {

    for (var y = 0; y < 5; y++) {

        conditions.push([x,y])
        solutions.push([x + y])

    }

}


/*
for (var j = 0; j < 5; j++) {

    conditions[j] = []

    for (var i = 0; i < 2; i++) {

        conditions[j].push(Math.floor(Math.random() * 10))

    }

}

solutions = conditions
*/

/* EQUATION TO NEURAL NETWORK*/

var population = []

while (population.length < 100) {

    var network = new Network([2,1], {
        neuron: {
            activationFunctions: [
                (output, multiplier) => { return 1 / (1 + Math.exp(-output * multiplier)) * 2 - 1 },
                (output, multiplier) => { return output * multiplier },
                (output, multiplier) => { return output },
            ]
        },
        mutationRate: .25
    })

    population.push(network)

}

var darwin = new Darwin(population, {
    conditions: conditions,
    solutions: solutions,
    parentToKeepPercentage: 20
})

darwin.process('container')
