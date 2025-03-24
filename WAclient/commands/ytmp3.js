const { Command } = require('../../lib/command');
const axios = require('axios');

Command({
    cmd_name: "ytmp3",
    category: "downloader",
    desc: "Download audio from YouTube"
})( async (msg, args, conn) => {
    if (!args[0]) return msg.reply("Please provide a YouTube URL!");
    
    try {
        const url = args[0];
        msg.reply("⏳ Processing your request...");

        const options = {
            method: 'GET',
            url: 'https://youtube-mp3-downloader2.p.rapidapi.com/ytmp3/ytmp3/',
            params: {
                url: url
            },
            headers: {
                'X-RapidAPI-Key': 'YOUR-RAPIDAPI-KEY-HERE',
                'X-RapidAPI-Host': 'youtube-mp3-downloader2.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        
        if (response.data && response.data.link) {
            const audioUrl = response.data.link;
            const audioData = await axios.get(audioUrl, {
                responseType: 'arraybuffer'
            });

            await msg.send({
                audio: Buffer.from(audioData.data, 'binary'),
                mimetype: 'audio/mp4',
                ptt: false,
                caption: `🎵 Downloaded using ${config.BOT_NAME}`
            });
        } else {
            msg.reply("❌ Failed to fetch audio. Please try another URL.");
        }

    } catch (error) {
        console.error(error);
        msg.reply("❌ An error occurred while processing your request.");
    }
});