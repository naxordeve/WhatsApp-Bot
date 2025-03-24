const commands = new Map();
const { _ID_NUM, get_id } = require('./DB/autonum');

Command._ID_NUM = _ID_NUM;
Command.get_id = get_id;
function Command(options) {
    return function(callback) {
        const cm = {
            cmd_name: options.cmd_name || '',
            category: options.category || 'misc',
            desc: options.desc || 'naxor',
            callback
        };

        commands.set(cm.cmd_name, cm);
        return cm;
    };
}

function getCommand(name) { return commands.get(name);}
function getAllCommands() { return Array.from(commands.values());}


module.exports = { Command, getCommand, getAllCommands };
