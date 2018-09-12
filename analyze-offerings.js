
const check = require('./check-offerings');
const fs = require('fs');

function main() {
    const [_prog, script, file] = process.argv;
    const content = fs.readFileSync(file, 'utf8');
    const results = JSON.parse(content);
    check.check(results);
}

if (!module.parent) { main(); }
