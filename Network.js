class Network {

    constructor(structure, options) {

        this.options = options || {}

        this.layers = []

        this.structure = structure

        this.structure.forEach((l, k) => {

            this.layers[k] = []

            for (var i = 0; i < l; i++) {

                if (k == 0) {

                    this.layers[k][i] = new Neuron([], k, this.options.neuron)

                } else {

                    this.layers[k][i] = new Neuron(this.layers[k - 1], k, this.options && this.options.neuron)

                }

            }

            /*
             * TODO: Recursive synapse
            for (var i = 0; i < l; i++) {

                if (k != 0) {

                    var neurons = this.layers[k][i].inputs.concat(this.layers[k])

                    this.layers[k][i].inputs = neurons.slice()

                }

            }
            */

        })

    }

    process(inputs) {

        /*
         * TODO: Recursive synapse
        for (var i = 1; i < this.layers.length; i++) {

            this.layers[i].forEach(n => {

                n.oldOutput = n.output || 0

            })

        }
        */

        this.layers[0].forEach((n, k) => {

            n.output = inputs[k]

        })

        for (var i = 1; i < this.layers.length; i++) {

            this.layers[i].forEach(n => {

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

                n.options.activationFunction = this.layers[k][i].options.activationFunction
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

                    n.activationFunction = pick(n.options.activationFunctions)

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
                    // label: n.bias.toString(),
                    x: y,
                    y: x,
                    size: 3,
                    color: col(n.bias),

                })

                n.inputs.forEach((inp, j) => {

                    data['edges'].push({
                        id: n.id + inp.id,
                        target: n.id,
                        source: inp.id,
                        color: col(n.weights[j])
                        //    label: n.weights[j].toString(),

                    })

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