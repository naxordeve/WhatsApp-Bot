
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const { serialize } = require('./lib/serialize');
const fs = require('fs');
const path = require('path');
const config = require('./lib/config');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    
    const sock = makeWASocket({
        printQRInTerminal: true,
        auth: state,
        logger: pino({ level: 'silent' })
    });

    sock.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        
        if (connection === 'open') {
            console.log('Loading commands...');
            const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for (const file of commandFiles) {
                require(`./commands/${file}`);
            }
            console.log('Commands loaded!');
        } else if (connection === 'close') {
            const shouldReconnect = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            
            if (shouldReconnect) {
                startBot();
            }
        }
    });

    sock.ev.on('creds.update', saveCreds);

    sock.ev.on('messages.upsert', async (m) => {
        const msg = await serialize(sock, m.messages[0]);
        
        const { prefix } = require('./lib/config');
        if (msg.body && msg.body.startsWith('$')) {
            if (msg.fromMe || msg.sender.split('@')[0] === config.ownerNumber || config.moderators.includes(msg.sender.split('@')[0])) {
                try {
                    let evaled = await eval(msg.body.slice(1));
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                    await msg.reply(`${evaled}`);
                } catch (err) {
                    await msg.reply(`Error: ${err}`);
                }
                return;
            }
        } else if (msg.body && prefix.test(msg.body)) {
            if (config.workType === 'private' && !(msg.fromMe || msg.sender.split('@')[0] === config.ownerNumber || config.moderators.includes(msg.sender.split('@')[0]))) {
                return;
            }
            console.log(`New command from ${msg.sender}: ${msg.body}`);
            
            const cmdName = msg.cmd.slice(1); // Remove the first character (prefix)
            const command = getCommand(cmdName);
            
            if (command) {
                try {
                    await command.callback(msg, msg.args, sock);
                } catch (err) {
                    console.error(`Error executing command ${cmdName}:`, err);
                    await msg.reply('Error executing command.');
                }
            }
        }
    });
}

startBot();
