const fs = require('fs');
const path = require('path');

function getSystemList() {
    const filePath = path.join(__dirname, 'systemList.json');
    if (!fs.existsSync(filePath)) return {};
    return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

module.exports = { getSystemList };
