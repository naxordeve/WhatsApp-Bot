const { Command } = require('../../lib/command');
const axios = require('axios');

Command({
    cmd_name: 'tiktok',
    category: 'media',
    desc: 'Download TikTok video'
})(async (msg, conn) => {
    const url = msg.text;
    if (!url) return msg.reply('_Please provide ttk url_');
    const res = await axios.get(`https://diegoson-naxordeve.hf.space/tiktok?url=${url}`);
    if (res.data && res.data.data) {
        const data = res.data.data;
        let list = '*Choose Type:*\n\n';
        const types = ['HD Video', 'Normal Video', 'Music'];
        types.forEach((type, i) => {
            list += `${i + 1}. ${type}\n`;
        });
        list += '\n_Reply with the number to download_';
        await msg.reply(list);
        Command._ID_NUM(msg.sender, {
            callback: async (number, message) => {
                let buffer;
                let mimetype;
                let fileName;
                if (number === 1) {
                    const video = await axios.get(data.hdPlayUrl, { responseType: 'arraybuffer' });
                    buffer = Buffer.from(video.data, 'binary');
                    mimetype = 'video/mp4';
                } else if (number === 2) {
                    const video = await axios.get(data.playUrl, { responseType: 'arraybuffer' });
                    buffer = Buffer.from(video.data, 'binary');
                    mimetype = 'video/mp4';
                } else {
                    const audio = await axios.get(data.musicUrl, { responseType: 'arraybuffer' });
                    buffer = Buffer.from(audio.data, 'binary');
                    mimetype = 'audio/mpeg';
                    fileName = `${data.musicTitle}.mp3`;
                }
                
                if (number === 1 || number === 2) {
                    await message.send({
                        video: buffer,
                        mimetype: mimetype,
                        caption: `*Type:* ${types[number-1]}\n*Title:* ${data.title}\n*Music:* ${data.musicTitle}\n*By:* ${data.nickname}\n\n*Stats:*\n▢ ${data.playCount} Plays\n▢ ${data.diggCount} Likes\n▢ ${data.commentCount} Comments\n▢ ${data.shareCount} Shares\n▢ ${data.downloadCount} Downloads`
                    });
                } else {
                    await message.send({document: buffer,mimetype: mimetype, fileName: fileName
                    });
                }
            },
            valid: [1, 2, 3]
        });
    }
});
          
