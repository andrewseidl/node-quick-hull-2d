qh = require("../quickhull.js")

require("tape")(function(t) {
    var res = qh([[0,0],[0.1,0.1],[0.5,1],[1,0]])

    t.deepEqual(res, [ [ 0, 0 ], [ 1, 0 ], [ 0.5, 1 ] ])

    t.end()
})

