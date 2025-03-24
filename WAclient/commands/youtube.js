const { Command } = require('../../lib/command');
const axios = require('axios');
const yts = require('yt-search');

Command({
    cmd_name: 'play',
    category: 'media',
    desc: 'Play YouTube audio/video'
})(async (msg, args, conn) => {
    const query = msg.text;
    if (!query) return msg.reply('_Please provide a search query_')
    msg.reply('wait...');
        const results = await yts(query);
        if (!results.videos.length) return;
        const video = results.videos[0];
        const res = await axios.get(`https://tshepang.vercel.app/download?url=${video.url}`);
        if (!res.data) return;
        let list = `${monospace('*Choose Option:*')}\n\n`;
        list += `${monospace('*Title:*')} ${res.data.title}\n`;
        list += `${monospace('*Duration:*')} ${res.data.duration_time}\n\n`;
        list += '1. Audio (320kbps)\n';
        list += '2. Video (720p)\n\n';
        list += '_Reply with number to download_';
        await msg.send({image: { url: res.data.thumbnail },caption: list,});
        Command._ID_NUM(msg.sender, {
            callback: async (number, message) => {
                    if (number === 1) {
                        const audio = await axios.get(res.data.audio['320'], { responseType: 'arraybuffer' });
                        await message.send({
                            audio: Buffer.from(audio.data),
                            mimetype: 'audio/mpeg',
                            contextInfo: {
                                externalAdReply: {
                                    title: res.data.title,
                                    body: `${res.data.duration_time}`,
                                    thumbnail: await (await axios.get(res.data.thumbnail, { responseType: 'arraybuffer' })).data,
                                    mediaType: 1,
                                    mediaUrl: res.data.youtube_url,
                                    sourceUrl: res.data.youtube_url
                                }
                            }
                        });
                    } else {
                        const video = await axios.get(res.data.video['720'], { responseType: 'arraybuffer' });
                        await message.send({video: Buffer.from(video.data), mimetype: 'video/mp4',caption: res.data.title
                        });
                    }
            },
            valid: [1, 2]
        });
});
