var { Command } = require('../../lib/command');


Command({
    cmd_name: 'ping',
    category: 'core',
    desc: 'Check bot response'
})(async (msg) => {
    const start = Date.now();
    const reply = await msg.reply('ping...');
    const end = Date.now();
    await msg.send({ edit: reply.key, text: `!Pong ${end - start}ms` });
});
