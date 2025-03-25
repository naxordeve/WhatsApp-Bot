const { Command } = require('../../lib/command');
const { disableCommand } = require('../../lib/events');

Command({
    cmd_name: 'disable',
    aliases: ['dc'],
    category: 'owner',
    desc: 'Disable a command'
})(async (msg, args) => {
  if(!msg.fromMe) return;
    if (!msg.text) return msg.reply('Provide command nam');
    await msg.reply(`*Disable Command*\n\n1. Yes\n2. No\n\n_Reply with the number_`);
    Command._ID_NUM(msg.sender, {
        callback: async (number, message) => {
            if (number === 1) {
                disableCommand(msg.text, msg.sender);
                await message.reply(`✅Disabled cmd: ${msg.text}`);
            } else {
                await message.reply('cancelled');
            }
        },
        valid: [1, 2]
    });
});
