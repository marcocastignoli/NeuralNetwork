var worker = new Worker("Worker.js")

var s

var test;

worker.addEventListener('message', msg => {

    if (msg.data.type.update) {

        s && s.kill()

        s = new sigma({
            graph: msg.data.graph,
            renderer: {
                container: container,
                type: "canvas"
            },
        });

        var log = "Generation: " + msg.data.generationNumber + "<br>" + "Fitness: " + msg.data.fitness + "<hr>"

        var html = document.querySelector("#log").innerHTML

        document.querySelector("#log").innerHTML = log + html

    }

    if (msg.data.type.success) {

        var packedNetwork = JSON.parse(msg.data.bestNetwork)

        var network = Network.unpack(packedNetwork)

        test = x => {
            return network.process(x);
        }

        console.log("finito")

    }

})

var restart = () => {
    location.reload();
}

jQuery(function ($, undefined) {
    $('#terminal').terminal(function (command) {
        if (command !== '') {
            try {
                var result = window.eval(command);
                if (result !== undefined) {
                    this.echo(new String(result));
                }
            } catch (e) {
                this.error(new String(e));
            }
        } else {
            this.echo('');
        }
    }, {
            greetings: 'Code using your neural network (test)',
            name: 'NeuralNetwork',
            height: 200,
            prompt: '> '
        });
});