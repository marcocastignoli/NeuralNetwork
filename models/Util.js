var unique_id = 0

class Util {

    static uid () {

        return 'a'+unique_id++

    }

    static pick (array) {
        var i = Math.floor(Math.random() * array.length)
        return array[i]
    }

    static col (weight) {
        var v = weight
        v = Math.min(1, Math.max(v, -1))
        var v01 = v / 2 + .5
        var c = [
            0,
            1 - v01,
            0
        ]
        c[0] *= 255
        c[1] *= 255
        c[2] *= 255
        c[0] = Math.floor(c[0])
        c[1] = Math.floor(c[1])
        c[2] = Math.floor(c[2])
        return 'rgba(' + c.join(',') + ')'
    }

}
