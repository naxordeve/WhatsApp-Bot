const { Command } = require('../../lib/command');
const axios = require('axios');
const fetch = require('node-fetch');
var config = require('../../config');

Command({
    cmd_name: 'groq',
    category: 'AI',
    desc: 'Generate AI response'
})(async (msg) => {
    if (!config.GROK_API) return msg.reply("Groq API key is missing");
    const m = msg.text;
    if (!m) return msg.reply("Please provide a message");
    const v = await msg.send("Processing...");
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST", headers: { "Content-Type": "application/json", "Authorization": `Bearer ${config.GROK_API}` }, 
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: m }] })
    });
    const data = await res.json();
    if (data.choices?.[0]?.message?.content?.trim()) 
        await msg.send({ text: data.choices[0].message.content.trim(), edit: v.key });
});
Command({
    cmd_name: 'llama',
    category: 'AI',
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
Command({
    cmd_name: 'gemini',
    category: 'ai',
    desc: 'Chat with Gemini AI'
})(async (msg, conn) => {
    const query = msg.text;
    if (!query) return msg.reply('_Please provide a query_');

    const res = await axios.get(`https://nikka-api.vercel.app/ai/gemini?q=${encodeURIComponent(query)}&apiKey=nikka`);

    if (res.data && res.data.response) {
        await msg.reply(res.data.response);
    } else {
        await msg.reply('_No response from AI_');
    }
});
