const { Command } = require('../../lib/command');
var { extractUrl } = require('../../lib/Functions');
const axios = require('axios');

Command({
    cmd_name: 'ytmp4',
    aliases: ['ytv', 'video'],
    category: 'media',
    desc: 'Download YouTube video'
})(async (msg) => {
    var url = extractUrl(msg.text);
    if (!url && msg.quoted) {
      url = extractUrl(msg.quoted.message?.conversation || msg.quoted.message?.extendedTextMessage?.text || '');
   }if (!url) return msg.reply('*_Please provide a yt url_*');
    const nun = `https://diegoson-naxordeve.hf.space/api/download?url=${url}`;
    const res = await axios.get(nun);
    const data = res.data;
    await msg.send({video: { url: data.video['720'] }, caption: data.title });
});
