const { Command } = require('../lib/command');
const axios = require('axios');

Command({
    cmd_name: 'fb',
    category: 'downloader',
    desc: 'Download Facebook videos'
})(async (msg, args) => {
    if (!args[0]) {
        return msg.reply('Please provide a Facebook video URL!\nExample: !fb https://www.facebook.com/watch?v=123456789');
    }

    try {
        await msg.react('⏳');
        const response = await axios.get(`https://diegoson-naxordeve.hf.space/facebook?url=${encodeURIComponent(args[0])}`);

        if (response.data.success && response.data.data.download?.url) {
            const progressMsg = await msg.reply('*Downloading video...*\n_This may take a while depending on the video size_');

            try {
                await msg.send({
                    video: { url: response.data.data.download.url },
                    caption: `*Successfully downloaded!*\n\n*Title:* ${response.data.data.title}\n*Quality:* ${response.data.data.quality}`,
                    mimetype: 'video/mp4'
                });
                await progressMsg.delete();
                await msg.react('✅');
            } catch (videoError) {
                await progressMsg.delete();
                throw new Error('Failed to send video: ' + videoError.message);
            }
        } else {
            throw new Error('Video URL not found in response');
        }
    } catch (error) {
        console.error('FB Download Error:', error);
        await msg.reply('Failed to download video. Make sure the URL is correct and the video is public.');
        await msg.react('❌');
    }
});