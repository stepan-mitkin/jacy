function example05as() {
var unit = {};

function Distance() {
    var self = { _type: 'Distance' };
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
            reportShortcut(true);
            distance = Math.abs(x1 - x2);
        } else {
            if (x1 === x2) {
                reportShortcut(false);
                distance = Math.abs(y1 - y2);
            } else {
                dx = x2 - x1;
                dy = y2 - y1;
                distance = Math.sqrt(dx * dx + dy * dy);
            }
        }
    }
    function pause(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    async function printResult() {
        await pause(1000);
        if (distance > 100) {
            console.log('The distance is long', x1, x2);
        } else {
            console.log('The distance is short', y1, y2);
        }
    }
    function reportShortcut(horizontal) {
        if (horizontal) {
            console.log('Horizontal shortcut');
        } else {
            console.log('Vertical shortcut');
        }
    }
    self.calculateDistance = calculateDistance;
    return self;
}
unit.Distance = Distance;
return unit;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        example05as
    };
}
