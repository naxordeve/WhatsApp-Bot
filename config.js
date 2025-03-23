require('dotenv').config();

module.exports = {
    prefix: new RegExp(process.env.PREFIX || '^[!/.#]'),
    owner_num: process.env.OWNER_NUMBER || '27686881509',
    mods: (process.env.MODS || '27686881509,2349112171078').split(',').filter(Boolean),
    botName: process.env.BOT_NAME || 'X-Astral',
    
    GROK_API: process.env.GROK_API || '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',

    SESSION_ID: process.env.SESSION_ID || 'bWs3TVd_AFIYA_zRjE=',
    packname: process.env.PACK_NAME || 'X ASTRAL',
    author: process.env.AUTHOR || 'DIEGOSON',
 
    footer: process.env.FOOTER || '© wabot',
    lang: process.env.LANG || 'en',
    workType: process.env.WORK_TYPE || 'public'
};


