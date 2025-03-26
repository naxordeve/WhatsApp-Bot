const { Command } = require('../../lib/command');

Command({
    cmd_name: 'close',
    aliases: ['mute'],
    category: 'admin',
    desc: 'Close/mute the group'
})(async (msg, conn) => {
    if (!msg.isGroup) return;
    if (!msg.isAdmin && !msg.fromMe) return;
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin');
    await conn.groupSettingUpdate(msg.user, 'announcement');
    await msg.reply('_Group chat muted_');
});

Command({
    cmd_name: 'open',
    aliases: ['unmute'],
    category: 'admin',
    desc: 'Open/unmute the group'
})(async (msg, conn) => {
    if (!msg.isGroup) return;
    if (!msg.isAdmin && !msg.fromMe) return;
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin');
    await conn.groupSettingUpdate(msg.user, 'not_announcement');
    await msg.reply('_Group chat opened_');
});

Command({
    cmd_name: 'promote',
    category: 'admin',
    desc: 'Promote user to admin'
})(async (msg, conn) => {
    if (!msg.isGroup) return;
    if (!msg.isAdmin && !msg.fromMe) return;
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin');
    const user = msg.quoted ? msg.quoted.sender : (msg.mentions[0] || msg.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
    if (!user) return msg.reply('_Tag or reply to someone_');
    await conn.groupParticipantsUpdate(msg.user, [user], 'promote');
    await msg.reply(`@${user.split('@')[0]} is now an admin`, { mentions: [user] });
});

Command({
    cmd_name: 'demote',
    category: 'admin',
    desc: 'Demote admin to member'
})(async (msg, conn) => {
    if (!msg.isGroup) return;
    if (!msg.isAdmin && !msg.fromMe) return;
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin');
    const user = msg.quoted ? msg.quoted.sender : (msg.mentions[0] || msg.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
    if (!user) return msg.reply('_Tag or reply to someone_');
    await conn.groupParticipantsUpdate(msg.user, [user], 'demote');
    await msg.reply(`@${user.split('@')[0]} is no longer an admin`, { mentions: [user] });
});

Command({
    cmd_name: 'kick',
    category: 'admin',
    desc: 'Remove member from group'
})(async (msg, conn) => {
    if (!msg.isGroup) return;
    if (!msg.isAdmin && !msg.fromMe) return;
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin');
    const user = msg.quoted ? msg.quoted.sender : (msg.mentions[0] || msg.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
    if (!user) return msg.reply('_Tag or reply to someone_');
    await conn.groupParticipantsUpdate(msg.user, [user], 'remove');
    await msg.reply(`@${user.split('@')[0]} has been kicked`, { mentions: [user] });
});

Command({
    cmd_name: 'add',
    category: 'admin',
    desc: 'Add member to group'
})(async (msg, conn) => {
    if (!msg.isGroup) return;
    if (!msg.isAdmin && !msg.fromMe) return;
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin');
    const user = msg.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    if (!user) return msg.reply('_Provide a number_');
    try { const res = await conn.groupParticipantsUpdate(msg.user, [user], 'add');
        if (res[0].status === "409") {
            const code = await conn.groupInviteCode(msg.user);
            const invi = `https://chat.whatsapp.com/${code}`;
            await msg.reply(`Unable to add @${user.split('@')[0]} directly\nHeres the invite link:\n${invi}`, { mentions: [user] });
        } else {
            await msg.reply(`@${user.split('@')[0]} *has been added*`, { mentions: [user] });
        }
    } catch (error) {
        const code = await conn.groupInviteCode(msg.user);
        const invi = `https://chat.whatsapp.com/${code}`;
        await msg.reply(`Failed to add @${user.split('@')[0]}\nHeres the invite link:\n${invi}`, { mentions: [user] });
    }
});

Command({
    cmd_name: 'ginfo',
    aliases: ['groupinfo'],
    category: 'group',
    desc: 'Get group information'
})(async (msg, conn) => {
    if (!msg.isGroup) return;
    const info = `*Group Info*\n\nName: ${msg.groupName}\nID: ${msg.user}\nMembers: ${msg.groupMembers.length}\nAdmins: ${msg.groupAdmins.length}\nDesc: ${msg.groupDesc}`;
    await msg.reply(info);
});

Command({
    cmd_name: 'revoke',
    category: 'admin',
    desc: 'Revoke group invite link'
})(async (msg, conn) => {
    if (!msg.isGroup) return;
    if (!msg.isAdmin && !msg.fromMe) return;
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin');
    await conn.groupRevokeInvite(msg.user);
    await msg.reply('*_Group link revoked_*');
});

Command({
    cmd_name: 'link',
    aliases: ['invite'],
    category: 'group',
    desc: 'Get group invite link'
})(async (msg, conn) => {
    if (!msg.isGroup) return;
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin');
    const code = await conn.groupInviteCode(msg.user);
    await msg.reply(`\nhttps://chat.whatsapp.com/${code}`);
});
