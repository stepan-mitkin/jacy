const { example05 } = require("./example05processed")
const { example05as } = require("./example05asprocessed")
const { TriggerRuntime05 } = require("./example05runtime")


var runtime = TriggerRuntime05()
var program = example05(runtime)
var obj = program.Distance()
obj.calculateDistance(10,20,20,50)

var program2 = example05as(runtime)
var obj2 = program2.Distance()
obj2.calculateDistance(10, 20, 10, 50).then(() => {
    console.log('done')
})