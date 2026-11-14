function jacyvis() {
var unit = {};

function Class() {
    var self = { _type: 'Class' };
    var diagram, nextId, y;
    y = 0;
    nextId = 1;
    diagram = undefined;
    function buildClassDiagram(model) {
        var method, methodBuilder;
        y = 0;
        nextId = 1;
        diagram = {
            name: model.name,
            type: 'free',
            items: {}
        };
        addHeader(model.name);
        for (method of model.methods) {
            methodBuilder = Method(model, method);
            methodBuilder.buildMethod();
            addSubdiagram(methodBuilder.items, methodBuilder.height);
        }
        return diagram;
    }
    self.buildClassDiagram = buildClassDiagram;
    return self;
}
function Method(model, method) {
    var self = { _type: 'Method' };
    function buildMethod() {
    }
    self.buildMethod = buildMethod;
    return self;
}
unit.Class = Class;
unit.Method = Method;
return unit;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        jacyvis
    };
}
