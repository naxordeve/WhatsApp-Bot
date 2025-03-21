
require('dotenv').config();

module.exports = {
    prefix: new RegExp(process.env.PREFIX || '^[!/.#]'),
    ownerNumber: process.env.OWNER_NUMBER || '6281234567890',
    moderators: (process.env.MODERATORS || '').split(',').filter(Boolean),
    botName: process.env.BOT_NAME || 'WhatsApp Bot',
    footer: process.env.FOOTER || '© WhatsApp Bot 2024',
    lang: process.env.LANG || 'id',
    workType: process.env.WORK_TYPE || 'public'
};
