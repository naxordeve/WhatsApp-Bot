const { Command } = require('../../lib/command');
const axios = require('axios');

Command({
    cmd_name: 'spotify',
    aliases: ['sp'],
    category: 'media',
    desc: 'Download Spotify music'
})(async (msg, conn) => {
    const url = msg.text;
    if (!url) return msg.reply('Please provide Spotify URL');
    const res = await axios.get(`https://api.vreden.my.id/api/spotify?url=${url}`);
    if (res.data && res.data.result) {
        const data = res.data.result;
        let list = '*Choose Type:*\n\n';
        const types = ['Music', 'Cover Image'];
        types.forEach((type, i) => {
            list += `${i + 1}. ${type}\n`;
        });
        list += '\n_Reply with the number to download_';
        await msg.send({ image: { url: data.cover }, caption: list
        });
        Command._ID_NUM(msg.sender, {
            callback: async (number, message) => {
                if (number === 1) {
                    const audio = await axios.get(data.music, { responseType: 'arraybuffer' });
                    const buffer = Buffer.from(audio.data, 'binary');
                    await message.send({document: buffer,mimetype: 'audio/mpeg',fileName: `${data.title}.mp3`,caption: `*Title:* ${data.title}\n*Artist:* ${data.artists}\n*Type:* ${data.type}\n*Release Date:* ${data.releaseDate}`});
                } else {
                    const image = await axios.get(data.cover, { responseType: 'arraybuffer' });
                    const buffer = Buffer.from(image.data, 'binary');
                    await message.send({image: buffer, caption: `*Title:* ${data.title}\n*Artist:* ${data.artists}\n*Type:* ${data.type}\n*Release Date:* ${data.releaseDate}`
                    });
                }
            },
            valid: [1, 2]
        });
    }
});
