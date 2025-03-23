const { Command } = require('../../lib/command');
const { makeSticker } = require('../../lib/Sticker');
const config = require('../../config'); 

Command({
    cmd_name: 'sticker',
    category: 'converter',
    desc: 'Convert image/video to sticker'
})(async (msg, conn) => {
    const quoted = msg.quoted ? msg.quoted : msg;
    const mime = quoted.type || '';
    if (!/image|video|gif/.test(mime)) return msg.reply('_Reply to an image, video, or GIF_');
    msg.reply('Creating stk...');
    const mediaData = await quoted.download();
    let buffer = Buffer.from([]);
    for await (const chunk of mediaData) {
    buffer = Buffer.concat([buffer, chunk]);}
    const sticker = await makeSticker(buffer, mime);
    if (!sticker) return msg.reply('err');
    await msg.send({sticker });
});
    
