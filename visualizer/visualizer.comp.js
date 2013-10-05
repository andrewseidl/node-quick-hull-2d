;(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);throw new Error("Cannot find module '"+o+"'")}var f=n[o]={exports:{}};t[o][0].call(f.exports,function(e){var n=t[o][1][e];return s(n?n:e)},f,f.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict"

var robustSum = require("robust-sum")
var robustScale = require("robust-scale")
var twoSum = require("two-sum")
var twoProduct = require("two-product")

module.exports = leftRightTest

function leftRightTest(a, b, c) {
  var X = robustScale(twoSum(b[1], -c[1]), a[0])
  var Y = robustScale(twoSum(c[0], -b[0]), a[1])
  var Z = robustSum(twoProduct(b[0], c[1]), twoProduct(-b[1], c[0]))
  var d = robustSum(robustSum(X, Y), Z)
  var s = d[d.length-1]
  if(s < 0) {
    return -1
  }
  if(s > 0) {
    return 1
  }
  return 0
}
},{"robust-scale":2,"robust-sum":4,"two-product":5,"two-sum":6}],2:[function(require,module,exports){
"use strict"

var twoProduct = require("two-product")
var twoSum = require("two-sum")

module.exports = scaleLinearExpansion

function scaleLinearExpansion(e, b, result) {
	var n = e.length
	var g
	if(result) {
		g = result
	} else {
		g = new Array(2 * n)
	}
	var q = [0.1, 0.1]
	var t = [0.1, 0.1]
	var count = 0
	twoProduct(e[0], b, q)
	if(q[0]) {
		g[count++] = q[0]
	}
	for(var i=1; i<n; ++i) {
		twoProduct(e[i], b, t)
		twoSum(q[1], t[0], q)
		if(q[0]) {
			g[count++] = q[0]
		}
		var a = t[1]
		var b = q[1]
		var x = a + b
		var bv = x - a
		var y = b - bv
		q[1] = x
		if(y) {
			g[count++] = y
		}
	}
	if(q[1]) {
		g[count++] = q[1]
	}
	if(count === 0) {
		g[count++] = 0.0
	}
	if(result) {
    if(count < g.length) {
      var ptr = g.length-1
      count--
      while(count >= 0) {
        g[ptr--] = g[count--]
      }
      while(ptr >= 0) {
        g[ptr--] = 0.0
      }
    }
		return g
	}
	g.length = count
	return g
}
},{"two-product":5,"two-sum":6}],3:[function(require,module,exports){
"use strict"

function merge2_cmp(a, b, result, compare) {
  var a_ptr = 0
    , b_ptr = 0
    , r_ptr = 0
  while(a_ptr < a.length && b_ptr < b.length) {
    if(compare(a[a_ptr], b[b_ptr]) <= 0) {
      result[r_ptr++] = a[a_ptr++]
    } else {
      result[r_ptr++] = b[b_ptr++]
    }
  }
  while(a_ptr < a.length) {
    result[r_ptr++] = a[a_ptr++]
  }
  while(b_ptr < b.length) {
    result[r_ptr++] = b[b_ptr++]
  }
}

function merge2_def(a, b, result) {
  var a_ptr = 0
    , b_ptr = 0
    , r_ptr = 0
  while(a_ptr < a.length && b_ptr < b.length) {
    if(a[a_ptr] <= b[b_ptr]) {
      result[r_ptr++] = a[a_ptr++]
    } else {
      result[r_ptr++] = b[b_ptr++]
    }
  }
  while(a_ptr < a.length) {
    result[r_ptr++] = a[a_ptr++]
  }
  while(b_ptr < b.length) {
    result[r_ptr++] = b[b_ptr++]
  }
}

function merge2(a, b, compare, result) {
  if(!result) {
    result = new Array(a.length + b.length)
  }
  if(compare) {
    merge2_cmp(a, b, result, compare)
  } else {
    merge2_def(a, b, result)
  }
  return result
}

module.exports = merge2
},{}],4:[function(require,module,exports){
"use strict"

var twoSum = require("two-sum")
var binaryMerge = require("binary-merge")

module.exports = linearExpansionSum

function compareMagnitudes(a, b) {
	return Math.abs(a) - Math.abs(b)
}

function linearExpansionSum(e, f, result) {
	var g = binaryMerge(e, f, compareMagnitudes, result)
	var n = e.length + f.length
	var count = 0
	var a = g[1]
	var b = g[0]
	var x = a + b
	var bv = x - a
	var y = b - bv
	var q = [y, x]
	for(var i=2; i<n; ++i) {
		a = g[i]
		b = q[0]
		x = a + b
		bv = x - a
		y = b - bv
		if(y) {
			g[count++] = y
		}
		twoSum(q[1], x, q)
	}
	if(q[0]) {
		g[count++] = q[0]
	}
	if(q[1]) {
		g[count++] = q[1]
	}
	if(!count) {
		g[count++] = 0.0
	}
	if(result) {
    if(count < g.length) {
      var ptr = g.length-1
      count--
      while(count >= 0) {
        g[ptr--] = g[count--]
      }
      while(ptr >= 0) {
        g[ptr--] = 0.0
      }
    }
	} else {
		g.length = count
	}
	return g
}
},{"binary-merge":3,"two-sum":6}],5:[function(require,module,exports){
"use strict"

module.exports = twoProduct

var HALF_DOUBLE = (1<<26) + 1

function twoProduct(a, b, result) {
	var x = a * b

	var c = HALF_DOUBLE * a
	var abig = c - a
	var ahi = c - abig
	var alo = a - ahi
	
	var d = HALF_DOUBLE * b
	var bbig = d - b
	var bhi = d - bbig
	var blo = b - bhi
	
	var err1 = x - (ahi * bhi)
	var err2 = err1 - (alo * bhi)
	var err3 = err2 - (ahi * blo)
	
	var y = alo * blo - err3
	
	if(result) {
		result[0] = y
		result[1] = x
		return result
	}
	
	return [ y, x ]
}
},{}],6:[function(require,module,exports){
"use strict"

module.exports = fastTwoSum

function fastTwoSum(a, b, result) {
	var x = a + b
	var bv = x - a
	var av = x - bv
	var br = b - bv
	var ar = a - av
	if(result) {
		result[0] = ar + br
		result[1] = x
		return result
	}
	return [ar+br, x]
}
},{}],7:[function(require,module,exports){
"use strict"

var lr = require("left-right")

// these should probably use robust-sum, etc
function vectSum(a,b) {
    return a.map(function(val,i) { return a[i]+b[i] })
}
function vectScale(a,b) {
    return a.map(function(val,i) { return a[i]*b })
}
function vectDiff(a,b) {
    return vectSum(a,vectScale(b,-1))
}
function dot(a,b) {
    return a[0]*b[0] + a[1]*b[1]
}

// calculates the closest distance from a point to a line formed by two points
// || (a-p) - ((a-p) \dot n) n ||
function distLineToPoint(a, b, p) {
    var n = vectDiff(b, a)
    n = vectScale(n, 1/Math.sqrt(n[0]*n[0]+n[1]*n[1]))
    
    var amp = vectDiff(a, p)
    var d = vectDiff(amp, vectScale(n,(dot(amp, n))))
    //return { d:d, a:amp, nn:n, n:dot(amp,n)}
    return Math.sqrt(d[0]*d[0]+d[1]*d[1])
}

function isStrictlyRight(p) {
        return lr(this.a, this.b, p) == -1 ? 1 : 0
}

// sort the given points in CCW order
// FIXME: 
function sortHull(Sorig) {
    var S = Sorig.slice()
    var Ssorted = []
    var last = S.shift()
    Ssorted.push(last)

    while (S.length > 0) {
        var curr = S.shift()
        var A = S.filter(isStrictlyRight, {a:last, b:curr})
        if (A.length == 0) {
            Ssorted.push(curr)
            last = curr
        } else {
            S.push(curr)
        }
    }

    return Ssorted
}

// QuickHull
// O'Rourke - Computational Geometry in C, p. 70
function quickHullInner(S, a, b) {
    if (S.length == 0) {
        return []
    }

    var d = S.map(function(p) {return {dist: lr(a,b,p)*distLineToPoint(a, b, p), point: p}})
    d.sort(function(a,b) { return a.dist > b.dist ? 1 : -1 })
    var dd = d.map(function(pp) { return pp.point })

    var c = d.pop()
    if (c.dist <= 0) {
        return []
    }
    c = c.point

    // seems like these should be reversed, but this works
    var A = dd.filter(isStrictlyRight, {a:c, b:a})
    var B = dd.filter(isStrictlyRight, {a:b, b:c})

    // FIXME need better way in case qHI returns []
    var ress = quickHullInner(A, a, c).concat([c], quickHullInner(B, c, b))
    return ress

}

function quickHull(S) {
    if (S.length < 3) {
        return S
    } else {
        var d = S.slice()
        // sort by x
        d.sort(function(a,b) {return a[0] > b[0] ? 1 : -1})

        var a = d.shift()
        var b = d.pop()

        var S1 = S.filter(isStrictlyRight, {a:b, b:a})
        var S2 = S.filter(isStrictlyRight, {a:a, b:b})

        var x = quickHullInner(S1,a,b)
        var y = quickHullInner(S2,b,a)
        var res = [a].concat(x, [b], y)

        return sortHull(res)
    }
}

module.exports = quickHull

},{"left-right":1}],8:[function(require,module,exports){
var quickhull = require("../quickhull.js")

var scale = document.body.querySelector("#scale").value
var resetButton = document.body.querySelector("#reset");
var canvas = document.body.querySelector("#canvas");
var context = canvas.getContext("2d");
var points = new Array();
var boundaryPoints = new Array();

function initialize() {   
    resetButton.addEventListener("click",reset);
    canvas.addEventListener("mousedown",addPoint,false);
    reset()
}

function drawAll() {
    scale = document.body.querySelector("#scale").value
    canvas.width = scale*2;
    canvas.height = scale*2;
    
    context.fillStyle = "rgb(255, 255, 255)"
    context.fillRect(0, 0, 400*scale/200, 400*scale/200)
    
	drawBoundary()
    drawPoints()
    console.log("points")
    console.log(points)
    boundaryPoints = quickhull(points)
    console.log("bounds")
    console.log(boundaryPoints)
	drawConvexHull()
}

function convertCartesianToPixels(point) {
    var newPoint = [0, 0]
    newPoint[0] = scale*(point[0]+1)
    newPoint[1] = scale*(1-point[1])
    
    return newPoint
}

function convertPixelsToCartesian(point) {
    var newPoint = [0, 0]
    newPoint[0] = point[0]/scale-1
    newPoint[1] = 1-point[1]/scale
    
    return newPoint
}

function drawPoint(position) {
    var pos = convertCartesianToPixels(position)
    context.strokeStyle = "rgb(0, 0, 255)"
    context.beginPath();
    context.arc(pos[0],pos[1],4,0,2*Math.PI, true)
    context.closePath()
    context.stroke();
}

function drawLine(startCart, endCart) {
    context.beginPath()
    context.strokeStyle = "rgb(255, 0, 0)"
    var start = convertCartesianToPixels(startCart)
    var end = convertCartesianToPixels(endCart)
    context.moveTo(start[0],start[1])
    context.lineTo(end[0],end[1])
    context.closePath()
    context.stroke();
}

function drawConvexHull() {
	if(boundaryPoints.length>2) {
		for (var i=0;i<boundaryPoints.length-1;i++) {
			drawLine(boundaryPoints[i],boundaryPoints[i+1])
		}
		drawLine(boundaryPoints[boundaryPoints.length-1],boundaryPoints[0])
	}
}

function drawPoints() {
    for (var i=0;i<points.length;i++) {
        drawPoint(points[i])
    }
}

function drawBoundary() {
	drawLine([-1,-1],[-1,1])
	drawLine([-1,1],[1,1])
	drawLine([1,1],[1,-1])
	drawLine([1,-1],[-1,-1])
}

function reset() {
	points = new Array();
	boundaryPoints = new Array();
    drawAll()
}

function addPoint(event) {
    //console.log("Point added at px("+event.pageX+", "+event.pageY+")")
    var point = [0,0];
    point = convertPixelsToCartesian([event.pageX-canvas.offsetLeft, event.pageY-canvas.offsetTop])
    //position.push(point)
    //console.log(position)
    //initialPosition.push(point)
    console.log("Point added at ("+point[0]+", "+point[1]+")")
    console.log(" ");
	points.push(point);
    drawAll()
}

initialize()



},{"../quickhull.js":7}]},{},[8])
//@ sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlcyI6WyIvaG9tZS9hbmRyZXcvUmVwb3NpdG9yaWVzL25vZGUtcXVpY2staHVsbC0yZC9ub2RlX21vZHVsZXMvbGVmdC1yaWdodC9sZWZ0cmlnaHQuanMiLCIvaG9tZS9hbmRyZXcvUmVwb3NpdG9yaWVzL25vZGUtcXVpY2staHVsbC0yZC9ub2RlX21vZHVsZXMvbGVmdC1yaWdodC9ub2RlX21vZHVsZXMvcm9idXN0LXNjYWxlL3JvYnVzdC1zY2FsZS5qcyIsIi9ob21lL2FuZHJldy9SZXBvc2l0b3JpZXMvbm9kZS1xdWljay1odWxsLTJkL25vZGVfbW9kdWxlcy9sZWZ0LXJpZ2h0L25vZGVfbW9kdWxlcy9yb2J1c3Qtc3VtL25vZGVfbW9kdWxlcy9iaW5hcnktbWVyZ2UvbWVyZ2UyLmpzIiwiL2hvbWUvYW5kcmV3L1JlcG9zaXRvcmllcy9ub2RlLXF1aWNrLWh1bGwtMmQvbm9kZV9tb2R1bGVzL2xlZnQtcmlnaHQvbm9kZV9tb2R1bGVzL3JvYnVzdC1zdW0vcm9idXN0LXN1bS5qcyIsIi9ob21lL2FuZHJldy9SZXBvc2l0b3JpZXMvbm9kZS1xdWljay1odWxsLTJkL25vZGVfbW9kdWxlcy9sZWZ0LXJpZ2h0L25vZGVfbW9kdWxlcy90d28tcHJvZHVjdC90d28tcHJvZHVjdC5qcyIsIi9ob21lL2FuZHJldy9SZXBvc2l0b3JpZXMvbm9kZS1xdWljay1odWxsLTJkL25vZGVfbW9kdWxlcy9sZWZ0LXJpZ2h0L25vZGVfbW9kdWxlcy90d28tc3VtL3R3by1zdW0uanMiLCIvaG9tZS9hbmRyZXcvUmVwb3NpdG9yaWVzL25vZGUtcXVpY2staHVsbC0yZC9xdWlja2h1bGwuanMiLCIvaG9tZS9hbmRyZXcvUmVwb3NpdG9yaWVzL25vZGUtcXVpY2staHVsbC0yZC92aXN1YWxpemVyL3Zpc3VhbGl6ZXIuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IjtBQUFBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMzREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDMUdBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSIsInNvdXJjZXNDb250ZW50IjpbIlwidXNlIHN0cmljdFwiXG5cbnZhciByb2J1c3RTdW0gPSByZXF1aXJlKFwicm9idXN0LXN1bVwiKVxudmFyIHJvYnVzdFNjYWxlID0gcmVxdWlyZShcInJvYnVzdC1zY2FsZVwiKVxudmFyIHR3b1N1bSA9IHJlcXVpcmUoXCJ0d28tc3VtXCIpXG52YXIgdHdvUHJvZHVjdCA9IHJlcXVpcmUoXCJ0d28tcHJvZHVjdFwiKVxuXG5tb2R1bGUuZXhwb3J0cyA9IGxlZnRSaWdodFRlc3RcblxuZnVuY3Rpb24gbGVmdFJpZ2h0VGVzdChhLCBiLCBjKSB7XG4gIHZhciBYID0gcm9idXN0U2NhbGUodHdvU3VtKGJbMV0sIC1jWzFdKSwgYVswXSlcbiAgdmFyIFkgPSByb2J1c3RTY2FsZSh0d29TdW0oY1swXSwgLWJbMF0pLCBhWzFdKVxuICB2YXIgWiA9IHJvYnVzdFN1bSh0d29Qcm9kdWN0KGJbMF0sIGNbMV0pLCB0d29Qcm9kdWN0KC1iWzFdLCBjWzBdKSlcbiAgdmFyIGQgPSByb2J1c3RTdW0ocm9idXN0U3VtKFgsIFkpLCBaKVxuICB2YXIgcyA9IGRbZC5sZW5ndGgtMV1cbiAgaWYocyA8IDApIHtcbiAgICByZXR1cm4gLTFcbiAgfVxuICBpZihzID4gMCkge1xuICAgIHJldHVybiAxXG4gIH1cbiAgcmV0dXJuIDBcbn0iLCJcInVzZSBzdHJpY3RcIlxuXG52YXIgdHdvUHJvZHVjdCA9IHJlcXVpcmUoXCJ0d28tcHJvZHVjdFwiKVxudmFyIHR3b1N1bSA9IHJlcXVpcmUoXCJ0d28tc3VtXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gc2NhbGVMaW5lYXJFeHBhbnNpb25cblxuZnVuY3Rpb24gc2NhbGVMaW5lYXJFeHBhbnNpb24oZSwgYiwgcmVzdWx0KSB7XG5cdHZhciBuID0gZS5sZW5ndGhcblx0dmFyIGdcblx0aWYocmVzdWx0KSB7XG5cdFx0ZyA9IHJlc3VsdFxuXHR9IGVsc2Uge1xuXHRcdGcgPSBuZXcgQXJyYXkoMiAqIG4pXG5cdH1cblx0dmFyIHEgPSBbMC4xLCAwLjFdXG5cdHZhciB0ID0gWzAuMSwgMC4xXVxuXHR2YXIgY291bnQgPSAwXG5cdHR3b1Byb2R1Y3QoZVswXSwgYiwgcSlcblx0aWYocVswXSkge1xuXHRcdGdbY291bnQrK10gPSBxWzBdXG5cdH1cblx0Zm9yKHZhciBpPTE7IGk8bjsgKytpKSB7XG5cdFx0dHdvUHJvZHVjdChlW2ldLCBiLCB0KVxuXHRcdHR3b1N1bShxWzFdLCB0WzBdLCBxKVxuXHRcdGlmKHFbMF0pIHtcblx0XHRcdGdbY291bnQrK10gPSBxWzBdXG5cdFx0fVxuXHRcdHZhciBhID0gdFsxXVxuXHRcdHZhciBiID0gcVsxXVxuXHRcdHZhciB4ID0gYSArIGJcblx0XHR2YXIgYnYgPSB4IC0gYVxuXHRcdHZhciB5ID0gYiAtIGJ2XG5cdFx0cVsxXSA9IHhcblx0XHRpZih5KSB7XG5cdFx0XHRnW2NvdW50KytdID0geVxuXHRcdH1cblx0fVxuXHRpZihxWzFdKSB7XG5cdFx0Z1tjb3VudCsrXSA9IHFbMV1cblx0fVxuXHRpZihjb3VudCA9PT0gMCkge1xuXHRcdGdbY291bnQrK10gPSAwLjBcblx0fVxuXHRpZihyZXN1bHQpIHtcbiAgICBpZihjb3VudCA8IGcubGVuZ3RoKSB7XG4gICAgICB2YXIgcHRyID0gZy5sZW5ndGgtMVxuICAgICAgY291bnQtLVxuICAgICAgd2hpbGUoY291bnQgPj0gMCkge1xuICAgICAgICBnW3B0ci0tXSA9IGdbY291bnQtLV1cbiAgICAgIH1cbiAgICAgIHdoaWxlKHB0ciA+PSAwKSB7XG4gICAgICAgIGdbcHRyLS1dID0gMC4wXG4gICAgICB9XG4gICAgfVxuXHRcdHJldHVybiBnXG5cdH1cblx0Zy5sZW5ndGggPSBjb3VudFxuXHRyZXR1cm4gZ1xufSIsIlwidXNlIHN0cmljdFwiXG5cbmZ1bmN0aW9uIG1lcmdlMl9jbXAoYSwgYiwgcmVzdWx0LCBjb21wYXJlKSB7XG4gIHZhciBhX3B0ciA9IDBcbiAgICAsIGJfcHRyID0gMFxuICAgICwgcl9wdHIgPSAwXG4gIHdoaWxlKGFfcHRyIDwgYS5sZW5ndGggJiYgYl9wdHIgPCBiLmxlbmd0aCkge1xuICAgIGlmKGNvbXBhcmUoYVthX3B0cl0sIGJbYl9wdHJdKSA8PSAwKSB7XG4gICAgICByZXN1bHRbcl9wdHIrK10gPSBhW2FfcHRyKytdXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtyX3B0cisrXSA9IGJbYl9wdHIrK11cbiAgICB9XG4gIH1cbiAgd2hpbGUoYV9wdHIgPCBhLmxlbmd0aCkge1xuICAgIHJlc3VsdFtyX3B0cisrXSA9IGFbYV9wdHIrK11cbiAgfVxuICB3aGlsZShiX3B0ciA8IGIubGVuZ3RoKSB7XG4gICAgcmVzdWx0W3JfcHRyKytdID0gYltiX3B0cisrXVxuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlMl9kZWYoYSwgYiwgcmVzdWx0KSB7XG4gIHZhciBhX3B0ciA9IDBcbiAgICAsIGJfcHRyID0gMFxuICAgICwgcl9wdHIgPSAwXG4gIHdoaWxlKGFfcHRyIDwgYS5sZW5ndGggJiYgYl9wdHIgPCBiLmxlbmd0aCkge1xuICAgIGlmKGFbYV9wdHJdIDw9IGJbYl9wdHJdKSB7XG4gICAgICByZXN1bHRbcl9wdHIrK10gPSBhW2FfcHRyKytdXG4gICAgfSBlbHNlIHtcbiAgICAgIHJlc3VsdFtyX3B0cisrXSA9IGJbYl9wdHIrK11cbiAgICB9XG4gIH1cbiAgd2hpbGUoYV9wdHIgPCBhLmxlbmd0aCkge1xuICAgIHJlc3VsdFtyX3B0cisrXSA9IGFbYV9wdHIrK11cbiAgfVxuICB3aGlsZShiX3B0ciA8IGIubGVuZ3RoKSB7XG4gICAgcmVzdWx0W3JfcHRyKytdID0gYltiX3B0cisrXVxuICB9XG59XG5cbmZ1bmN0aW9uIG1lcmdlMihhLCBiLCBjb21wYXJlLCByZXN1bHQpIHtcbiAgaWYoIXJlc3VsdCkge1xuICAgIHJlc3VsdCA9IG5ldyBBcnJheShhLmxlbmd0aCArIGIubGVuZ3RoKVxuICB9XG4gIGlmKGNvbXBhcmUpIHtcbiAgICBtZXJnZTJfY21wKGEsIGIsIHJlc3VsdCwgY29tcGFyZSlcbiAgfSBlbHNlIHtcbiAgICBtZXJnZTJfZGVmKGEsIGIsIHJlc3VsdClcbiAgfVxuICByZXR1cm4gcmVzdWx0XG59XG5cbm1vZHVsZS5leHBvcnRzID0gbWVyZ2UyIiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIHR3b1N1bSA9IHJlcXVpcmUoXCJ0d28tc3VtXCIpXG52YXIgYmluYXJ5TWVyZ2UgPSByZXF1aXJlKFwiYmluYXJ5LW1lcmdlXCIpXG5cbm1vZHVsZS5leHBvcnRzID0gbGluZWFyRXhwYW5zaW9uU3VtXG5cbmZ1bmN0aW9uIGNvbXBhcmVNYWduaXR1ZGVzKGEsIGIpIHtcblx0cmV0dXJuIE1hdGguYWJzKGEpIC0gTWF0aC5hYnMoYilcbn1cblxuZnVuY3Rpb24gbGluZWFyRXhwYW5zaW9uU3VtKGUsIGYsIHJlc3VsdCkge1xuXHR2YXIgZyA9IGJpbmFyeU1lcmdlKGUsIGYsIGNvbXBhcmVNYWduaXR1ZGVzLCByZXN1bHQpXG5cdHZhciBuID0gZS5sZW5ndGggKyBmLmxlbmd0aFxuXHR2YXIgY291bnQgPSAwXG5cdHZhciBhID0gZ1sxXVxuXHR2YXIgYiA9IGdbMF1cblx0dmFyIHggPSBhICsgYlxuXHR2YXIgYnYgPSB4IC0gYVxuXHR2YXIgeSA9IGIgLSBidlxuXHR2YXIgcSA9IFt5LCB4XVxuXHRmb3IodmFyIGk9MjsgaTxuOyArK2kpIHtcblx0XHRhID0gZ1tpXVxuXHRcdGIgPSBxWzBdXG5cdFx0eCA9IGEgKyBiXG5cdFx0YnYgPSB4IC0gYVxuXHRcdHkgPSBiIC0gYnZcblx0XHRpZih5KSB7XG5cdFx0XHRnW2NvdW50KytdID0geVxuXHRcdH1cblx0XHR0d29TdW0ocVsxXSwgeCwgcSlcblx0fVxuXHRpZihxWzBdKSB7XG5cdFx0Z1tjb3VudCsrXSA9IHFbMF1cblx0fVxuXHRpZihxWzFdKSB7XG5cdFx0Z1tjb3VudCsrXSA9IHFbMV1cblx0fVxuXHRpZighY291bnQpIHtcblx0XHRnW2NvdW50KytdID0gMC4wXG5cdH1cblx0aWYocmVzdWx0KSB7XG4gICAgaWYoY291bnQgPCBnLmxlbmd0aCkge1xuICAgICAgdmFyIHB0ciA9IGcubGVuZ3RoLTFcbiAgICAgIGNvdW50LS1cbiAgICAgIHdoaWxlKGNvdW50ID49IDApIHtcbiAgICAgICAgZ1twdHItLV0gPSBnW2NvdW50LS1dXG4gICAgICB9XG4gICAgICB3aGlsZShwdHIgPj0gMCkge1xuICAgICAgICBnW3B0ci0tXSA9IDAuMFxuICAgICAgfVxuICAgIH1cblx0fSBlbHNlIHtcblx0XHRnLmxlbmd0aCA9IGNvdW50XG5cdH1cblx0cmV0dXJuIGdcbn0iLCJcInVzZSBzdHJpY3RcIlxuXG5tb2R1bGUuZXhwb3J0cyA9IHR3b1Byb2R1Y3RcblxudmFyIEhBTEZfRE9VQkxFID0gKDE8PDI2KSArIDFcblxuZnVuY3Rpb24gdHdvUHJvZHVjdChhLCBiLCByZXN1bHQpIHtcblx0dmFyIHggPSBhICogYlxuXG5cdHZhciBjID0gSEFMRl9ET1VCTEUgKiBhXG5cdHZhciBhYmlnID0gYyAtIGFcblx0dmFyIGFoaSA9IGMgLSBhYmlnXG5cdHZhciBhbG8gPSBhIC0gYWhpXG5cdFxuXHR2YXIgZCA9IEhBTEZfRE9VQkxFICogYlxuXHR2YXIgYmJpZyA9IGQgLSBiXG5cdHZhciBiaGkgPSBkIC0gYmJpZ1xuXHR2YXIgYmxvID0gYiAtIGJoaVxuXHRcblx0dmFyIGVycjEgPSB4IC0gKGFoaSAqIGJoaSlcblx0dmFyIGVycjIgPSBlcnIxIC0gKGFsbyAqIGJoaSlcblx0dmFyIGVycjMgPSBlcnIyIC0gKGFoaSAqIGJsbylcblx0XG5cdHZhciB5ID0gYWxvICogYmxvIC0gZXJyM1xuXHRcblx0aWYocmVzdWx0KSB7XG5cdFx0cmVzdWx0WzBdID0geVxuXHRcdHJlc3VsdFsxXSA9IHhcblx0XHRyZXR1cm4gcmVzdWx0XG5cdH1cblx0XG5cdHJldHVybiBbIHksIHggXVxufSIsIlwidXNlIHN0cmljdFwiXG5cbm1vZHVsZS5leHBvcnRzID0gZmFzdFR3b1N1bVxuXG5mdW5jdGlvbiBmYXN0VHdvU3VtKGEsIGIsIHJlc3VsdCkge1xuXHR2YXIgeCA9IGEgKyBiXG5cdHZhciBidiA9IHggLSBhXG5cdHZhciBhdiA9IHggLSBidlxuXHR2YXIgYnIgPSBiIC0gYnZcblx0dmFyIGFyID0gYSAtIGF2XG5cdGlmKHJlc3VsdCkge1xuXHRcdHJlc3VsdFswXSA9IGFyICsgYnJcblx0XHRyZXN1bHRbMV0gPSB4XG5cdFx0cmV0dXJuIHJlc3VsdFxuXHR9XG5cdHJldHVybiBbYXIrYnIsIHhdXG59IiwiXCJ1c2Ugc3RyaWN0XCJcblxudmFyIGxyID0gcmVxdWlyZShcImxlZnQtcmlnaHRcIilcblxuLy8gdGhlc2Ugc2hvdWxkIHByb2JhYmx5IHVzZSByb2J1c3Qtc3VtLCBldGNcbmZ1bmN0aW9uIHZlY3RTdW0oYSxiKSB7XG4gICAgcmV0dXJuIGEubWFwKGZ1bmN0aW9uKHZhbCxpKSB7IHJldHVybiBhW2ldK2JbaV0gfSlcbn1cbmZ1bmN0aW9uIHZlY3RTY2FsZShhLGIpIHtcbiAgICByZXR1cm4gYS5tYXAoZnVuY3Rpb24odmFsLGkpIHsgcmV0dXJuIGFbaV0qYiB9KVxufVxuZnVuY3Rpb24gdmVjdERpZmYoYSxiKSB7XG4gICAgcmV0dXJuIHZlY3RTdW0oYSx2ZWN0U2NhbGUoYiwtMSkpXG59XG5mdW5jdGlvbiBkb3QoYSxiKSB7XG4gICAgcmV0dXJuIGFbMF0qYlswXSArIGFbMV0qYlsxXVxufVxuXG4vLyBjYWxjdWxhdGVzIHRoZSBjbG9zZXN0IGRpc3RhbmNlIGZyb20gYSBwb2ludCB0byBhIGxpbmUgZm9ybWVkIGJ5IHR3byBwb2ludHNcbi8vIHx8IChhLXApIC0gKChhLXApIFxcZG90IG4pIG4gfHxcbmZ1bmN0aW9uIGRpc3RMaW5lVG9Qb2ludChhLCBiLCBwKSB7XG4gICAgdmFyIG4gPSB2ZWN0RGlmZihiLCBhKVxuICAgIG4gPSB2ZWN0U2NhbGUobiwgMS9NYXRoLnNxcnQoblswXSpuWzBdK25bMV0qblsxXSkpXG4gICAgXG4gICAgdmFyIGFtcCA9IHZlY3REaWZmKGEsIHApXG4gICAgdmFyIGQgPSB2ZWN0RGlmZihhbXAsIHZlY3RTY2FsZShuLChkb3QoYW1wLCBuKSkpKVxuICAgIC8vcmV0dXJuIHsgZDpkLCBhOmFtcCwgbm46biwgbjpkb3QoYW1wLG4pfVxuICAgIHJldHVybiBNYXRoLnNxcnQoZFswXSpkWzBdK2RbMV0qZFsxXSlcbn1cblxuZnVuY3Rpb24gaXNTdHJpY3RseVJpZ2h0KHApIHtcbiAgICAgICAgcmV0dXJuIGxyKHRoaXMuYSwgdGhpcy5iLCBwKSA9PSAtMSA/IDEgOiAwXG59XG5cbi8vIHNvcnQgdGhlIGdpdmVuIHBvaW50cyBpbiBDQ1cgb3JkZXJcbi8vIEZJWE1FOiBcbmZ1bmN0aW9uIHNvcnRIdWxsKFNvcmlnKSB7XG4gICAgdmFyIFMgPSBTb3JpZy5zbGljZSgpXG4gICAgdmFyIFNzb3J0ZWQgPSBbXVxuICAgIHZhciBsYXN0ID0gUy5zaGlmdCgpXG4gICAgU3NvcnRlZC5wdXNoKGxhc3QpXG5cbiAgICB3aGlsZSAoUy5sZW5ndGggPiAwKSB7XG4gICAgICAgIHZhciBjdXJyID0gUy5zaGlmdCgpXG4gICAgICAgIHZhciBBID0gUy5maWx0ZXIoaXNTdHJpY3RseVJpZ2h0LCB7YTpsYXN0LCBiOmN1cnJ9KVxuICAgICAgICBpZiAoQS5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgU3NvcnRlZC5wdXNoKGN1cnIpXG4gICAgICAgICAgICBsYXN0ID0gY3VyclxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgUy5wdXNoKGN1cnIpXG4gICAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gU3NvcnRlZFxufVxuXG4vLyBRdWlja0h1bGxcbi8vIE8nUm91cmtlIC0gQ29tcHV0YXRpb25hbCBHZW9tZXRyeSBpbiBDLCBwLiA3MFxuZnVuY3Rpb24gcXVpY2tIdWxsSW5uZXIoUywgYSwgYikge1xuICAgIGlmIChTLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgIHJldHVybiBbXVxuICAgIH1cblxuICAgIHZhciBkID0gUy5tYXAoZnVuY3Rpb24ocCkge3JldHVybiB7ZGlzdDogbHIoYSxiLHApKmRpc3RMaW5lVG9Qb2ludChhLCBiLCBwKSwgcG9pbnQ6IHB9fSlcbiAgICBkLnNvcnQoZnVuY3Rpb24oYSxiKSB7IHJldHVybiBhLmRpc3QgPiBiLmRpc3QgPyAxIDogLTEgfSlcbiAgICB2YXIgZGQgPSBkLm1hcChmdW5jdGlvbihwcCkgeyByZXR1cm4gcHAucG9pbnQgfSlcblxuICAgIHZhciBjID0gZC5wb3AoKVxuICAgIGlmIChjLmRpc3QgPD0gMCkge1xuICAgICAgICByZXR1cm4gW11cbiAgICB9XG4gICAgYyA9IGMucG9pbnRcblxuICAgIC8vIHNlZW1zIGxpa2UgdGhlc2Ugc2hvdWxkIGJlIHJldmVyc2VkLCBidXQgdGhpcyB3b3Jrc1xuICAgIHZhciBBID0gZGQuZmlsdGVyKGlzU3RyaWN0bHlSaWdodCwge2E6YywgYjphfSlcbiAgICB2YXIgQiA9IGRkLmZpbHRlcihpc1N0cmljdGx5UmlnaHQsIHthOmIsIGI6Y30pXG5cbiAgICAvLyBGSVhNRSBuZWVkIGJldHRlciB3YXkgaW4gY2FzZSBxSEkgcmV0dXJucyBbXVxuICAgIHZhciByZXNzID0gcXVpY2tIdWxsSW5uZXIoQSwgYSwgYykuY29uY2F0KFtjXSwgcXVpY2tIdWxsSW5uZXIoQiwgYywgYikpXG4gICAgcmV0dXJuIHJlc3NcblxufVxuXG5mdW5jdGlvbiBxdWlja0h1bGwoUykge1xuICAgIGlmIChTLmxlbmd0aCA8IDMpIHtcbiAgICAgICAgcmV0dXJuIFNcbiAgICB9IGVsc2Uge1xuICAgICAgICB2YXIgZCA9IFMuc2xpY2UoKVxuICAgICAgICAvLyBzb3J0IGJ5IHhcbiAgICAgICAgZC5zb3J0KGZ1bmN0aW9uKGEsYikge3JldHVybiBhWzBdID4gYlswXSA/IDEgOiAtMX0pXG5cbiAgICAgICAgdmFyIGEgPSBkLnNoaWZ0KClcbiAgICAgICAgdmFyIGIgPSBkLnBvcCgpXG5cbiAgICAgICAgdmFyIFMxID0gUy5maWx0ZXIoaXNTdHJpY3RseVJpZ2h0LCB7YTpiLCBiOmF9KVxuICAgICAgICB2YXIgUzIgPSBTLmZpbHRlcihpc1N0cmljdGx5UmlnaHQsIHthOmEsIGI6Yn0pXG5cbiAgICAgICAgdmFyIHggPSBxdWlja0h1bGxJbm5lcihTMSxhLGIpXG4gICAgICAgIHZhciB5ID0gcXVpY2tIdWxsSW5uZXIoUzIsYixhKVxuICAgICAgICB2YXIgcmVzID0gW2FdLmNvbmNhdCh4LCBbYl0sIHkpXG5cbiAgICAgICAgcmV0dXJuIHNvcnRIdWxsKHJlcylcbiAgICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gcXVpY2tIdWxsXG4iLCJ2YXIgcXVpY2todWxsID0gcmVxdWlyZShcIi4uL3F1aWNraHVsbC5qc1wiKVxuXG52YXIgc2NhbGUgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoXCIjc2NhbGVcIikudmFsdWVcbnZhciByZXNldEJ1dHRvbiA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihcIiNyZXNldFwiKTtcbnZhciBjYW52YXMgPSBkb2N1bWVudC5ib2R5LnF1ZXJ5U2VsZWN0b3IoXCIjY2FudmFzXCIpO1xudmFyIGNvbnRleHQgPSBjYW52YXMuZ2V0Q29udGV4dChcIjJkXCIpO1xudmFyIHBvaW50cyA9IG5ldyBBcnJheSgpO1xudmFyIGJvdW5kYXJ5UG9pbnRzID0gbmV3IEFycmF5KCk7XG5cbmZ1bmN0aW9uIGluaXRpYWxpemUoKSB7ICAgXG4gICAgcmVzZXRCdXR0b24uYWRkRXZlbnRMaXN0ZW5lcihcImNsaWNrXCIscmVzZXQpO1xuICAgIGNhbnZhcy5hZGRFdmVudExpc3RlbmVyKFwibW91c2Vkb3duXCIsYWRkUG9pbnQsZmFsc2UpO1xuICAgIHJlc2V0KClcbn1cblxuZnVuY3Rpb24gZHJhd0FsbCgpIHtcbiAgICBzY2FsZSA9IGRvY3VtZW50LmJvZHkucXVlcnlTZWxlY3RvcihcIiNzY2FsZVwiKS52YWx1ZVxuICAgIGNhbnZhcy53aWR0aCA9IHNjYWxlKjI7XG4gICAgY2FudmFzLmhlaWdodCA9IHNjYWxlKjI7XG4gICAgXG4gICAgY29udGV4dC5maWxsU3R5bGUgPSBcInJnYigyNTUsIDI1NSwgMjU1KVwiXG4gICAgY29udGV4dC5maWxsUmVjdCgwLCAwLCA0MDAqc2NhbGUvMjAwLCA0MDAqc2NhbGUvMjAwKVxuICAgIFxuXHRkcmF3Qm91bmRhcnkoKVxuICAgIGRyYXdQb2ludHMoKVxuICAgIGNvbnNvbGUubG9nKFwicG9pbnRzXCIpXG4gICAgY29uc29sZS5sb2cocG9pbnRzKVxuICAgIGJvdW5kYXJ5UG9pbnRzID0gcXVpY2todWxsKHBvaW50cylcbiAgICBjb25zb2xlLmxvZyhcImJvdW5kc1wiKVxuICAgIGNvbnNvbGUubG9nKGJvdW5kYXJ5UG9pbnRzKVxuXHRkcmF3Q29udmV4SHVsbCgpXG59XG5cbmZ1bmN0aW9uIGNvbnZlcnRDYXJ0ZXNpYW5Ub1BpeGVscyhwb2ludCkge1xuICAgIHZhciBuZXdQb2ludCA9IFswLCAwXVxuICAgIG5ld1BvaW50WzBdID0gc2NhbGUqKHBvaW50WzBdKzEpXG4gICAgbmV3UG9pbnRbMV0gPSBzY2FsZSooMS1wb2ludFsxXSlcbiAgICBcbiAgICByZXR1cm4gbmV3UG9pbnRcbn1cblxuZnVuY3Rpb24gY29udmVydFBpeGVsc1RvQ2FydGVzaWFuKHBvaW50KSB7XG4gICAgdmFyIG5ld1BvaW50ID0gWzAsIDBdXG4gICAgbmV3UG9pbnRbMF0gPSBwb2ludFswXS9zY2FsZS0xXG4gICAgbmV3UG9pbnRbMV0gPSAxLXBvaW50WzFdL3NjYWxlXG4gICAgXG4gICAgcmV0dXJuIG5ld1BvaW50XG59XG5cbmZ1bmN0aW9uIGRyYXdQb2ludChwb3NpdGlvbikge1xuICAgIHZhciBwb3MgPSBjb252ZXJ0Q2FydGVzaWFuVG9QaXhlbHMocG9zaXRpb24pXG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9IFwicmdiKDAsIDAsIDI1NSlcIlxuICAgIGNvbnRleHQuYmVnaW5QYXRoKCk7XG4gICAgY29udGV4dC5hcmMocG9zWzBdLHBvc1sxXSw0LDAsMipNYXRoLlBJLCB0cnVlKVxuICAgIGNvbnRleHQuY2xvc2VQYXRoKClcbiAgICBjb250ZXh0LnN0cm9rZSgpO1xufVxuXG5mdW5jdGlvbiBkcmF3TGluZShzdGFydENhcnQsIGVuZENhcnQpIHtcbiAgICBjb250ZXh0LmJlZ2luUGF0aCgpXG4gICAgY29udGV4dC5zdHJva2VTdHlsZSA9IFwicmdiKDI1NSwgMCwgMClcIlxuICAgIHZhciBzdGFydCA9IGNvbnZlcnRDYXJ0ZXNpYW5Ub1BpeGVscyhzdGFydENhcnQpXG4gICAgdmFyIGVuZCA9IGNvbnZlcnRDYXJ0ZXNpYW5Ub1BpeGVscyhlbmRDYXJ0KVxuICAgIGNvbnRleHQubW92ZVRvKHN0YXJ0WzBdLHN0YXJ0WzFdKVxuICAgIGNvbnRleHQubGluZVRvKGVuZFswXSxlbmRbMV0pXG4gICAgY29udGV4dC5jbG9zZVBhdGgoKVxuICAgIGNvbnRleHQuc3Ryb2tlKCk7XG59XG5cbmZ1bmN0aW9uIGRyYXdDb252ZXhIdWxsKCkge1xuXHRpZihib3VuZGFyeVBvaW50cy5sZW5ndGg+Mikge1xuXHRcdGZvciAodmFyIGk9MDtpPGJvdW5kYXJ5UG9pbnRzLmxlbmd0aC0xO2krKykge1xuXHRcdFx0ZHJhd0xpbmUoYm91bmRhcnlQb2ludHNbaV0sYm91bmRhcnlQb2ludHNbaSsxXSlcblx0XHR9XG5cdFx0ZHJhd0xpbmUoYm91bmRhcnlQb2ludHNbYm91bmRhcnlQb2ludHMubGVuZ3RoLTFdLGJvdW5kYXJ5UG9pbnRzWzBdKVxuXHR9XG59XG5cbmZ1bmN0aW9uIGRyYXdQb2ludHMoKSB7XG4gICAgZm9yICh2YXIgaT0wO2k8cG9pbnRzLmxlbmd0aDtpKyspIHtcbiAgICAgICAgZHJhd1BvaW50KHBvaW50c1tpXSlcbiAgICB9XG59XG5cbmZ1bmN0aW9uIGRyYXdCb3VuZGFyeSgpIHtcblx0ZHJhd0xpbmUoWy0xLC0xXSxbLTEsMV0pXG5cdGRyYXdMaW5lKFstMSwxXSxbMSwxXSlcblx0ZHJhd0xpbmUoWzEsMV0sWzEsLTFdKVxuXHRkcmF3TGluZShbMSwtMV0sWy0xLC0xXSlcbn1cblxuZnVuY3Rpb24gcmVzZXQoKSB7XG5cdHBvaW50cyA9IG5ldyBBcnJheSgpO1xuXHRib3VuZGFyeVBvaW50cyA9IG5ldyBBcnJheSgpO1xuICAgIGRyYXdBbGwoKVxufVxuXG5mdW5jdGlvbiBhZGRQb2ludChldmVudCkge1xuICAgIC8vY29uc29sZS5sb2coXCJQb2ludCBhZGRlZCBhdCBweChcIitldmVudC5wYWdlWCtcIiwgXCIrZXZlbnQucGFnZVkrXCIpXCIpXG4gICAgdmFyIHBvaW50ID0gWzAsMF07XG4gICAgcG9pbnQgPSBjb252ZXJ0UGl4ZWxzVG9DYXJ0ZXNpYW4oW2V2ZW50LnBhZ2VYLWNhbnZhcy5vZmZzZXRMZWZ0LCBldmVudC5wYWdlWS1jYW52YXMub2Zmc2V0VG9wXSlcbiAgICAvL3Bvc2l0aW9uLnB1c2gocG9pbnQpXG4gICAgLy9jb25zb2xlLmxvZyhwb3NpdGlvbilcbiAgICAvL2luaXRpYWxQb3NpdGlvbi5wdXNoKHBvaW50KVxuICAgIGNvbnNvbGUubG9nKFwiUG9pbnQgYWRkZWQgYXQgKFwiK3BvaW50WzBdK1wiLCBcIitwb2ludFsxXStcIilcIilcbiAgICBjb25zb2xlLmxvZyhcIiBcIik7XG5cdHBvaW50cy5wdXNoKHBvaW50KTtcbiAgICBkcmF3QWxsKClcbn1cblxuaW5pdGlhbGl6ZSgpXG5cblxuIl19
;