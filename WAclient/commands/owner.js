var { Command } = require('../../lib/command');

Command({
    cmd_name: 'block',
    category: 'owner',
    desc: 'Block a user'
})(async (msg, conn) => {
    if(!msg.fromMe) return;
    if (!msg.quoted && !msg.text) return msg.reply('_Tag someone or reply to someone_');
    const xxx = msg.quoted ? msg.quoted.sender : msg.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    await conn.updateBlockStatus(xxx, "block")
        .then(() => msg.reply('*_Blocked sucss_*'))
        .catch(() => msg.reply('oops'));
});

Command({
    cmd_name: 'unblock',
    category: 'owner',
    desc: 'Unblock a user'
})(async (msg, conn) => {
    if(!msg.fromMe) return;
    if (!msg.quoted && !msg.text) return msg.reply('Tag someone or reply to their message to unblock them');
    const xxx = msg.quoted ? msg.quoted.sender : msg.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    await conn.updateBlockStatus(xxx, "unblock")
        .then(() => msg.reply('*_Unblocked_*'))
        .catch(() => msg.reply('oops'));
});

