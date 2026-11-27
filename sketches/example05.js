function example05() {
var unit = {};

function Distance() {
    var self = { _type: 'Distance' };
    function calculateDistance(x1, y1, x2, y2) {
    }
    function chooseLineType() {
        var dx, dy;
        if (self.y1 === self.y2) {
            reportShortcut(true);
            self.distance = Math.abs(self.x1 - self.x2);
        } else {
            if (self.x1 === self.x2) {
                reportShortcut(false);
                self.distance = Math.abs(self.y1 - self.y2);
            } else {
                dx = self.x2 - self.x1;
                dy = self.y2 - self.y1;
                self.distance = Math.sqrt(dx * dx + dy * dy);
            }
        }
    }
    function printResult() {
        if (self.distance > 100) {
            console.log('The distance is long', self.x1, self.y1, self.x2, self.y2, self.distance);
        } else {
            console.log('The distance is short', self.x1, self.y1, self.x2, self.y2, self.distance);
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
        example05
    };
}
