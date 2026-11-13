const fs = require('fs').promises;
const esprima = require('esprima');
const escodegen = require('escodegen');
const {jacy} = require('./jacy');

function getArguments() {
    const args = process.argv.slice(2);
    const result = {
        input: null,
        output: null,
        model: null
    };

    for (let i = 0; i < args.length; i++) {
        const arg = args[i];

        if (arg === "--output" || arg === "--model" || arg === "--diagrams") {
            if (!args[i + 1] || args[i + 1].startsWith("--")) {
                console.error(`Missing value for ${arg}`);
                process.exit(1);
            }
            result[arg.slice(2)] = args[++i];
        } else if (arg.startsWith("--")) {
            console.error(`Unknown option: ${arg}`);
            process.exit(1);
        } else if (result.input === null) {
            result.input = arg;
        } else {
            console.error(`Unexpected argument: ${arg}`);
            process.exit(1);
        }
    }

    if (!result.input) {
        console.log("Usage: node main.js <input.js> [--output output.js] [--model model.json] [--diagrams some_folder]");
        process.exit(1);
    }

    return result;
}

async function main() {
    const args = getArguments();
    const filename = args.input;

    const source = await fs.readFile(filename, 'utf8');
    const ast = esprima.parseScript(source);
    const jacyUnit = jacy();
    const jcbuild = jacyUnit.build(ast);
    const formatted = escodegen.generate(jcbuild.ast);
    var models = JSON.stringify(jcbuild.models, null, 2)
    if (args.output) {
        await fs.writeFile(args.output, formatted, 'utf8');
    } else {
        console.log(formatted);
    }
    if (args.model) {
        await fs.writeFile(args.model, models, 'utf8');
    } else {
        console.log(models);
    }
    if (args.diagrams) {
        const diagramsDir = args.diagrams;
        await fs.mkdir(diagramsDir, { recursive: true });
        for (var diagram of jcbuild.diagrams) {
            const diagramPath = `${diagramsDir}/${diagram.name}.free`;
            var content = JSON.stringify(diagram, null, 4);
            await fs.writeFile(diagramPath, content, 'utf8');
        }
    }
}

main().catch(error => {
    console.error(error);
    process.exit(1);
});