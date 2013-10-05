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
function sortHull(S) {
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

    var c = d.pop()
    if (c.dist <= 0) {
        return []
    } else {
        c = c.point
    }

    var A = S.filter(isStrictlyRight, {a:a, b:c})
    var B = S.filter(isStrictlyRight, {a:c, b:b})

    // FIXME need better way in case qHI returns []
    return quickHullInner(A, a, c).concat([c], quickHullInner(B, c, b))

}

function quickHull(S) {

    var d = S.slice()
    // sort by x, then y if x is equal
    d.sort(function(a,b) {return a[0] > b[0] ? 1 : a[0] == b[0] ? a[1]>b[1] : -1})

    var a = d.shift()
    var b = d.pop()

    var S1 = S.filter(isStrictlyRight, {a:b, b:a})
    var S2 = S.filter(isStrictlyRight, {a:a, b:b})

    // filter(Boolean) removes empty or undefined values
    var res = [a].concat(quickHullInner(S1,a,b), [b], quickHullInner(S2,b,a)).filter(Boolean)
    return sortHull(res)
}

module.exports = quickHull
