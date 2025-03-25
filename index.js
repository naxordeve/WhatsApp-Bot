const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    Browsers
} = require('@whiskeysockets/baileys');
const axios = require('axios');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const { serialize } = require('./lib/serialize');
const fs = require('fs');
const { MultiAuth } = require("./lib/session");
const path = require('path');
const config = require('./config');
const { getCommand } = require('./lib/command');
const { plugins } = require('./WAclient/commands'); 

const sessionDir= path.join(__dirname, "lib", "auth");
if (!fs.existsSync(sessionDir)) {
fs.mkdirSync(sessionDir, { recursive: true });}
const cred = path.join(sessionDir, "creds.json");
if (!fs.existsSync(cred)) {MultiAuth(config.SESSION_ID, cred);
}

async function startBot() {
    const { state, saveCreds } = await useMultiFileAuthState(sessionDir);
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
            plugins();
            const cnds = Object.keys(require('./WAclient/commands')).length;
            const start_up = `X ASTRAL ONLINE\n\nPLUGINS : ${cnds}\nPREFIX : ${config.PREFIX.source}\nVERSION : 4.0.0`;
            await conn.sendMessage(conn.user.id, { text: start_up });
            console.log('Bot connected.');
        } else if (connection === 'close') {
            if ((lastDisconnect?.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut) {
                startBot();
            }
        }
    });

    conn.ev.on('creds.update', saveCreds);
    
    conn.ev.on('messages.upsert', async (m) => {
        const msg = await serialize(conn, m.messages[0]);
        const { PREFIX } = config;
        const { get_flag } = require('./lib/DB/autonum');
        if (get_flag(msg)) return;            
        if (msg.body && msg.body.startsWith('$')) {
            if (msg.fromMe || msg.sender.split('@')[0] === config.OWNER_NUM || config.MODS.includes(msg.sender.split('@')[0])) {
                try { 
                  let evaled = await eval(`(async () => { ${msg.body.slice(1)}})()`); 
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled);
                    await msg.reply(`${evaled}`);
                } catch (err) {
                    await msg.reply(`${err}`);
                }
                return;
            }
        } 
        
        else if (msg.body && (typeof PREFIX === "string" ? msg.body.startsWith(PREFIX) : PREFIX.test(msg.body))) {
            if (config.WORKTYPE === 'private' && !(msg.fromMe || msg.sender.split('@')[0] === config.OWNER_NUM || config.MODS.includes(msg.sender.split('@')[0]))) {
                return;
            }
            const cm = msg.cmd.slice(1);
            const command = getCommand(cm);
            if (command) {
                try { 
                    await command.callback(msg, msg.args, conn);
                } catch (err) {
                    console.error(`${cm}:`, err);
                }
            }
        }
    });
}

startBot(); 
