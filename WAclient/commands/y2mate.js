const { Command } = require('../../lib/command');
var { extractUrl } = require('../../lib/Functions');
const axios = require('axios');

Command({
    cmd_name: 'ytmp3',
    aliases: ['y2mate','yta'],
    category: 'media',
    desc: 'Download YouTube audio'
})(async (msg) => {
    var url = extractUrl(msg.text);
    if (!url && msg.quoted) {
      url = extractUrl(msg.quoted.message?.conversation || msg.quoted.message?.extendedTextMessage?.text || '');
   }if (!url) return msg.reply('*_Please provide a YouTube url_*');
    const avoidable = `https://diegoson-naxordeve.hf.space/api/download?url=${url}`;
    const res = await axios.get(avoidable);
    const data = res.data;
    await msg.reply(`*_Now Playing: ${data.title}_*`);
    await msg.send({ audio: { url: data.audio['320'] }, mimetype: 'audio/mpeg', fileName: `${data.title}.mp3`,
    contextInfo: {externalAdReply: { title: data.title, body: `Duration: ${data.duration_time}`, thumbnailUrl: data.thumbnail, sourceUrl: data.youtube_url, mediaType: 1, showAdAttribution: true, renderLargerThumbnail: true
            }
        }
    });
});
   
