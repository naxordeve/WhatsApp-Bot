
const { Command } = require('../../lib/command');

Command({
    cmd_name: 'text',
    category: 'events',
    desc: 'Handles text messages'
})(async (msg, conn) => {
    // Your message handling code here
    // This will run for every message
    console.log('New message:', msg.body);
});
