const fs = require('fs');
const path = require('path');

function plugins() {
    const com = path.join(__dirname, '../commands');
    const c = fs.readdirSync(com).filter(file => file.endsWith('.js'));
    for (const file of co) {
        require(path.join(com, file));
    } console.log('Commands loaded');
}

module.exports = { plugins };
