class Network {

    constructor(structure, options) {

        this.options = options || {}

        this.layers = []

        this.structure = structure

        this.structure.forEach((l, k) => {

            this.layers[k] = []

            for (var i = 0; i < l; i++) {

                if (k == 0) {

                    this.layers[k][i] = new Neuron([], k, this.options.neuron.activationFunctions, this.options.neuron.activationFunction)

                } else {

                    this.layers[k][i] = new Neuron(this.layers[k - 1], k, this.options.neuron.activationFunctions, this.options.neuron.activationFunction)

                }

            }

            for (var i = 0; i < l; i++) {

                if (k != 0) {

                    var neurons = this.layers[k][i].inputs.concat(this.layers[k])

                    this.layers[k][i].inputs = neurons.slice()

                }

            }

        })

    }

    process(inputs) {

        for (var i = 1; i < this.layers.length; i++) {

            this.layers[i].forEach(n => {

                n.oldOutput = n.output || 0

            })

        }

        this.layers[0].forEach((n, k) => {

            n.output = inputs[k]

        })

        for (var i = 1; i < this.layers.length; i++) {

            this.layers[i].forEach(n => {

                n.process()
                n.process()
                n.process()
                n.process()
                n.process()

            })

        }

        var result = []

        this.layers[this.layers.length - 1].forEach((n, k) => {

            result[k] = n.output

        })

        return result

    }

    clone() {

        var net = new Network(this.structure, this.options)

        net.layers.forEach((l, k) => {

            l.forEach((n, i) => {

                n.bias = this.layers[k][i].bias

                n.multiplier = this.layers[k][i].multiplier

                n.weights = this.layers[k][i].weights.slice()

                n.activationFunction = this.layers[k][i].activationFunction

                n.activationFunctionName = this.layers[k][i].activationFunctionName
            })

        })

        return net

    }

    mutate() {

        var mutationRate = this.options.mutationRate || .05

        this.layers.forEach((l, k) => {

            l.forEach((n, i) => {

                if (Math.random() < mutationRate) {

                    n.bias = Math.random() * 2 - 1

                }


                if (Math.random() < mutationRate) {

                    n.multiplier += Math.random() * 2 - 1

                }

                if (Math.random() < mutationRate) {

                    n.setActivationFunction(Util.pick(n.activationFunctionsNames))

                }

                n.weights.forEach((w, j) => {

                    if (Math.random() < mutationRate) {

                        n.weights[j] = Math.random() * 2 - 1

                    }

                })

            })

        })

        return this

    }

    breed(partner) {

        var net = new Network(this.structure, this.options)

        net.layers.forEach((l, k) => {

            l.forEach((n, i) => {

                var chosen = null

                if (Math.random() < .5) {

                    chosen = partner.layers[k][i]

                } else {

                    chosen = this.layers[k][i]

                }

                n.bias = chosen.bias

                if (Math.random() < .5) {

                    chosen = partner.layers[k][i]

                } else {

                    chosen = this.layers[k][i]

                }

                n.multiplier = chosen.multiplier

                if (Math.random() < .5) {

                    chosen = partner.layers[k][i]

                } else {

                    chosen = this.layers[k][i]

                }

                n.weights = chosen.weights.slice()

                if (Math.random() < .5) {

                    chosen = partner.layers[k][i]

                } else {

                    chosen = this.layers[k][i]

                }

                n.setActivationFunction(chosen.activationFunctionName)

            })

        })

        return net


    }

    graph(container) {

        var data = {
            nodes: [],
            edges: [],
        }

        var x = 0

        this.layers.forEach((l, i) => {

            var y = 0

            l.forEach((n, k) => {

                data['nodes'].push({
                    id: n.id,
                    x: x,
                    y: y,
                    size: Math.abs(n.bias),
                    color: Util.col(n.bias),

                })

                n.inputs.forEach((inp, j) => {

                    var edge = {
                        id: n.id + inp.id,
                        target: n.id,
                        source: inp.id,
                        color: Util.col(n.weights[j]),
                        size: Math.abs(n.weights[j]) * 10

                    }

                    if (n.id == inp.id) {

                        edge['type'] = "curve"

                    }

                    data['edges'].push(edge)



                })

                y += 20

            })

            x += 20

        })

        return data;

    }

    static unpack(data) {

        var net = new Network(data.structure, data.options)

        net.layers.forEach((l, k) => {

            l.forEach((n, i) => {

                n.bias = data.layers[k][i].bias

                n.multiplier = data.layers[k][i].multiplier

                n.weights = data.layers[k][i].weights.slice()

                n.activationFunction = eval(data.layers[k][i].activationFunctionString)
            })

        })

        return net
    }

    pack() {

        var network = this.clone(this)

        network.layers.forEach(l => {

            l.forEach(n => {

                n.activationFunctionString = '' + n.activationFunction

                delete (n.inputs)

            })

        })

        return network

    }

}