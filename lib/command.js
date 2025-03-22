
const commands = new Map();

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
