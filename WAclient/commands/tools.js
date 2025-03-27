const { Command } = require('../../lib/command');
const { extractUrl } = require('../../lib/Functions');

Command({
    cmd_name: 'ssweb',
    aliases: ['ss', 'screenshot'],
    category: 'tools',
    desc: 'Take screenshot of a website'
})(async (msg) => {
    let url = extractUrl(msg.text);
   if (!url && msg.quoted) {
      url = extractUrl(msg.quoted.message?.conversation || msg.quoted.message?.extendedTextMessage?.text || '');
    }if (!url) return msg.reply('Please provide a website url or reply to a message containing url');
    const ap = `https://image.thum.io/get/width/1200/crop/900/fullpage/${url}`;
    await msg.send({ image: { url: ap}, caption: `*📸X ASTRAL*`
    });
});
