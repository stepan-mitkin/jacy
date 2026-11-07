function example04() {
var unit = {};

var x1;
var y1;
var x2;
var y2;
var distance;
function calculateDistance(point1, point2) {
    x1 = point1.x;
    y1 = point1.y;
    x2 = point2.x;
    y2 = point2.y;
}
function chooseLineType() {
    var dx, dy;
    if (y1 === y2) {
        distance = Math.abs(x1 - x2);
    } else {
        if (x1 === x2) {
            distance = Math.abs(y1 - y2);
        } else {
            dx = x2 - x1;
            dy = y2 - y1;
            distance = Math.sqrt(dx * dx + dy * dy);
        }
    }
}
function printResult() {
    if (distance > 100) {
        console.log('The distance is long');
    } else {
        console.log('The distance is short');
    }
}
unit.calculateDistance = calculateDistance;
return unit;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        example04
    };
}
