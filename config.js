
require('dotenv').config();

module.exports = {
    prefix: new RegExp(process.env.PREFIX || '^[!/.#]'),
    ownerNumber: process.env.OWNER_NUMBER || '27686881509',
    mods: (process.env.MODS || '').split(',').filter(Boolean),
    botName: process.env.BOT_NAME || 'AquaSeek',
    session_id: process.env.SESSION_ID || 'c_IRIS_Hhpa1c_IRIS_4NHE=',
    footer: process.env.FOOTER || '© wabot',
    lang: process.env.LANG || 'en',
    workType: process.env.WORK_TYPE || 'public'
};
