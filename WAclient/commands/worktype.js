
const { Command } = require('../../lib/command');
const config = require('../../config');
const fs = require('fs');
const path = require('path');

Command({
    cmd_name: 'worktype',
    category: 'owner',
    desc: 'Change bot worktype'
})(async (msg, conn) => {
    if (!msg.fromMe) return msg.reply('Only owner can use this command');
    
    let list = '*Choose Worktype:*\n\n';
    const types = ['private', 'public'];
    types.forEach((type, i) => {
        list += `${i + 1}. ${type}\n`;
    });
    list += '\n_Reply with the number to change worktype_';
    await msg.reply(list);
    
    Command._ID_NUM(msg.sender, {
        callback: async (number, message) => {
            const type = types[number - 1];
            config.WORKTYPE = type;
            
            // Update config.js file
            const configPath = path.join(__dirname, '../../config.js');
            let configContent = fs.readFileSync(configPath, 'utf8');
            configContent = configContent.replace(
                /WORKTYPE:\s*process\.env\.WORK_TYPE\s*\|\|\s*'[^']*'/,
                `WORKTYPE: process.env.WORK_TYPE || '${type}'`
            );
            fs.writeFileSync(configPath, configContent);
            
            await message.reply(`*Worktype changed to:* ${type}`);
        },
        valid: [1, 2]
    });
});
