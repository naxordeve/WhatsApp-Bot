const { Command } = require('../lib/command');
const fetch = require('node-fetch');
var config = require('../config');

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
                            
