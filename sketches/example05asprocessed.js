function example05as(runtime) {
    var unit = {};
    function Distance() {
        var _triggers_ = {
            chooseLineType: {
                fun: chooseLineType,
                rank: 4
            },
            printResult: {
                fun: printResult,
                rank: 5
            }
        };
        var self = { _type: 'Distance' };
        async function calculateDistance(x1, y1, x2, y2) {
            var _plan_ = {};
            _plan_['chooseLineType'] = true;
            _plan_['printResult'] = true;
            self.y2 = y2;
            self.x2 = x2;
            self.y1 = y1;
            self.x1 = x1;
            await runtime.runTriggersAsync(_plan_, _triggers_);
        }
        function chooseLineType(_plan_) {
            if (self.x1 === undefined || self.x2 === undefined || self.y1 === undefined || self.y2 === undefined) {
                return true;
            }
            var dx, dy;
            if (self.y1 === self.y2) {
                reportShortcut(true);
                _plan_['printResult'] = true;
                self.distance = Math.abs(self.x1 - self.x2);
            } else {
                if (self.x1 === self.x2) {
                    reportShortcut(false);
                    _plan_['printResult'] = true;
                    self.distance = Math.abs(self.y1 - self.y2);
                } else {
                    dx = self.x2 - self.x1;
                    dy = self.y2 - self.y1;
                    _plan_['printResult'] = true;
                    self.distance = Math.sqrt(dx * dx + dy * dy);
                }
            }
        }
        function pause(ms) {
            return new Promise(resolve => setTimeout(resolve, ms));
        }
        async function printResult() {
            if (self.distance === undefined || self.x1 === undefined || self.x2 === undefined || self.y1 === undefined || self.y2 === undefined) {
                return true;
            }
            await pause(1000);
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
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { example05as };
}