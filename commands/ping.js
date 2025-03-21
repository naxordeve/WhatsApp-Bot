
const { Command } = require('../lib/command');

Command({
    cmd_name: 'ping',
    category: 'core',
    desc: 'Check bot response time'
})(async (msg) => {
    const start = Date.now();
    const reply = await msg.reply('Testing ping...');
    const end = Date.now();
    
    await reply.edit(`Pong! 🏓\nResponse time: ${end - start}ms`);
    await msg.react('✨');
});
