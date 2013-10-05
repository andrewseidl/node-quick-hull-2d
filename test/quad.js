qh = require("../quickhull.js")

require("tape")(function(t) {
    var res = qh([[-1,0],[0.1,0.1],[0,1],[1,0],[0.51,0.5]])

    t.deepEqual(res, [ [ -1, 0 ], [ 1, 0 ], [ 0.51, 0.5 ] , [ 0, 1 ] ])

    t.end()
})

