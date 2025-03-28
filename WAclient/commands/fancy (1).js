
const { Command } = require('../../lib/command');
const { getFancyText, listStyles } = require('../../lib/fancy');

Command({
    cmd_name: 'fancy',
    aliases: ['style', 'stylish'],
    category: 'converter',
    desc: 'Convert text to fancy styles'
})(async (msg, args, client) => {
    if (!args.length) {
        return msg.reply(listStyles());
    }

    const style = parseInt(args[0]);
    if (!isNaN(style) && style >= 1 && style <= 20) {
        const text = args.slice(1).join(' ');
        if (!text) return msg.reply('Please provide text to convert!');
        return msg.reply(getFancyText(text, style));
    }

    return msg.reply(getFancyText(args.join(' ')));
});
