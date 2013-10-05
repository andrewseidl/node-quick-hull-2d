node-quick-hull-2d
==================

Computes the convex hull of a given set of points using the Quick Hull algorithm.

## Example

```javascript
var qh = require("quick-hull-2d")

var points = [ [-1,0], [1,0], [0,1], [0,0.5] ]

var hull = qh(points)
```

## Install

    npm install quick-hull-2d

## API

### `require("quick-hull-2d")(points)`
* `points` is a 2D array of points
**Returns** Points in the convex hull, ordered counter-clockwise.

## Credits
(c) 2013 Andrew Seidl. MIT License
