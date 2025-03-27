
const { Command } = require('../../lib/command');

Command({
    cmd_name: 'block',
    category: 'owner',
    desc: 'Block a user'
})(async (msg, args, client) => {
    if (!msg.quoted && !args[0]) return msg.reply('Tag someone or reply to their message to block them');
    
    const userToBlock = msg.quoted ? msg.quoted.sender : args[0].replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    
    await client.updateBlockStatus(userToBlock, "block")
        .then(() => msg.reply('User has been blocked'))
        .catch(() => msg.reply('Failed to block user'));
});
