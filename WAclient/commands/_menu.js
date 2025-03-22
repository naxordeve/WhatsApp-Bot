const { Command, getAllCommands } = require('../../lib/command');
const config = require('../../config');
const os = require('os');
const moment = require('moment-timezone');
const { getSystemList } = require('../../lib/systemm');
const { monospace } = require('../../lib/Functions'); 

Command({
    cmd_name: 'menu',
    category: 'core',
    desc: 'Display command list'
})(async (msg, args, conn) => {
    const commands = getAllCommands();
    const c = {};   
    commands.forEach(cmd => {
        if (!c[cmd.category]) c[cmd.category] = [];
        c[cmd.category].push(cmd);
    });

    const ss = getSystemList();
    const time = moment().tz('Africa/Johannesburg').format('HH:mm:ss');
    const date = moment().tz('Africa/Johannesburg').format('YYYY-MM-DD');
    const ramUsage = (os.totalmem() - os.freemem()) / (1024 * 1024);
    let menu = ss.header
        .replace('{botName}', monospace(config.botName)) 
        .replace('{user}', monospace(msg.sender.split('@')[0]))
        .replace('{prefix}', monospace(config.prefix.source.replace(/[\^$]/g, '')))
        .replace('{time}', time)
        .replace('{date}', date)
        .replace('{mode}', config.workType)
        .replace('{ram}', ramUsage.toFixed(2));


    Object.entries(c)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([category, cmds]) => {
            menu += `╭───╼【 *${monospace(category.toUpperCase())}* 】 \n`;
            cmds.sort((a, b) => a.cmd_name.localeCompare(b.cmd_name))
                .forEach(cmd => {
                    menu += `┃ ${monospace(cmd.cmd_name)}\n`;
                });
            
            menu += `╰──────────╼\n`;
        });

    menu += `\n${config.footer}`;
    await msg.reply(menu);
});



Command({
    cmd_name: 'alive',
    category: 'core',
    desc: 'Check if bot is running',
})(async(msg) => {
        const uptime = process.uptime();
        const h = Math.floor(uptime / 3600);
        const m = Math.floor((uptime % 3600) / 60);
        const sec = Math.floor(uptime % 60);
        var voidi = `*WhatsApp-Bot is alive*\n\n` +
            `*Uptime:* ${h}h ${m}m ${sec}s\n` +
            `*Platform:* ${process.platform}\n` +
            `*Node Version:* ${process.version}`;
            
        await msg.reply(voidi);
    });
