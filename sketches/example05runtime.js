function TriggerRuntime05() {
    var unit = {}
    function runTriggers(plan, triggers) {
        var methods = getSortedTriggers(plan, triggers)
        var ran = {}
        while (methods.length > 0) {
            plan = {}
            for (var methodName of methods) {
                if (!(methodName in ran)) {
                    var method = triggers[methodName].fun
                    var tooEarly = method(plan)
                    if (!tooEarly) {
                        ran[methodName] = false
                    }
                }
            }
            methods = getSortedTriggers(plan, triggers)
        }
    }

    function getSortedTriggers(plan, triggers) {
        var methods = Object.keys(plan)
        methods.sort((a, b) => triggers[a].rank - triggers[b].rank)
        return methods
    }

    async function runTriggersAsync(plan, triggers) {
        var methods = getSortedTriggers(plan, triggers)
        var ran = {}
        while (methods.length > 0) {
            plan = {}
            for (var methodName of methods) {
                if (!(methodName in ran)) {
                    var method = triggers[methodName].fun
                    var tooEarly = await method(plan)
                    if (!tooEarly) {
                        ran[methodName] = false
                    }
                }
            }
            methods = getSortedTriggers(plan, triggers)
        }
    } 

    unit.runTriggers = runTriggers
    unit.runTriggersAsync = runTriggersAsync
    return unit
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        TriggerRuntime05
    };
}
