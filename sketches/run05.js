const { example05fun } = require("./example05funprocessed")
const { example05 } = require("./example05processed")
const { example05as } = require("./example05asprocessed")
const { TriggerRuntime05 } = require("./example05runtime")


var runtime = TriggerRuntime05()

var programFun = example05fun(runtime)
var program = example05(runtime)
var programAsync = example05as(runtime)


var obj = program.Distance()
obj.calculateDistance(10,20,20,50)
console.log(obj.x1, obj.x2, obj.y1, obj.y2, obj.distance)


var obj2 = programAsync.Distance()
obj2.calculateDistance(10, 20, 10, 50).then(() => {
    console.log(obj2.x1, obj2.x2, obj2.y1, obj2.y2, obj2.distance)
    console.log('done')
})

// Shortcut calculation
var obj3 = programFun.Distance(10, 20, 20, 50)
console.log(obj3.x1, obj3.x2, obj3.y1, obj3.y2, obj3.distance)

// Normal calculation. Note that obj3 is re-used.
obj3.calculateDistance(10,20,200,500)
console.log(obj3.x1, obj3.x2, obj3.y1, obj3.y2, obj3.distance)



