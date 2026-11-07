function example01() {
var unit = {};

function calculateDistance(point1, point2) {
    push({
        x1: point1.x,
        y1: point1.y,
        x2: point2.x,
        y2: point2.y
    });
    return distance;
}
function horizontalLine() {
    if (y1 === y2) {
        push({ distance: Math.abs(x1 - x2) });
    }
}
function slantingLine() {
    var dist, dx, dy;
    if (!(y1 === y2 || x1 === x2)) {
        dx = x2 - x1;
        dy = y2 - y1;
        dist = Math.sqrt(dx * dx + dy * dy);
        push({ distance: dist });
    }
}
function verticalLine() {
    if (x1 === x2) {
        push({ distance: Math.abs(y1 - y2) });
    }
}
unit.calculateDistance = calculateDistance;
return unit;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        example01
    };
}
