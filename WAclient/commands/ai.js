$const { Command } = require('../../lib/command');
const axios = require('axios');

Command({
    cmd_name: 'lma',
    category: 'ai',
    desc: 'Chat with Llama AI'
})(async (msg, conn) => {
    const query = msg.text;
    if (!query) return msg.reply('_Please provide a query_');

    const res = await axios.get(`https://nikka-api.vercel.app/ai/llama?q=${encodeURIComponent(query)}`);

    if (res.data && res.data.data) {
        await msg.reply(res.data.data);
    } else {
        await msg.reply('_No response from AI_');
    }
});
