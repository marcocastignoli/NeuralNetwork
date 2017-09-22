class Universe {

    constructor() {

        this.conditions = []

        this.solutions = []

        this.population = []

        this.darwin = null

        this.init()

    }

    loadEnvironment() {

        for (var x = 0; x < 5; x++) {

            for (var y = 0; y < 5; y++) {

                this.conditions.push([x, y])
                this.solutions.push([x + y])

            }

        }

    }

    loadPopulation() {

        var nInput = this.conditions[0].length
        var nOutput = this.solutions[0].length

        while (this.population.length < 100) {

            var network = new Network([nInput, nOutput], {
                neuron: {
                    activationFunctions: [
                        (output, multiplier) => { return 1 / (1 + Math.exp(-output * multiplier)) * 2 - 1 },
                        (output, multiplier) => { return output * multiplier },
                        (output, multiplier) => { return output },
                    ]
                },
                mutationRate: .30
            })

            this.population.push(network)

        }

    }

    loadRules() {

        this.darwin = new Darwin(this.population, {
            conditions: this.conditions,
            solutions: this.solutions,
            parentToKeepPercentage: 10
        })

    }

    init() {

        this.loadEnvironment()

        this.loadPopulation()

        this.loadRules()

    }

    bigBang () {

        this.darwin.process('container')

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
