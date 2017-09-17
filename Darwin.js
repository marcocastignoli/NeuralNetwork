class Darwin {

    constructor(population, options) {

        this.options = options || {}

        if (!(this.options.conditions && this.options.solutions)) {
            throw "Missing conditions or solutions"
        }

        this.population = population;

        this.populationLength = population.length

        if (this.options.conditions[0].length != this.population[0].structure[0]) {
            throw "Number of conditions different from number of inputs"
        }

        if (this.options.solutions[0].length != this.population[0].structure.slice(-1)[0]) {
            throw "Number of solutions different from number of inputs"
        }



    }

    assignFitness() {
        
        var conditions = this.options.conditions
        var solutions = this.options.solutions

        var result = []

        this.population.forEach(network => {

            network.fitness = 0

            conditions.forEach((inputs, k) => {

                var output = network.process(inputs)

                result.push([inputs, output])

                var err = 0

                output.forEach((o, j) => {

                    //err += Math.abs(solutions[k][j] - o) > 2

                    err += Math.abs((solutions[k][j]) - o )

                })

                network.fitness -= err

            })


        })

        return result

    }

    geneticAlgorithm(lives, lives_size) {
        // Sort the lives (higher fitness is better)
        lives.sort(function (a, b) {
            return b.fitness - a.fitness
        })

        var children = []

        while (children.length < lives_size) {
            var i = Math.floor(Math.random() * (children.length + 1) / lives_size * lives.length)
            var son = lives[i].clone().mutate()
            children.push(son)
        }

        return children
    }

    process(container, debug) {

        for (var i = 0; ; i++) {

            var res = this.assignFitness()

            this.population.sort(function (a, b) {
                return b.fitness - a.fitness;
            })

            if (debug) {

                console.log(res)
                console.log(i, this.population[0].fitness)

            }

            if (i % 100 == 0) {

                postMessage({
                    type: {
                        update: true
                    },
                    graph: this.population[0].graph(),
                })

            }

            if (this.population[0].fitness >= -.1) {
                
                postMessage({
                    type: {
                        success: true
                    },
                    bestNetwork: JSON.stringify(this.population[0].pack()),
                })
                break;

            }

            var parentToKeepPercentage = this.options.parentToKeepPercentage || 20

            // faccio i bimbi
            this.population = this.geneticAlgorithm(this.population.slice(0, Math.floor(this.population.length*100 / parentToKeepPercentage)), this.populationLength)

        }

    }
}