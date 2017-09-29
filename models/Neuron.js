var globalActivationFunctions = {
    "Sigmoid": (output, multiplier) => { return 1 / (1 + Math.exp(-output * multiplier)) * 2 - 1 },
    "LinearWithMultiplier": (output, multiplier) => { return output * multiplier },
    "Linear": (output, multiplier) => { return output }
}

class Neuron {

    constructor(layer, layerId, activationFunctionsNames, activationFunctionName ) {

        this.id = Util.uid()

        this.inputs = layer

        this.layerId = layerId

        this.weights = []

        this.inputs.forEach((w, i) => {

            this.weights.push(Math.random() * 2 - 1)

        })

        this.bias = Math.random() * 2 - 1

        this.multiplier = Math.random() * 2 - 1

        this.activationFunctionsNames = activationFunctionsNames

        this.setActivationFunction("Linear")

        if(activationFunctionsNames){

            this.setActivationFunction(Util.pick(activationFunctionsNames))

        }
        
        if (activationFunctionName) {
            
            this.setActivationFunction(activationFunction)

        }

        this.output = 0

    }

    setActivationFunction (activationFunctionName) {

        this.activationFunctionName = activationFunctionName

        this.activationFunction = globalActivationFunctions[activationFunctionName]

    }

    process() {

        this.output = this.bias

        this.weights.forEach((w, i) => {

            this.output += ( this.inputs[i].layerId==this.layerId ? this.inputs[i].oldOutput : this.inputs[i].output ) * w

        })
        
        this.output = this.activationFunction(this.output, this.multiplier)

    }

}