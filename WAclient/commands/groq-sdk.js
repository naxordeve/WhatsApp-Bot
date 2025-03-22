
const { Command } = require('../../lib/commands');
var config = require('../../config');
const Groq = require('groq-sdk');
const groq = new Groq({ apiKey: config.GROK_API });


function getModel() {
    const models = [
        'llama-3.1-70b-versatile',
        'llama-3.1-405b-reasoning',
        'llama-3-8b-8192',
        'llama-3-70b-8192',
        'mixtral-8x7b-32768',
        'gemma-7b-it',
        'gemma2-9b-it',
        'llava-v1.5-7b'
    ];
    return models[Math.floor(Math.random() * models.length)];
}

Command({
    command: 'groq',
    category: 'ai',
    desc: 'Ask GROQ',
    async execute(msg, { conn }) {
        if (msg.quoted?.msg?.imageMessage) {
            const media = await msg.quoted.download(); 
            const completion = await groq.chat.completions.create({
                messages: [
                    {
                        role: 'user',
                        content: [
                            { type: 'image_url', image_url: media }, 
                            { type: 'text', text: 'Analyze this image in detail' }
                        ]
                    }
                ],
                model: getModel(),
                temperature: 0.7,
                max_tokens: 1024,
            });

            const response = completion.choices[0]?.msg?.content || 'ooops';
            return await msg.reply(response);
        }

        const q = msg.args.slice(1).join(' ');
        if (!q) return msg.reply('Please provide a q');
        const v = await groq.chat.completions.create({
            messages: [{ role: 'user', content: q }],
            model: getModel(),
            temperature: 0.7,
            max_tokens: 1024,
        });

        const res = v.choices[0]?.msg?.content || 'nah';
        await msg.reply(res);
    }
});
