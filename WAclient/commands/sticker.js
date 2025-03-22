
const { Command } = require('../../lib/command');
const { createSticker } = require('../../lib/Functions');

Command({
    cmd_name: 'sticker',
    category: 'media',
    desc: 'Convert image/video to sticker'
})
(async ({ msg, client }) => {
    const quoted = msg.quoted ? msg.quoted : msg;
    const mime = quoted.type || '';

    if (!/image|video/.test(mime)) {
        return msg.reply('Reply to an image or video to convert it to sticker');
    }

    try {
        msg.reply('Creating sticker...');
        const mediaData = await quoted.download();
        let buffer = Buffer.from([]);
        for await (const chunk of mediaData) {
            buffer = Buffer.concat([buffer, chunk]);
        }
        const sticker = await createSticker(buffer, mime);
        await msg.send({ sticker });
    } catch (error) {
        console.error('Sticker creation error:', error);
        msg.reply('Failed to create sticker');
    }
});
