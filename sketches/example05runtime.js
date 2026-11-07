function TriggerRuntime05() {
    var unit = {}
    function runTriggers(plan, triggers) {
        var methods = Object.keys(plan)
        while (methods.length > 0) {
            plan = {}
            for (var methodName of methods) {
                var method = triggers[methodName]
                method(plan)
            }
            methods = Object.keys(plan)
        }
    }

    unit.runTriggers = runTriggers
    return unit
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        TriggerRuntime05
    };
}
