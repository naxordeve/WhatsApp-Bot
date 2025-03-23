require('dotenv').config();

module.exports = {
    PREFIX: new RegExp(process.env.PREFIX || '^[!/.#?~]'),
    OWNER_NUM: process.env.OWNER_NUMBER || '27686881509',
    MODS: (process.env.MODS || '27686881509').split(',').filter(Boolean),
    
    BOT_NAME: process.env.BOT_NAME || 'X-Astral',
    
    GROK_API: process.env.GROK_API || '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',

    SESSION_ID: process.env.SESSION_ID || '',

    PASTE_BIN_API: process.env.PASTE_BIN_API || '',
    
    FOOTER: process.env.FOOTER || '© wabot',
    LANG: process.env.LANG || 'en',
    WORKTYPE: process.env.WORK_TYPE || 'private'
};


