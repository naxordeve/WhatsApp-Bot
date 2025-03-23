const { Command } = require('../../lib/command');
var { monospace } = require('../../Functions');
const { search, download } = require('aptoide-api');
const axios = require('axios');

Command({
    cmd_name: 'apk',
    category: 'media',
    desc: 'Download APK '
})(async (msg, conn) => {
    const query = msg.text;
    if (!query) return msg.reply('_Please provide app name_');
    msg.reply('Searching...');
    const apps = await search(query, 1);
        if (apps && apps.length > 0) {
            const app = apps[0];
            await msg.send(}image: { url: app.icon }, caption: `${monospace('*Name:*'} ${app.name}\n${monospace('*Package:*')} ${app.package}\n${monospace('*Size:*')} ${app.size}\n${monospace('*Version:*')} ${app.version}\n${monospace('*Downloads:*')} ${app.downloads}\n${monospace('*Rating:*')} ${app.rating}`});
            const apkBuffer = await download(app.downloadUrl);
            await msg.send({
                document: apkBuffer,
                mimetype: 'application/vnd.android.package-archive',
                fileName: `${app.name}.apk`
 });

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

Command({
    cmd_name: 'tiktok',
    category: 'media',
    desc: 'Download TikTok video'
})(async (msg, conn) => {
    const url = msg.text;
    if (!url) return msg.reply('Please provide ttk url');
    msg.reply('wait...');
    const res = await axios.get(`https://diegoson-naxordeve.hf.space/tiktok?url=${url}`);
    if (res.data && res.data.data) {
        const data = res.data.data;
        const voidi = data.hdPlayUrl || data.playUrl;
        const video = await axios.get(voidi, { responseType: 'arraybuffer' });
        await msg.send({video: Buffer.from(video.data, 'binary'), mimetype: 'video/mp4', caption: `*Title:* ${data.title}\n*Music:* ${data.musicTitle}\n*By:* ${data.musicAuthor}`
        });
    }
});
