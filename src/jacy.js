function jacy() {
var unit = {};

function addToPlan(context, variable, output) {
    var ass, left, procName, reads, right;
    reads = context.varReads[variable];
    if (reads) {
        for (procName of reads) {
            if (!(procName in context.plan)) {
                context.plan[procName] = true;
                left = createIndexed(createIdentifier('_plan_'), createString(procName));
                right = createBool(true);
                ass = createAssignment(left, right);
                output.push(ass);
            }
        }
    }
}
function addToProcGraph(context, procedure) {
    var _selectValue_2, existing, procName, variable;
    procName = context.name + '.' + procedure.name;
    if (procedure.readWrites.length > 0) {
        throw new Error('Simultaneous reading and writing to a shared variable is not allowed: ' + procName);
    }
    _selectValue_2 = procedure.type;
    if (_selectValue_2 === 'method') {
        if (procedure.reads.length > 0) {
            throw new Error('A method cannot read from shared variables: ' + procName);
        }
    } else {
        if (!(_selectValue_2 === 'trigger')) {
            if (!(_selectValue_2 === 'private')) {
                throw new Error('Unexpected case value: ' + _selectValue_2);
            }
            if (procedure.reads.length > 0 || procedure.writes.length > 0) {
                throw new Error('A private function cannot read and write to shared variables: ' + procName);
            }
        }
    }
    for (variable of procedure.reads) {
        multiAdd(context.varReads, variable, procedure.name);
    }
    for (variable of procedure.writes) {
        existing = context.varWrites[variable];
        if (existing) {
            throw new Error('Only one function can write to a shared variable: ' + procName + ' and ' + context.name + '.' + existing);
        } else {
            context.varWrites[variable] = procedure.name;
        }
    }
}
function build(ast) {
    var astCopy, astjs, classes, cls, models, nsfun;
    astjs = JSON.stringify(ast);
    astCopy = JSON.parse(astjs);
    nsfun = astCopy.body[0];
    nsfun.params.push(createIdentifier('runtime'));
    classes = nsfun.body.body.filter(isFunction);
    models = [];
    for (cls of classes) {
        processClass(cls, models);
    }
    return {
        ast: astCopy,
        models: models
    };
}
function buildCallGraph(parent, property, node, astContext) {
    if (node.type === 'CallExpression' && node.callee.type === 'Identifier') {
        multiAdd(astContext.callGraph, node.callee.name, astContext.name);
    }
}
function checkForCycles(context, variable, stack) {
    var outputVariable, proc, reader, readers;
    if (stack.indexOf(variable) === -1) {
        stack.push(variable);
        readers = context.varReads[variable];
        if (readers) {
            for (reader of readers) {
                proc = context.procs[reader];
                for (outputVariable of proc.writes) {
                    checkForCycles(context, outputVariable, stack.slice());
                }
            }
        }
    } else {
        throw new Error('Dependency loop in shared variables: ' + context.name + '.' + variable);
    }
}
function checkVarAccess(property, node, astContext) {
    var exp, left, name;
    if (node.type === 'ExpressionStatement') {
        exp = node.expression;
        if (exp.type === 'AssignmentExpression') {
            left = exp.left;
            if (left.type === 'Identifier') {
                name = left.name;
                if (name in astContext.variables) {
                    astContext.writes[name] = true;
                }
            }
        }
    }
}
function clone(obj) {
    var copy;
    copy = {};
    Object.assign(copy, obj);
    return copy;
}
function createAssignment(left, right) {
    return {
        type: 'ExpressionStatement',
        expression: {
            type: 'AssignmentExpression',
            operator: '=',
            left: left,
            right: right
        }
    };
}
function createBool(value) {
    return {
        type: 'Literal',
        value: value,
        raw: '"' + value + '"'
    };
}
function createCall(callee, argNames) {
    return {
        type: 'ExpressionStatement',
        expression: {
            type: 'CallExpression',
            callee: callee,
            arguments: argNames.map(createIdentifier)
        }
    };
}
function createDeclaration(variable, value) {
    return {
        type: 'VariableDeclaration',
        kind: 'var',
        declarations: [{
                type: 'VariableDeclarator',
                id: createIdentifier(variable),
                init: value
            }]
    };
}
function createIdentifier(name) {
    return {
        'type': 'Identifier',
        'name': name
    };
}
function createIndexed(obj, key) {
    return {
        type: 'MemberExpression',
        computed: true,
        object: obj,
        property: key
    };
}
function createMember(objName, propName) {
    return {
        type: 'MemberExpression',
        computed: false,
        object: {
            type: 'Identifier',
            name: objName
        },
        property: {
            type: 'Identifier',
            name: propName
        }
    };
}
function createNumber(number) {
    return {
        type: 'Literal',
        value: number,
        raw: number.toString()
    };
}
function createObjectExpression() {
    return {
        type: 'ObjectExpression',
        properties: []
    };
}
function createProperty(name, value) {
    return {
        type: 'Property',
        key: createIdentifier(name),
        computed: false,
        value: value,
        kind: 'init',
        method: false,
        shorthand: false
    };
}
function createString(literal) {
    return {
        type: 'Literal',
        value: literal,
        raw: '"' + literal + '"'
    };
}
function declareTriggers(context, body) {
    var decl, name, proc, prop, trigger, triggers;
    triggers = createObjectExpression();
    for (trigger of context.triggers) {
        name = trigger.name;
        proc = context.procs[name];
        trigger = createObjectExpression();
        trigger.properties.push(createProperty('fun', createIdentifier(name)));
        trigger.properties.push(createProperty('rank', createNumber(proc.rank)));
        prop = createProperty(name, trigger);
        triggers.properties.push(prop);
    }
    decl = createDeclaration('_triggers_', triggers);
    body.unshift(decl);
}
function detectWrite(statement) {
    var expr, left;
    if (statement.type === 'ExpressionStatement') {
        expr = statement.expression;
        if (expr.type === 'AssignmentExpression') {
            left = expr.left;
            if (left.type === 'Identifier') {
                return left.name;
            } else {
                return undefined;
            }
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}
function findReads(parent, property, node, astContext) {
    var _selectValue_2, name, operation;
    if (node.type === 'Identifier') {
        name = node.name;
        if (name in astContext.variables) {
            operation = 'read';
            _selectValue_2 = parent.type;
            if (_selectValue_2 === 'AssignmentExpression') {
                if (property === 'left') {
                    if (parent.operator === '=') {
                        operation = 'write';
                    } else {
                        operation = 'readwrite';
                    }
                }
            } else {
                if (_selectValue_2 === 'UpdateExpression') {
                    operation = 'readwrite';
                } else {
                    if (_selectValue_2 === 'VariableDeclarator') {
                        if (property === 'id') {
                            operation = 'none';
                        }
                    } else {
                        if (_selectValue_2 === 'MemberExpression') {
                            if (!(property === 'object' || property === 'property' && parent.computed)) {
                                operation = 'none';
                            }
                        } else {
                            if (!(_selectValue_2 === 'BinaryExpression' || _selectValue_2 === 'UnaryExpression' || _selectValue_2 === 'CallExpression' || _selectValue_2 === 'NewExpression')) {
                                operation = 'none';
                            }
                        }
                    }
                }
            }
            if (operation === 'read') {
                astContext.reads[name] = true;
            } else {
                if (operation === 'write') {
                    astContext.writes[name] = true;
                } else {
                    if (operation === 'readwrite') {
                        astContext.readWrites[name] = true;
                    }
                }
            }
        }
    }
}
function findTriggers(context, method) {
    var dependants, dependencies, procName, producer, reads, variable;
    dependants = {};
    for (variable of method.writes) {
        reads = context.varReads[variable];
        if (reads) {
            for (procName of reads) {
                dependants[procName] = true;
            }
        }
    }
    method.dependants = getSortedKeys(dependants);
    dependencies = {};
    for (variable of method.reads) {
        producer = context.varWrites[variable];
        dependencies[producer] = true;
    }
    method.dependencies = getSortedKeys(dependencies);
}
function findWrittenVariable(statement) {
}
function getDeps(node) {
    return node.dependencies;
}
function getSortedKeys(obj) {
    return Object.keys(obj).toSorted();
}
function isFunction(node) {
    return node.type === 'FunctionDeclaration';
}
function multiAdd(dict, key, value) {
    var values;
    values = dict[key];
    if (values) {
        if (values.indexOf(value) === -1) {
            values.push(value);
        }
    } else {
        values = [value];
        dict[key] = values;
    }
}
function planTriggers(parent, property, node, astContext) {
    var body, context, copy, statement, statement2, variable;
    if (node.type === 'BlockStatement') {
        context = {
            plan: clone(astContext.plan),
            variables: astContext.variables,
            varReads: astContext.varReads
        };
        body = node.body;
        copy = [];
        for (statement of body) {
            variable = detectWrite(statement);
            if (variable && variable in context.variables) {
                addToPlan(context, variable, copy);
            }
            statement2 = rewriteAst(node, 'body', statement, planTriggers, context);
            copy.push(statement2);
        }
        node.body = copy;
        return node;
    } else {
        return undefined;
    }
}
function processClass(cls, models) {
    var _, _collection_11, _collection_14, _collection_2, _collection_5, _collection_8, body, context, fun, funName, model, name, node, proc, procedure, procs, variable;
    body = cls.body.body;
    name = cls.id.name;
    context = {
        name: name,
        functions: {},
        procs: {},
        varReads: {},
        varWrites: {},
        methods: [],
        triggers: [],
        variables: {},
        methodNames: {},
        callGraph: {}
    };
    for (node of body) {
        scanMember(context, node);
    }
    procs = {};
    _collection_2 = context.functions;
    for (funName in _collection_2) {
        fun = _collection_2[funName];
        if (funName in context.methodNames) {
            proc = scanReadWrites(context, 'method', fun);
            context.methods.push(proc);
        } else {
            if (funName in context.callGraph) {
                proc = scanReadWrites(context, 'private', fun);
            } else {
                proc = scanReadWrites(context, 'trigger', fun);
                context.triggers.push(proc);
            }
        }
        context.procs[funName] = proc;
    }
    _collection_5 = context.procs;
    for (funName in _collection_5) {
        procedure = _collection_5[funName];
        addToProcGraph(context, procedure);
    }
    _collection_8 = context.variables;
    for (variable in _collection_8) {
        _ = _collection_8[variable];
        if (!context.varWrites[variable]) {
            throw new Error('No function writes to the shared variable: ' + context.name + '.' + variable);
        }
        checkForCycles(context, variable, []);
    }
    _collection_14 = context.procs;
    for (funName in _collection_14) {
        procedure = _collection_14[funName];
        findTriggers(context, procedure);
    }
    sortTriggers(context);
    declareTriggers(context, body);
    _collection_11 = context.procs;
    for (funName in _collection_11) {
        procedure = _collection_11[funName];
        if (!(procedure.type === 'private')) {
            rewriteProcedure(context, procedure);
        }
    }
    model = {
        name: name,
        variables: context.variables,
        methods: context.methods,
        triggers: context.triggers,
        callGraph: context.callGraph,
        varReads: context.varReads,
        varWrites: context.varWrites
    };
    models.push(model);
}
function rewriteAst(parent, property, node, visitor, data) {
    var array2, copy, item, name, value, value2;
    if (node && typeof node === 'object' && typeof node.type === 'string') {
        copy = visitor(parent, property, node, data);
        if (copy) {
            return copy;
        } else {
            copy = {};
            for (name in node) {
                value = node[name];
                if (Array.isArray(value)) {
                    array2 = [];
                    for (item of value) {
                        value2 = rewriteAst(node, name, item, visitor, data);
                        array2.push(value2);
                    }
                    copy[name] = array2;
                } else {
                    value2 = rewriteAst(node, name, value, visitor, data);
                    copy[name] = value2;
                }
            }
            return copy;
        }
    } else {
        return node;
    }
}
function rewriteProcedure(context, procedure) {
    var _selectValue_2, astContext, body, fun;
    if (!(procedure.writes.length === 0)) {
        fun = context.functions[procedure.name];
        body = fun.body.body;
        _selectValue_2 = procedure.type;
        if (_selectValue_2 === 'method') {
            body.unshift(createDeclaration('_plan_', createObjectExpression()));
            body.push(createCall(createMember('runtime', 'runTriggers'), [
                '_plan_',
                '_triggers_'
            ]));
        } else {
            if (!(_selectValue_2 === 'trigger')) {
                throw new Error('Unexpected case value: ' + _selectValue_2);
            }
            fun.params.push(createIdentifier('_plan_'));
        }
        astContext = {
            plan: {},
            varReads: context.varReads,
            variables: context.variables
        };
        fun.body = rewriteAst({}, '', fun.body, planTriggers, astContext);
    }
}
function scanMember(context, node) {
    var astContext, exported, variable;
    if (isFunction(node)) {
        astContext = {
            name: node.id.name,
            callGraph: context.callGraph
        };
        traverseAst({}, '', node, buildCallGraph, astContext);
        context.functions[node.id.name] = node;
    } else {
        variable = tryGetVariableName(node);
        if (variable) {
            context.variables[variable] = true;
        } else {
            exported = tryGetExportedName(node);
            if (exported) {
                context.methodNames[exported] = true;
            }
        }
    }
}
function scanReadWrites(context, type, fun) {
    var astContext;
    astContext = {
        variables: context.variables,
        myWrites: {},
        reads: {},
        writes: {},
        readWrites: {}
    };
    traverseAst({}, '', fun, findReads, astContext);
    return {
        type: type,
        name: fun.id.name,
        dependants: [],
        dependencies: [],
        reads: getSortedKeys(astContext.reads),
        writes: getSortedKeys(astContext.writes),
        readWrites: getSortedKeys(astContext.readWrites)
    };
}
function sortTriggers(context) {
    var name, proc, rank, sorted;
    sorted = topologicalSort(context.procs, getDeps);
    rank = 1;
    for (name of sorted) {
        proc = context.procs[name];
        proc.rank = rank;
        rank++;
    }
}
function topoVisit(context, id, node) {
    var dependencies, dependency, depid;
    if (id in context.visiting) {
        throw new Error('Circular dependency: ' + id);
    } else {
        if (!(id in context.visited)) {
            context.visiting[id] = true;
            dependencies = context.getDependencies(node);
            for (depid of dependencies) {
                dependency = context.graph[depid];
                topoVisit(context, depid, dependency);
            }
            delete context.visiting[id];
            context.visited[id] = true;
            context.result.push(id);
        }
    }
}
function topologicalSort(graph, getDependencies) {
    var context, id, node;
    context = {
        visiting: {},
        visited: {},
        result: [],
        graph: graph,
        getDependencies: getDependencies
    };
    for (id in graph) {
        node = graph[id];
        topoVisit(context, id, node);
    }
    return context.result;
}
function traverseAst(parent, property, node, visitor, data) {
    var item, name, stop, value;
    if (node && typeof node === 'object' && typeof node.type === 'string') {
        stop = visitor(parent, property, node, data);
        if (!stop) {
            for (name in node) {
                value = node[name];
                if (Array.isArray(value)) {
                    for (item of value) {
                        traverseAst(node, name, item, visitor, data);
                    }
                } else {
                    traverseAst(node, name, value, visitor, data);
                }
            }
        }
    }
}
function tryGetExportedName(statement) {
    var exp, left, right;
    if (statement.type === 'ExpressionStatement') {
        exp = statement.expression;
        left = exp.left;
        right = exp.right;
        if (exp.type === 'AssignmentExpression' && left.type === 'MemberExpression' && left.object.type === 'Identifier' && left.object.name === 'self' && right.type === 'Identifier') {
            return right.name;
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}
function tryGetVariableName(statement) {
    var decl;
    if (statement.type === 'VariableDeclaration' && statement.kind === 'var' && statement.declarations && statement.declarations.length === 1) {
        decl = statement.declarations[0];
        if (decl.type === 'VariableDeclarator' && decl.init === null && decl.id.type === 'Identifier') {
            return decl.id.name;
        } else {
            return undefined;
        }
    } else {
        return undefined;
    }
}
unit.build = build;
return unit;
}
if (typeof module !== "undefined" && module.exports) {
    module.exports = {
        jacy
    };
}
