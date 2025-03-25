
const fs = require('fs');
const path = require('path');

const eventsFile = path.join(__dirname, 'cmdStates.json');

// Initialize states if file doesn't exist
if (!fs.existsSync(eventsFile)) {
    fs.writeFileSync(eventsFile, JSON.stringify({
        disabledCommands: {},
        disabledBy: {},
        disabledAt: {}
    }));
}

function loadStates() {
    return JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
}

function saveStates(states) {
    fs.writeFileSync(eventsFile, JSON.stringify(states, null, 2));
}

function disableCommand(cmdName, disabledById) {
    const states = loadStates();
    states.disabledCommands[cmdName] = true;
    states.disabledBy[cmdName] = disabledById;
    states.disabledAt[cmdName] = new Date().toISOString();
    saveStates(states);
}

function enableCommand(cmdName) {
    const states = loadStates();
    delete states.disabledCommands[cmdName];
    delete states.disabledBy[cmdName];
    delete states.disabledAt[cmdName];
    saveStates(states);
}

function isCommandDisabled(cmdName) {
    const states = loadStates();
    return {
        disabled: states.disabledCommands[cmdName] || false,
        disabledBy: states.disabledBy[cmdName],
        disabledAt: states.disabledAt[cmdName]
    };
}

module.exports = { disableCommand, enableCommand, isCommandDisabled };
