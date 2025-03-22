const { Command, getAllCommands } = require('../lib/command');
const config = require('../lib/config');
const { getSystemList } = require('../lib/system');
const { monospace } = require('../lib/utils'); // Import monospace function

Command({
    cmd_name: 'menu',
    category: 'core',
    desc: 'Display command list'
})(async (msg, args, sock) => {
    const commands = getAllCommands();
    const c = {};   
    commands.forEach(cmd => {
        if (!c[cmd.category]) c[cmd.category] = [];
        c[cmd.category].push(cmd);
    });

    const ss = getSystemList();
    let menu = ss.header
        .replace('{botName}', monospace(config.botName)) 
        .replace('{user}', monospace(msg.sender.split('@')[0]))
        .replace('{prefix}', monospace(config.prefix.source.replace(/[\^$]/g, '')));

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
      
