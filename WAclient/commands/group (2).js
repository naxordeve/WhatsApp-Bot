
const { Command } = require('../../lib/command');

Command({
    cmd_name: 'close',
    aliases: ['mute'],
    category: 'admin',
    desc: 'Close/mute the group'
})(async (msg) => {
    try {
        const result = await msg.groupClose();
        await msg.reply(result);
    } catch (error) {
        await msg.reply(error.message);
    }
});

Command({
    cmd_name: 'open',
    aliases: ['unmute'],
    category: 'admin',
    desc: 'Open/unmute the group'
})(async (msg) => {
    try {
        const result = await msg.groupOpen();
        await msg.reply(result);
    } catch (error) {
        await msg.reply(error.message);
    }
});

Command({
    cmd_name: 'promote',
    category: 'admin',
    desc: 'Promote user to admin'
})(async (msg) => {
    try {
        const result = await msg.promote();
        await msg.reply(result);
    } catch (error) {
        await msg.reply(error.message);
    }
});

Command({
    cmd_name: 'demote',
    category: 'admin',
    desc: 'Demote admin to member'
})(async (msg) => {
    try {
        const result = await msg.demote();
        await msg.reply(result);
    } catch (error) {
        await msg.reply(error.message);
    }
});

Command({
    cmd_name: 'kick',
    category: 'admin',
    desc: 'Remove member from group'
})(async (msg) => {
    try {
        const result = await msg.kick();
        await msg.reply(result);
    } catch (error) {
        await msg.reply(error.message);
    }
});

Command({
    cmd_name: 'add',
    category: 'admin',
    desc: 'Add member to group'
})(async (msg) => {
    try {
        const result = await msg.add();
        await msg.reply(result);
    } catch (error) {
        await msg.reply(error.message);
    }
});

Command({
    cmd_name: 'revoke',
    category: 'admin',
    desc: 'Revoke group invite link'
})(async (msg) => {
    try {
        const result = await msg.revoke();
        await msg.reply(result);
    } catch (error) {
        await msg.reply(error.message);
    }
});

Command({
    cmd_name: 'link',
    aliases: ['invite'],
    category: 'group',
    desc: 'Get group invite link'
})(async (msg) => {
    try {
        const result = await msg.getGroupLink();
        await msg.reply(result);
    } catch (error) {
        await msg.reply(error.message);
    }
});

Command({
    cmd_name: 'ginfo',
    aliases: ['groupinfo'],
    category: 'group',
    desc: 'Get group information'
})(async (msg) => {
    if (!msg.isGroup) return msg.reply('Not a group');
    const info = `*Group Info*\n\nName: ${msg.groupName}\nID: ${msg.user}\nMembers: ${msg.groupMembers.length}\nAdmins: ${msg.groupAdmins.length}\nDesc: ${msg.groupDesc}`;
    await msg.reply(info);
});
