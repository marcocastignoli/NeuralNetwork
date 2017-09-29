var globalActivationFunctions = {
    "Sigmoid": (output, multiplier) => { return 1 / (1 + Math.exp(-output * multiplier)) * 2 - 1 },
    "LinearWithMultiplier": (output, multiplier) => { return output * multiplier },
    "Linear": (output, multiplier) => { return output }
}

class Neuron {

    constructor(layer, layerId, options) {

        this.options = options || {}

        this.id = Util.uid()

        this.inputs = layer

        this.layerId = layerId

        this.weights = []

        this.inputs.forEach((w, i) => {

            this.weights.push(Math.random() * 2 - 1)

        })

        this.bias = Math.random() * 2 - 1

        this.multiplier = Math.random() * 2 - 1

        this.activationFunction =
            this.options.activationFunctions
                ? globalActivationFunctions[Util.pick(this.options.activationFunctions)]
                : globalActivationFunctions["Linear"]

        if (this.options.activationFunction) {

            this.activationFunction = globalActivationFunctions[this.options.activationFunction]

        }

        this.output = 0

    }

    process() {

        this.output = this.bias

        this.weights.forEach((w, i) => {

            this.output += ( this.inputs[i].layerId==this.layerId ? this.inputs[i].oldOutput : this.inputs[i].output ) * w

        })
        
        this.output = this.activationFunction(this.output, this.multiplier)

    }

}