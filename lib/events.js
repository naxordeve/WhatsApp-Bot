
const fs = require('fs');
const path = require('path');

const env = path.join(__dirname, 'cmdStates.json');
if (!fs.existsSync(env)) {
    fs.writeFileSync(env, JSON.stringify({
        disabledCommands: {},
        disabledBy: {},
        disabledAt: {}
    }));
}

async function loadStates() {
    return JSON.parse(fs.readFileSync(env, 'utf8'));
}

async function saveStates(states) { fs.writeFileSync(env, JSON.stringify(states, null, 2));}
async function disableCommand(cmd_name, by) {
    const states = loadStates();
    states.disabledCommands[cmd_name] = true;
    states.disabledBy[cmd_name] = by;
    states.disabledAt[cmd_name] = new Date().toISOString();
    saveStates(states);
}

async function enableCommand(cmdName) {
    const states = loadStates();
    delete states.disabledCommands[cmd_name];
    delete states.disabledBy[cmd_name];
    delete states.disabledAt[cmd_name];
    saveStates(states);
}

async function isCommandDisabled(cmd_name) {
    const states = loadStates();
    return {
        disabled: states.disabledCommands[cmd_name] || false,
        disabledBy: states.disabledBy[cmd_name],
        disabledAt: states.disabledAt[cmd_name]
    };
}

module.exports = { disableCommand, enableCommand, isCommandDisabled };
