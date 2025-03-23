const { Command } = require('../lib/command');
const axios = require('axios');

Command({
    cmd_name: 'fb',
    category: 'media',
    desc: 'Download Facebook video'
})(async (msg, conn) => {
    const url = msg.text;
    if (!url) return msg.reply('_Please provide fb url_');
    msg.reply('wait...');
        const res = await axios.get(`https://diegoson-naxordeve.hf.space/facebook?url=${url}`);
        if (res.data && res.data.data) {
            const data = res.data.data;
            const qualities = Object.keys(data);
            const qualit = qualities.includes('720p (HD)') ? '720p (HD)' : qualities[0];
            const vid = data[qualit];
            const video = await axios.get(vid, { responseType: 'arraybuffer' });
            await msg.send({video: Buffer.from(video.data, 'binary'),mimetype: 'video/mp4',caption: `*Quality:* ${qualit}`});
        } 
});
