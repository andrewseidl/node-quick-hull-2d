qh = require("../quickhull.js")

var test = require("tape")

test('collinear', function(t) {
    var res = qh([[0,0],[1,1],[1,0],[0.5,0.5],[0.7,0.1]])

    t.deepEqual(res, [ [ 0, 0 ], [ 1, 0 ], [ 1, 1 ] ])

    t.end()
});

/*
  Here we have a 20x20x20 cube oriented with the bottom at z=0
  and the extents on x/y as -10 to 10
*/
test('3d cube compressed into 2d', function(t) {

    var res = qh([
      [-10,0],[0,0],[-10,10],[-10,10],
      [0,0],[0,10],[-10,20],[0,10],[0,20],
      [-10,20],[-10,10],[0,10],[0,0],
      [10,0],[0,10],[0,10],[10,0],[10,10],
      [0,20],[10,10],[10,20],[0,20],[0,10],
      [10,10],[-10,0],[-10,0],[-10,10],
      [-10,10],[-10,0],[-10,10],[-10,20],
      [-10,10],[-10,20],[-10,20],[-10,10],
      [-10,10],[-10,0],[-10,0],[-10,10],
      [-10,10],[-10,0],[-10,10],[-10,20],
      [-10,10],[-10,20],[-10,20],[-10,10],
      [-10,10],[10,0],[0,0],[10,10],[10,10],
      [0,0],[0,10],[10,20],[0,10],[0,20],
      [10,20],[10,10],[0,10],[0,0],[-10,0],
      [0,10],[0,10],[-10,0],[-10,10],[0,20],
      [-10,10],[-10,20],[0,20],[0,10],[-10,10],
      [10,0],[10,0],[10,10],[10,10],[10,0],
      [10,10],[10,20],[10,10],[10,20],[10,20],
      [10,10],[10,10],[10,0],[10,0],[10,10],
      [10,10],[10,0],[10,10],[10,20],[10,10],
      [10,20],[10,20],[10,10],[10,10],[0,20],
      [10,20],[0,20],[-10,20],[0,20],[-10,20],
      [-10,20],[0,20],[0,20],[-10,20],[-10,20],
      [0,20],[10,20],[0,20],[10,20],[10,20],
      [0,20],[0,20],[10,20],[10,20],[0,20],
      [0,20],[-10,20],[0,20],[0,0],[10,0],[0,0],
      [-10,0],[0,0],[-10,0],[-10,0],[0,0],[0,0],
      [-10,0],[-10,0],[0,0],[10,0],[0,0],[10,0],
      [10,0],[0,0],[0,0],[10,0],[10,0],[0,0],
      [0,0],[-10,0],[0,0]
    ]);

    t.deepEqual(res, [[-10,0],[10,0],[10,20],[-10,20]])

  t.end();
});

