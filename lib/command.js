
const commands = new Map();

function Command(options) {
    return function(callback) {
        const cmdOptions = {
            cmd_name: options.cmd_name || '',
            category: options.category || 'misc',
            desc: options.desc || 'No description provided',
            callback
        };
        
        commands.set(cmdOptions.cmd_name, cmdOptions);
        return cmdOptions;
    };
}

function getCommand(name) {
    return commands.get(name);
}

function getAllCommands() {
    return Array.from(commands.values());
}

// Example command usage:
Command({
    cmd_name: require('./config').prefix + 'ping',
    category: 'general',
    desc: 'Check bot response'
})(async (msg, args, sock) => {
    await msg.reply('Pong! 🏓');
});

Command({
    cmd_name: 'echo',
    category: 'general',
    desc: 'Echo back your message'
})(async (msg, args, sock) => {
    await msg.reply(msg.text);
});

module.exports = { Command, getCommand, getAllCommands };
