function example05(runtime) {
var unit = {};

function Distance() {
    var self = { _type: 'Distance' };
    var x1;
    var y1;
    var x2;
    var y2;
    var distance;


    var _triggers_ = {
        chooseLineType: chooseLineType,
        printResult: printResult
    }
    function calculateDistance(point1, point2) {
        var _plan_ = {}
        x1 = point1.x;
        _plan_["chooseLineType"] = true
        y1 = point1.y;
        _plan_["chooseLineType"] = true
        x2 = point2.x;
        _plan_["chooseLineType"] = true
        y2 = point2.y;
        _plan_["chooseLineType"] = true
        runtime.runTriggers(_plan_, _triggers_)
    }
    
    function chooseLineType(_plan_) {
        var dx, dy;
        if (y1 === y2) {
            distance = Math.abs(x1 - x2);
            _plan_["printResult"] = true
        } else {
            if (x1 === x2) {
                distance = Math.abs(y1 - y2);
                _plan_["printResult"] = true
            } else {
                dx = x2 - x1;
                dy = y2 - y1;
                distance = Math.sqrt(dx * dx + dy * dy);
                _plan_["printResult"] = true
            }
        }
    }
    function printResult(_plan_) {
        if (distance > 100) {
            console.log('The distance is long');
        } else {
            console.log('The distance is short');
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
