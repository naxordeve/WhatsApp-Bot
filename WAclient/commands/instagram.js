var { Command } = require('../../lib/command');
const axios = require('axios');

Command({
    cmd_name: 'ig',
    aliases: ['insta', 'instagram'],
    category: 'media',
    desc: 'Download Instagram video/post'
})(async (msg, conn) => {
    const url = msg.text;
    if (!url) return msg.reply('_Please provide Instagram url_');
    const res = await axios.get(`https://api.vreden.my.id/api/igdownload?url=${url}`);
    if (res.data && res.data.result && res.data.result.response) {
        const data = res.data.result.response;
        let list = '*Choose Type:*\n\n';
        const mediaa = data.data;
        mediaa.forEach((media, i) => {
            list += `${i + 1}. ${media.type.toUpperCase()}\n`;
        });
        list += '\n_Reply with the number to download_';
        await msg.send({
            image: { url: mediaa[0].thumb || data.profile.profile_pic_url },
            caption: list
        });
        Command._ID_NUM(msg.sender, {
            callback: async (number, message) => {
                const media = mediaList[number - 1];
                const content = await axios.get(media.url, { responseType: 'arraybuffer' });
                const buffer = Buffer.from(content.data, 'binary');
                const caption = `*Type:* ${media.type}\n*Caption:* ${data.caption.text}\n\n*Stats:*\n▢ ${data.statistics.play_count || 0} Plays\n▢ ${data.statistics.like_count} Likes\n▢ ${data.statistics.comment_count} Comments\n▢ ${data.statistics.share_count} Shares`;
                if (media.type === 'video') {
                    await message.send({video: buffer, mimetype: 'video/mp4', caption: caption });
                } else {
                    await message.send({
                        image: buffer,
                        caption: caption
                    });
                }
            },
            valid: Array.from({length: mediaList.length}, (_, i) => i + 1)
        });
    }
});
  
