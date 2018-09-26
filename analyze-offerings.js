
const check = require('./check-offerings');
const fs = require('fs');

function main() {
    const [_prog, script, file] = process.argv;
    const content = fs.readFileSync(file, 'utf8');
    const results = JSON.parse(content);
    const out = check.check(results);

    fs.writeFileSync('report.html', (out));
}

if (!module.parent) { main(); }
