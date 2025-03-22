
require('dotenv').config();

module.exports = {
    prefix: new RegExp(process.env.PREFIX || '^[!/.#]'),
    owner_num: process.env.OWNER_NUMBER || '27686881509',
    mods: (process.env.MODS || '27686881509').split(',').filter(Boolean),
    botName: process.env.BOT_NAME || 'AquaSeek',
    SESSION_ID: process.env.SESSION_ID || '',
    grok_api: process.env.GROK_API || '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',
    footer: process.env.FOOTER || '© wabot',
    lang: process.env.LANG || 'en',
    workType: process.env.WORK_TYPE || 'public'
};
