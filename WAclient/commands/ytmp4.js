
const { Command } = require('../../lib/command');
const axios = require('axios');

Command({
    cmd_name: "ytmp4",
    category: "downloader",
    desc: "Download video from YouTube"
})( async (msg, args, conn) => {
    if (!args[0]) return msg.reply("Please provide a YouTube URL!");
    
    try {
        const url = args[0];
        msg.reply("⏳ Processing your request...");

        const options = {
            method: 'GET',
            url: 'https://youtube-video-download-info.p.rapidapi.com/dl',
            params: {
                id: url.split('v=')[1]
            },
            headers: {
                'X-RapidAPI-Key': 'YOUR-RAPIDAPI-KEY-HERE',
                'X-RapidAPI-Host': 'youtube-video-download-info.p.rapidapi.com'
            }
        };

        const response = await axios.request(options);
        
        if (response.data && response.data.formats) {
            const videoFormat = response.data.formats.find(f => f.qualityLabel === '720p') || response.data.formats[0];
            const videoUrl = videoFormat.url;
            
            const videoData = await axios.get(videoUrl, {
                responseType: 'arraybuffer'
            });

            await msg.send({
                video: Buffer.from(videoData.data, 'binary'),
                mimetype: 'video/mp4',
                caption: `🎥 Title: ${response.data.title}\n📱 Quality: ${videoFormat.qualityLabel}`
            });
        } else {
            msg.reply("❌ Failed to fetch video. Please try another URL.");
        }

    } catch (error) {
        console.error(error);
        msg.reply("❌ An error occurred while processing your request.");
    }
});
