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

                    err += Math.abs(solutions[k][j] - o) > 0.01

                })

                network.fitness -= err

            })


        })

        return result

    }

    breed(population, lives_size, sexualy) {

        population.sort(function (a, b) {
            return b.fitness - a.fitness
        })

        var children = []

        if (!sexualy) {

            while (children.length < lives_size) {
                var i = Math.floor(Math.random() * (children.length + 1) / lives_size * population.length)
                var son = population[i].clone().mutate()

                children.push(son)
            }

        } else {

            
            var bestParent = population[0];

            var i = 0

            while (children.length < lives_size) {

                var son = bestParent.breed(population[i])

                i++

                children.push(son.clone().mutate())
            }

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
                    generationNumber: i,
                    fitness: this.population[0].fitness
                })

                unique_id = 0

            }

            if (this.population[0].fitness >= -.1) {

                postMessage({
                    type: {
                        update: true
                    },
                    graph: this.population[0].graph(),
                    generationNumber: i,
                    fitness: this.population[0].fitness
                })

                postMessage({
                    type: {
                        success: true
                    },
                    bestNetwork: JSON.stringify(this.population[0].pack()),
                })
                break;

            }

            var parentToKeepPercentage = this.options.parentToKeepPercentage || 20

            this.population = this.breed(this.population.slice(0, Math.floor(this.population.length * 100 / parentToKeepPercentage)), this.populationLength, true)

        }

    }
}