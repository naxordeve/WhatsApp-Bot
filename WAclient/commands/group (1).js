
const { Command } = require('../../lib/command');

Command({
    cmd_name: 'close',
    aliases: ['mute'],
    category: 'admin',
    desc: 'Close/mute the group'
})(async (msg, conn) => {
    if (!msg.isGroup) return msg.reply('This command can only be used in groups!');
    if (!msg.isAdmin && !msg.fromMe) return msg.reply('Only admins can use this command!');
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin!');
    await conn.groupSettingUpdate(msg.user, 'announcement');
    await msg.reply('Group chat muted!');
});

Command({
    cmd_name: 'open',
    aliases: ['unmute'],
    category: 'admin',
    desc: 'Open/unmute the group'
})(async (msg, conn) => {
    if (!msg.isGroup) return msg.reply('This command can only be used in groups!');
    if (!msg.isAdmin && !msg.fromMe) return msg.reply('Only admins can use this command!');
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin!');
    await conn.groupSettingUpdate(msg.user, 'not_announcement');
    await msg.reply('Group chat opened!');
});

Command({
    cmd_name: 'promote',
    category: 'admin',
    desc: 'Promote user to admin'
})(async (msg, conn) => {
    if (!msg.isGroup) return msg.reply('This command can only be used in groups!');
    if (!msg.isAdmin && !msg.fromMe) return msg.reply('Only admins can use this command!');
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin!');
    const user = msg.quoted ? msg.quoted.sender : (msg.mentions[0] || msg.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
    if (!user) return msg.reply('Tag or reply to someone!');
    await conn.groupParticipantsUpdate(msg.user, [user], 'promote');
    await msg.reply(`@${user.split('@')[0]} is now an admin!`, { mentions: [user] });
});

Command({
    cmd_name: 'demote',
    category: 'admin',
    desc: 'Demote admin to member'
})(async (msg, conn) => {
    if (!msg.isGroup) return msg.reply('This command can only be used in groups!');
    if (!msg.isAdmin && !msg.fromMe) return msg.reply('Only admins can use this command!');
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin!');
    const user = msg.quoted ? msg.quoted.sender : (msg.mentions[0] || msg.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
    if (!user) return msg.reply('Tag or reply to someone!');
    await conn.groupParticipantsUpdate(msg.user, [user], 'demote');
    await msg.reply(`@${user.split('@')[0]} is no longer an admin!`, { mentions: [user] });
});

Command({
    cmd_name: 'kick',
    category: 'admin',
    desc: 'Remove member from group'
})(async (msg, conn) => {
    if (!msg.isGroup) return msg.reply('This command can only be used in groups!');
    if (!msg.isAdmin && !msg.fromMe) return msg.reply('Only admins can use this command!');
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin!');
    const user = msg.quoted ? msg.quoted.sender : (msg.mentions[0] || msg.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net');
    if (!user) return msg.reply('Tag or reply to someone!');
    await conn.groupParticipantsUpdate(msg.user, [user], 'remove');
    await msg.reply(`@${user.split('@')[0]} has been kicked!`, { mentions: [user] });
});

Command({
    cmd_name: 'add',
    category: 'admin',
    desc: 'Add member to group'
})(async (msg, conn) => {
    if (!msg.isGroup) return msg.reply('This command can only be used in groups!');
    if (!msg.isAdmin && !msg.fromMe) return msg.reply('Only admins can use this command!');
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin!');
    const user = msg.text.replace(/[^0-9]/g, '') + '@s.whatsapp.net';
    if (!user) return msg.reply('Provide a number!');
    
    try {
        const response = await conn.groupParticipantsUpdate(msg.user, [user], 'add');
        if (response[0].status === "409") {
            // User can't be added directly
            const code = await conn.groupInviteCode(msg.user);
            const inviteLink = `https://chat.whatsapp.com/${code}`;
            await msg.reply(`Unable to add @${user.split('@')[0]} directly. Here's the invite link:\n${inviteLink}`, { mentions: [user] });
        } else {
            await msg.reply(`@${user.split('@')[0]} has been added!`, { mentions: [user] });
        }
    } catch (error) {
        const code = await conn.groupInviteCode(msg.user);
        const inviteLink = `https://chat.whatsapp.com/${code}`;
        await msg.reply(`Failed to add @${user.split('@')[0]}. Here's the invite link:\n${inviteLink}`, { mentions: [user] });
    }
});

Command({
    cmd_name: 'ginfo',
    aliases: ['groupinfo'],
    category: 'group',
    desc: 'Get group information'
})(async (msg, conn) => {
    if (!msg.isGroup) return msg.reply('This command can only be used in groups!');
    const info = `*Group Info*\n\nName: ${msg.groupName}\nDesc: ${msg.groupDesc}\nMembers: ${msg.groupMembers.length}\nAdmins: ${msg.groupAdmins.length}\nID: ${msg.user}`;
    await msg.reply(info);
});

Command({
    cmd_name: 'revoke',
    category: 'admin',
    desc: 'Revoke group invite link'
})(async (msg, conn) => {
    if (!msg.isGroup) return msg.reply('This command can only be used in groups!');
    if (!msg.isAdmin && !msg.fromMe) return msg.reply('Only admins can use this command!');
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin!');
    await conn.groupRevokeInvite(msg.user);
    await msg.reply('Group link revoked!');
});

Command({
    cmd_name: 'link',
    aliases: ['invite'],
    category: 'group',
    desc: 'Get group invite link'
})(async (msg, conn) => {
    if (!msg.isGroup) return msg.reply('This command can only be used in groups!');
    if (!msg.isBotAdmin) return msg.reply('Bot needs to be admin!');
    const code = await conn.groupInviteCode(msg.user);
    await msg.reply(`https://chat.whatsapp.com/${code}`);
});

Command({
    cmd_name: 'setsudo',
    category: 'owner',
    desc: 'Add a number to MODS (Reply to message or provide number)'
})(async (msg, conn) => {
    if (!msg.fromMe && msg.sender.split('@')[0] !== config.OWNER_NUM) {
        return msg.reply('Only owner can use this command!');
    }
    
    let number;
    if (msg.quoted) {
        number = msg.quoted.sender.split('@')[0];
    } else {
        number = msg.text.replace(/[^0-9]/g, '');
    }
    
    if (!number) {
        return msg.reply('Please provide a number or reply to a message!\nExample: .setsudo 1234567890');
    }
    
    // Check if number is already in MODS
    if (config.MODS.includes(number)) {
        return msg.reply('This number is already a MOD!');
    }
    
    try {
        const fs = require('fs');
        const path = require('path');
        const configPath = path.join(__dirname, '../../config.js');
        
        // Read current config
        let configContent = fs.readFileSync(configPath, 'utf8');
        
        // Create new MODS list
        const currentMods = config.MODS.join(',');
        const newMods = currentMods + ',' + number;
        
        // Update config file
        configContent = configContent.replace(
            /MODS: \(process\.env\.MODS \|\| '[^']*'\)\.split\(','\)/,
            `MODS: (process.env.MODS || '${newMods}').split(',')`
        );
        
        fs.writeFileSync(configPath, configContent);
        
        // Update runtime config
        config.MODS.push(number);
        
        if (msg.quoted) {
            await msg.reply(`✅ Successfully added @${number} to MODS list!`, { mentions: [`${number}@s.whatsapp.net`] });
        } else {
            await msg.reply(`✅ Successfully added ${number} to MODS list!`);
        }
    } catch (error) {
        console.error('Error in setsudo:', error);
        await msg.reply('❌ Failed to add number to MODS list.');
    }
});

Command({
    cmd_name: 'getsudo',
    category: 'owner',
    desc: 'Get list of MODS'
})(async (msg, conn) => {
    if (!msg.fromMe && msg.sender.split('@')[0] !== config.OWNER_NUM) {
        return msg.reply('Only owner can use this command!');
    }
    
    const modsList = config.MODS.map(mod => `@${mod}`).join('\n');
    await msg.reply(`*Current MODS:*\n${modsList}`, {
        mentions: config.MODS.map(mod => `${mod}@s.whatsapp.net`)
    });
});

Command({
    cmd_name: 'removesudo',
    category: 'owner',
    desc: 'Remove a number from MODS'
})(async (msg, conn) => {
    if (!msg.fromMe && msg.sender.split('@')[0] !== config.OWNER_NUM) {
        return msg.reply('Only owner can use this command!');
    }
    
    let number;
    if (msg.quoted) {
        number = msg.quoted.sender.split('@')[0];
    } else {
        number = msg.text.replace(/[^0-9]/g, '');
    }
    
    if (!number) {
        return msg.reply('Please provide a number or reply to a message!');
    }
    
    if (!config.MODS.includes(number)) {
        return msg.reply('This number is not a MOD!');
    }
    
    const fs = require('fs');
    const path = require('path');
    const configPath = path.join(__dirname, '../../config.js');
    
    let configContent = fs.readFileSync(configPath, 'utf8');
    
    const newMods = config.MODS.filter(mod => mod !== number).join(',');
    
    configContent = configContent.replace(
        /MODS: \(process\.env\.MODS \|\| '[^']*'\)\.split\(','\)/,
        `MODS: (process.env.MODS || '${newMods}').split(',')`
    );
    
    fs.writeFileSync(configPath, configContent);
    
    config.MODS = config.MODS.filter(mod => mod !== number);
    
    if (msg.quoted) {
        await msg.reply(`Successfully removed @${number} from MODS list!`, { mentions: [`${number}@s.whatsapp.net`] });
    } else {
        await msg.reply(`Successfully removed ${number} from MODS list!`);
    }
});
