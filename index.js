
const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    Browsers
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const { serialize } = require('./lib/serialize');
const fs = require('fs');
const path = require('path');

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState('auth');
    const conn = makeWASocket({
        printQRInTerminal: false,
        auth: state,
        logger: pino({ level: 'silent' }),
        browser: Browsers.macOS("Chrome"),
        downloadHistory: false,
        syncFullHistory: false,
        markOnlineOnConnect: false, 
        generateHighQualityLinkPreview: true
    });

    conn.ev.on('connection.update', async (update) => {
        const { connection, lastDisconnect } = update;
        if (connection === 'open') {
            console.log('Loading...');
            const com = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
            for (const file of com) {
                require(`./commands/${file}`);
            } console.log('cmds loaded');
        } else if (connection === 'close') {
            const off = (lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut;
            if (off) {
                startBot();
            }
        }
    });

    conn.ev.on('creds.update', saveCreds)
    
    conn.ev.on('messages.upsert', async (m) => {
        const msg = await serialize(conn, m.messages[0]);
        const { prefix } = require('./config');
        if (msg.body && msg.body.startsWith('$')) {
            if (msg.fromMe || msg.sender.split('@')[0] === config.owner_num || config.mods.includes(msg.sender.split('@')[0])) {
                try { let evaled = await eval(msg.body.slice(1));
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                    await msg.reply(`${evaled}`);
                } catch (err) {
                    await msg.reply(`${err}`);
                }
                return;
            }
        } else if (msg.body && prefix.test(msg.body)) {
            if (config.workType === 'private' && !(msg.fromMe || msg.sender.split('@')[0] === config.owner_num || config.mods.includes(msg.sender.split('@')[0]))) {
                return;
            }
            const cm = msg.cmd.slice(1);
            const command = getCommand(cm);
            if (command) {
                try { await command.callback(msg, msg.args, conn);
                } catch (err) {
                    console.error(`${cm}:`, err);
                }
            }
        }
    });
}

startBot();
