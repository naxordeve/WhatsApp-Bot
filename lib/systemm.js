const fs = require('fs');
const path = require('path');

function getSystemList() {
    const ff = path.join(__dirname, 'systemList.json');
    if (!fs.existsSync(ff)) return {};
    return JSON.parse(fs.readFileSync(ff, 'utf8'));
}

module.exports = { getSystemList };
