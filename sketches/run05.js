const { example05 } = require("./example05processed")
const { TriggerRuntime05 } = require("./example05runtime")


var runtime = TriggerRuntime05()
var program = example05(runtime)
var obj = program.Distance()
obj.calculateDistance(
    {x: 10, y: 20},
    {x: 20, y: 50}
)