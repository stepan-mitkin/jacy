function example04(runtime) {
    var unit = {};
    async function Shorthand(moo, url) {
        var _triggers_ = {
            calculateFoo: {
                fun: calculateFoo,
                rank: 3
            },
            fetchBar: {
                fun: fetchBar,
                rank: 2
            }
        };
        var self = { _type: 'Shorthand' };
        self.bar = undefined;
        self.foo = undefined;
        function calculateFoo(_plan_) {
            if (self.bar === undefined || self.moo === undefined) {
                return true;
            }
            self.foo = self.bar.origin + self.moo;
        }
        async function fetchBar(_plan_) {
            if (self.url === undefined) {
                return true;
            }
            var response;
            response = await fetch(self.url);
            _plan_['calculateFoo'] = true;
            self.bar = await response.json();
        }
        async function ctr() {
            self.foo = undefined;
            self.bar = undefined;
            var _plan_ = {};
            _plan_['calculateFoo'] = true;
            self.moo = moo;
            _plan_['fetchBar'] = true;
            self.url = url;
            await runtime.runTriggersAsync(_plan_, _triggers_);
        }
        await ctr();
        return self;
    }
    function Simple() {
        var _triggers_ = {
            calculateFoo: {
                fun: calculateFoo,
                rank: 3
            },
            fetchBar: {
                fun: fetchBar,
                rank: 2
            }
        };
        var self = { _type: 'Simple' };
        self.bar = undefined;
        self.foo = undefined;
        function calculateFoo(_plan_) {
            if (self.bar === undefined || self.moo === undefined) {
                return true;
            }
            self.foo = self.bar.origin + self.moo;
        }
        async function fetchBar(_plan_) {
            if (self.url === undefined) {
                return true;
            }
            var response;
            response = await fetch(self.url);
            _plan_['calculateFoo'] = true;
            self.bar = await response.json();
        }
        async function runMe(moo, url) {
            self.foo = undefined;
            self.bar = undefined;
            var _plan_ = {};
            _plan_['fetchBar'] = true;
            self.url = url;
            _plan_['calculateFoo'] = true;
            self.moo = moo;
            await runtime.runTriggersAsync(_plan_, _triggers_);
        }
        self.runMe = runMe;
        return self;
    }
    unit.Shorthand = Shorthand;
    unit.Simple = Simple;
    return unit;
}
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { example04 };
}