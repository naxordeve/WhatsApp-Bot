const { Command } = require('../../lib/command');
const config = require('../../config');
const fs = require('fs');
const path = require('path');

Command({
    cmd_name: 'worktype',
    alias: ["mode"],
    category: 'owner',
    desc: 'Change bot worktype'
})(async (msg, conn) => {
    if (!msg.fromMe) return;
    let list = '*Choose Worktype:*\n\n';
    const types = ['private', 'public'];
    types.forEach((type, i) => {
        list += `${i + 1}. ${type}\n`;
    });
    list += '\n_Reply with the number_';
    await msg.reply(list);
    Command._ID_NUM(msg.sender, {
        callback: async (number, message) => {
            const type = types[number - 1];
            config.WORKTYPE = type;
            const kg = path.join(__dirname, '../../config.js');
            let cmd = fs.readFileSync(kg, 'utf8');
            cmd = cmd.replace(
                /WORKTYPE:\s*process\.env\.WORK_TYPE\s*\|\|\s*'[^']*'/,
                `WORKTYPE: process.env.WORK_TYPE || '${type}'`
            );
            fs.writeFileSync(kg, cmd);
            await message.reply(`*Worktype changed to:* ${type}`);
        },
        valid: [1, 2]
    });
});
