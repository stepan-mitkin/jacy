function example05(runtime) {
    var unit = {};
    function Distance() {
        var _triggers_ = {
            chooseLineType: {
                fun: chooseLineType,
                rank: 2
            },
            printResult: {
                fun: printResult,
                rank: 3
            }
        };
        var self = { _type: 'Distance' };
        var x1;
        var y1;
        var x2;
        var y2;
        var distance;
        function calculateDistance(point1, point2) {
            var _plan_ = {};
            _plan_['chooseLineType'] = true;
            _plan_['printResult'] = true;
            x1 = point1.x;
            y1 = point1.y;
            x2 = point2.x;
            y2 = point2.y;
            runtime.runTriggers(_plan_, _triggers_);
        }
        function chooseLineType(_plan_) {
            var dx, dy;
            if (y1 === y2) {
                reportShortcut(true);
                _plan_['printResult'] = true;
                distance = Math.abs(x1 - x2);
            } else {
                if (x1 === x2) {
                    reportShortcut(false);
                    _plan_['printResult'] = true;
                    distance = Math.abs(y1 - y2);
                } else {
                    dx = x2 - x1;
                    dy = y2 - y1;
                    _plan_['printResult'] = true;
                    distance = Math.sqrt(dx * dx + dy * dy);
                }
            }
        }
        function printResult() {
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
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { example05 };
}