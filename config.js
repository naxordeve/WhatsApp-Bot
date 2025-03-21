
require('dotenv').config();

module.exports = {
    prefix: new RegExp(process.env.PREFIX || '^[!/.#]'),
    ownerNumber: process.env.OWNER_NUMBER || '27686881509',
    mods: (process.env.MODS || '').split(',').filter(Boolean),
    botName: process.env.BOT_NAME || 'AquaSeek',
    session_id: process.env.SESSION_ID || '',
    footer: process.env.FOOTER || '© wabot',
    lang: process.env.LANG || 'en',
    workType: process.env.WORK_TYPE || 'public'
};
