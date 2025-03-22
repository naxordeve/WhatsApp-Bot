const { Command } = require('./lib/command');
const fetch = require('node-fetch');
var config = require('./config');

Command({
    cmd_name: 'groq',
    category: 'AI',
    desc: 'Generate AI responses using Groq API'
})(async (msg) => {
    if (!config.GROK_API) return msg.reply("Groq API key is missing");
    var m = msg.text;
    if (!m) return msg.reply("Please provide a message");
    const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: { "Content-Type": "application/json", "Authorization": `Bearer ${config.GROK_API}` },
        body: JSON.stringify({ model: "llama-3.3-70b-versatile", messages: [{ role: "user", content: m }] })
    });

    const data = await res.json();
    msg.reply(data.choices?.[0]?.message?.content?.trim() || "oops");
});
