
const { Command, getAllCommands } = require('../lib/command');
const config = require('../lib/config');

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

    const emojis = {
        'core': '⚡',
        'owner': '👑',
        'group': '👥',
        'tools': '🛠️',
        'download': '📥',
        'convert': '🔄',
        'fun': '🎮'
    };

    let menu = `╭━━━ *${config.botName}* ━━━⊱\n`;
    menu += `┃ 🎯 *User:* @${msg.sender.split('@')[0]}\n`;
    menu += `┃ 📟 *Prefix:* [ ${config.prefix.source.replace(/[\^$]/g, '')} ]\n`;
    menu += `╰━━━━━━━━━━━━━━⊱\n\n`;

    Object.entries(c)
        .sort(([a], [b]) => a.localeCompare(b))
        .forEach(([category, cmds]) => {
            const icon = emojis[category] || '📌';
            menu += `╭━━━ ${icon} *${category.toUpperCase()}* ━⊱\n`;
            
            cmds.sort((a, b) => a.cmd_name.localeCompare(b.cmd_name))
                .forEach(cmd => {
                    menu += `┃ ⌁ ${cmd.cmd_name}\n`;
                    menu += `┃ └ ${cmd.desc}\n`;
                });
            
            menu += `╰━━━━━━━━━━━⊱\n`;
        });

    menu += `\n┏━━━━『 ${config.footer} 』━━━━┓`;
    await msg.reply(menu);
});
