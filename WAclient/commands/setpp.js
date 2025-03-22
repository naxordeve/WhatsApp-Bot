const { Command } = require('../../lib/command');
const jimp = require('jimp');

Command({
    cmd_name: 'setpp',
    category: 'media',
    desc: 'Set full resolution profile picture'
})
(async ({ msg, client }) => {
    try {
        const quoted = msg.quoted;
        if (!quoted || !quoted.type.startsWith('image')) {
            return msg.reply('Reply to an image to set it as profile picture');
        }

        const mediaData = await quoted.download();
        let buffer = Buffer.from([]);
        for await (const chunk of mediaData) {
            buffer = Buffer.concat([buffer, chunk]);
        }

        const image = await jimp.read(buffer);
        const min = Math.min(image.getWidth(), image.getHeight());
        const cropped = await image.crop(0, 0, min, min).getBufferAsync(jimp.MIME_JPEG);
        
        await client.query({
            tag: 'iq',
            attrs: {
                to: client.user.id,
                type: 'set',
                xmlns: 'w:profile:picture'
            },
            content: [
                {
                    tag: 'picture',
                    attrs: { type: 'image' },
                    content: cropped
                }
            ]
        });

        await msg.reply('Profile picture updated successfully!');
    } catch (error) {
        console.error('SetPP error:', error);
        await msg.reply('Failed to update profile picture');
    }
});