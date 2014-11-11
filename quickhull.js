"use strict"

var lr = require("robust-orientation")

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
        return lr(this.a, this.b, p) < 0 ? 1 : 0
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
        var A = S.filter(isStrictlyRight, {a:curr, b:last})
        if (A.length == 0) {
            Ssorted.push(curr)
            last = curr
        } else {
            S.push(curr)
        }
    }

    return Ssorted
}

// remove colinear points
// assume that the input points are already sorted
// FIXME we could take this further and enforce points to be positively oriented
function removeColinearPoints(S) {
    var Sclean = []
    var l = S.length

    for (var i=0; i < S.length; i++) {
        if ( lr(S[(i+l-1)%l], S[i], S[(i+1)%l]) != 0 ) {
            Sclean.push(S[i]);
        }
    }

    return Sclean
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

        return removeColinearPoints(sortHull(res))
    }
}

module.exports = quickHull
