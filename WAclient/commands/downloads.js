const { Command } = require('../../lib/command');
var { monospace } = require('../../Functions');
const axios = require('axios');

Command({
    cmd_name: 'apk',
    category: 'media',
    desc: 'Download APK'
})(async (msg, conn) => {
    const query = msg.text;
    if (!query) return msg.reply('_Please provide app name_');
    msg.reply('Searching...');
        const apps = await search(query, 10);
        if (!apps || apps.length === 0) return;
        let list = '*Available Apps:*\n\n';
        apps.forEach((app, i) => {
            list += `${i + 1}. *${app.name}*\n`;
            list += `${monospace('Size:')} ${app.size}\n`;
            list += `${monospace('Version:')} ${app.version}\n`;
            list += `${monospace('Downloads:')} ${app.downloads}\n\n`;
        });
        list += '\n_Reply with the number to download_';
        await msg.reply(list);
        Command._ID_NUM(msg.sender, {
            callback: async (number, message) => {
                const app = apps[number - 1]
                    await message.send({image: { url: app.icon }, caption: `${monospace('*Name:*')} ${app.name}\n${monospace('*Package:*')} ${app.package}\n${monospace('*Size:*')} ${app.size}\n${monospace('*Version:*')} ${app.version}\n${monospace('*Downloads:*')} ${app.downloads}\n${monospace('*Rating:*')} ${app.rating}`});
                    const apkBuffer = await download(app.downloadUrl);
                    await message.send({document: apkBuffer, mimetype: 'application/vnd.android.package-archive', fileName: `${app.name}.apk`
                    });
            },
            valid: Array.from({length: apps.length}, (_, i) => i + 1)
        });
});

Command({
    cmd_name: 'fb',
    category: 'media',
    desc: 'Download Facebook video'
})(async (msg, args, conn) => {
    const url = msg.text;
    if (!url) return msg.reply('_Please provide fb url_');
    msg.reply('wait...');
        const res = await axios.get(`https://diegoson-naxordeve.hf.space/facebook?url=${url}`);
        if (res.data && res.data.data) {
            const data = res.data.data;
            const qualities = Object.keys(data);
            let list = '*Choose Qualities:*\n\n';
            qualities.forEach((quality, i) => {
                list += `${i + 1}. ${quality}\n`;
            });
            list += '\n_Reply with the number to download_';
            await msg.reply(list);
            Command._ID_NUM(msg.sender, {
                callback: async (number, message) => {
                    const quality = qualities[number - 1];
                    const vid = data[quality];
                        const video = await axios.get(vid, { responseType: 'arraybuffer' });
                        await message.send({video: Buffer.from(video.data, 'binary'),mimetype: 'video/mp4',caption: `*Quality:* ${quality}`
                        });
                },
                valid: Array.from({length: qualities.length}, (_, i) => i + 1)
            });
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
