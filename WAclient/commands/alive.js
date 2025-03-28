var { Command} = require('../../lib/command');
var { monospace } = require('../../lib/Functions'); 
var os = require('os');

Command({
    cmd_name: 'alive',
    category: 'core',
    desc: 'Check if bot is running',
})(async(msg) => {
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const sec = Math.floor(uptime % 60);
        var voidi = `${monospace('*X ASTRAL ONLINE*')}\n\n` +
            `${monospace('*Uptime:*')} ${h}h ${m}m ${sec}s\n` +
            `${monospace('*Platform:*')} ${process.platform}\n` +
            `${monospace('*Node Version:*')} ${process.version}`;
            
        await msg.reply(voidi);
    });
