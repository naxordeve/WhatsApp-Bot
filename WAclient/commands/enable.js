
const { Command } = require('../../lib/command');
const { enableCommand } = require('../../lib/events');

Command({
    cmd_name: 'enable',
    aliases: ['ec'],
    category: 'owner', 
    desc: 'Enable a command'
})(async (msg) => {
    if(!msg.fromMe) return;
    if (!msg.text) return msg.reply('_Provide command name_');
    await msg.reply(`*Enable Command*\n\n1. Yes\n2. No\n\n_Reply with the number_`);
    Command._ID_NUM(msg.sender, {
        callback: async (number, message) => {
            if (number === 1) {
                enableCommand(msg.text);
                await message.reply(`✅Enabled Cmd: ${msg.text}`);
            } else {
                await message.reply('_cancelled_');
            }
        },
        valid: [1, 2]
    });
});
