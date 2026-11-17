const { example05funas } = require("./example05funasprocessed")
const { example05fun } = require("./example05funprocessed")
const { example05 } = require("./example05processed")
const { example04 } = require("./example04processed")
const { example05as } = require("./example05asprocessed")
const { TriggerRuntime05 } = require("./example05runtime")


var runtime = TriggerRuntime05()

var programFunAs = example05funas(runtime)
var programFun = example05fun(runtime)
var program = example05(runtime)
var programAsync = example05as(runtime)
var program04 = example04(runtime)


async function main() {    
    var simpleObj = program04.Simple()
    await simpleObj.runMe(" This is my IP. I got it by calling a method on an object", "https://httpbin.org/get")
    console.log('runMe done: ', simpleObj.foo)

    var shorthandObj = await program04.Shorthand(" This is my IP. I got it by calling a shorthand function", "https://httpbin.org/get")    
    console.log('Shorthand done: ', shorthandObj.foo)    

    var obj = program.Distance()
    obj.calculateDistance(10, 20, 20, 50)
    console.log(obj.x1, obj.x2, obj.y1, obj.y2, obj.distance)


    var obj2 = programAsync.Distance()
    await obj2.calculateDistance(10, 20, 10, 50)
    console.log(obj2.x1, obj2.x2, obj2.y1, obj2.y2, obj2.distance)
    console.log('async call done')


    // Shortcut calculation
    var obj3 = programFun.Distance(10, 20, 20, 50)
    console.log(obj3.x1, obj3.x2, obj3.y1, obj3.y2, obj3.distance)

    // Normal calculation. Note that obj3 is re-used.
    obj3.calculateDistance(10, 20, 200, 500)
    console.log(obj3.x1, obj3.x2, obj3.y1, obj3.y2, obj3.distance)

    var obj4 = await programFunAs.Distance(10, 20, 20, 50)
    console.log(obj4.x1, obj4.x2, obj4.y1, obj4.y2, obj4.distance)

}
main().then(() => console.log("All done!"))