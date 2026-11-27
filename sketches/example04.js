function example04() {
var unit = {};

function Shorthand(moo, url) {
    var self = { _type: 'Shorthand' };
    function calculateFoo() {
        self.foo = self.bar.origin + self.moo;
    }
    async function fetchBar() {
        var response;
        response = await fetch(self.url);
        self.bar = await response.json();
    }
    return self;
}
function Simple() {
    var self = { _type: 'Simple' };
    function calculateFoo() {
        self.foo = self.bar.origin + self.moo;
    }
    async function fetchBar() {
        var response;
        response = await fetch(self.url);
        self.bar = await response.json();
    }
    function runMe(moo, url) {
    }
    self.runMe = runMe;
    return self;
}
unit.Shorthand = Shorthand;
unit.Simple = Simple;
return unit;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        example04
    };
}
