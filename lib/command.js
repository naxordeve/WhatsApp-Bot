const commands = new Map();
const { _ID_NUM, get_flag } = require('./DB/autonum');

Command._ID_NUM = _ID_NUM;
Command.get_flag = get_flag;
function Command(options) {
    return function(callback) {
        const cm = {
            cmd_name: options.cmd_name || '',
            aliases: options.aliases || [],
            category: options.category || 'misc',
            desc: options.desc || 'naxor',
            callback
        };

        commands.set(cm.cmd_name, cm);
        if (cm.aliases.length > 0) {
            cm.aliases.forEach(alias => {
                commands.set(alias, cm);
            });
        }
        return cm;
    };
}

const { isCommandDisabled } = require('./events');
function getCommand(name) {
    const cmd = commands.get(name);
    if (!cmd) return null;
    const state = isCommandDisabled(name);
    if (state.disabled) {
        cmd.disabled = true;
        cmd.disabledBy = state.disabledBy;
        cmd.disabledAt = state.disabledAt;
    }
    return cmd;
}
function getAllCommands() { return Array.from(commands.values()).filter(cmd => !commands.has(cmd.cmd_name)); }

module.exports = { Command, getCommand, getAllCommands };
