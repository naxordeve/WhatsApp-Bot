const { Command } = require('../lib/command');
const axios = require('axios');

Command({
    cmd_name: 'fb',
    category: 'downloader',
    desc: 'Download fb videos'
})(async (msg) => {
    if (!msg.args[0]) return msg.reply('Please provide an fb url!\eg: !fb https://www.facebook.com/watch?v=123456789');
        await msg.react('⏳');
        const res = await axios.get(`https://diegoson-naxordeve.hf.space/facebook?url=${msg.args[0]}`);
        if (res.data.success && res.data.data.download?.url) {
            const p = await msg.reply('*Downloading...*');
                await msg.send({ video: { url: res.data.data.download.url }, caption: `*Quality:* ${res.data.data.quality}`, mimetype: 'video/mp4' });
                await p.delete();
                await msg.react('✅');
        } else {
            throw new Error('invalid');
        }
});
