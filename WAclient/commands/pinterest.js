const { Command } = require('../../lib/command');
const axios = require('axios');

Command({
    cmd_name: 'pin',
    aliases: ['pinterest'],
    category: 'media',
    desc: 'Download Pinterest media'
})(async (msg, conn) => {
    const url = msg.text;
    if (!url) return msg.reply('Please provide Pinterest URL');
    const res = await axios.get(`https://api.vreden.my.id/api/download/pinterest?url=${url}`);
    if (res.data && res.data.result) {
        const data = res.data.result;
        let list = '*Choose Quality:*\n\n';
        const medo = data.media_urls;
        medo.forEach((media, i) => {
            list += `${i + 1}. ${media.quality.toUpperCase()} (${media.size})\n`;
        });
        list += '\n_Reply with the number to download_';
        await msg.send({image: { url: medo[0].url }, caption: list });
        Command._ID_NUM(msg.sender, {
            callback: async (number, message) => {
                const media = medo[number - 1];
                const content = await axios.get(media.url, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(content.data, 'binary');
                const caption = `*Quality:* ${media.quality}\n*Size:* ${media.size}\n*Title:* ${data.title}\n\n*Stats:*\n▢ ${data.statistics.saves} Saves\n▢ ${data.statistics.comments} Comments\n▢ ${data.statistics.total_reactions} Reactions`;
                await message.send({image: buffer, caption: caption });
            },
            valid: Array.from({length: medo.length}, (_, i) => i + 1)
        });
    }
});
