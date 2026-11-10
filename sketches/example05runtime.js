function TriggerRuntime05() {
    var unit = {}
    function runTriggers(plan, triggers) {
        var methods = getSortedTriggers(plan, triggers)
        var ran = {}
        while (methods.length > 0) {
            plan = {}
            for (var methodName of methods) {
                if (!(methodName in ran)) {
                    ran[methodName] = true
                    var method = triggers[methodName].fun
                    method(plan)
                }
            }
            methods = methods = getSortedTriggers(plan, triggers)
        }
    }

    function getSortedTriggers(plan, triggers) {
        var methods = Object.keys(plan)
        methods.sort((a, b) => triggers[a].rank - triggers[b].rank)
        return methods
    }

    async function runTriggersAsync(plan, triggers) {
        var methods = getSortedTriggers(plan, triggers)
        while (methods.length > 0) {
            plan = {}
            for (var methodName of methods) {
                var method = triggers[methodName]
                var result = method(plan)
                if (result && typeof result.then === "function") {
                    await result
                }
            }
            methods = methods = getSortedTriggers(plan, triggers)
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
