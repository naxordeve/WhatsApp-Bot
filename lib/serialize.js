const { proto, getContentType, downloadContentFromMessage, jidNormalizedUser } = require('@whiskeysockets/baileys');

const serialize = async (conn, msg) => {
    if (msg.key) {
        msg.id = msg.key.id;
        msg.user = msg.key.remoteJid;
        msg.fromMe = msg.key.fromMe;
        msg.isGroup = msg.user.endsWith('@g.us');
        msg.sender = msg.isGroup && msg.key.participant ? jidNormalizedUser(msg.key.participant) : jidNormalizedUser(msg.user);
       if (msg.message) {
        msg.type = getContentType(msg.message);
        msg.body = msg.message.conversation || 
                   msg.message.extendedTextMessage?.text || 
                   msg.message.imageMessage?.caption || 
                   msg.message.videoMessage?.caption || 
                   msg.message.documentMessage?.caption || 
                   msg.message.viewOnceMessageV2?.message?.imageMessage?.caption ||
                   msg.message.viewOnceMessageV2?.message?.videoMessage?.caption || '';

        const [cmd, ...args] = msg.body.trim().split(/ +/);
        msg.cmd = cmd;
        msg.args = args;
        msg.text = args.join(' ');
        if (msg.isGroup) {
            try {
                let retries = 0;
                const tired = 3;
                const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));
                while (retries < tired) {
                    try {
                        const groupMetadata = await conn.groupMetadata(msg.user);
                        msg.groupMetadata = groupMetadata;
                        msg.groupName = groupMetadata.subject;
                        msg.groupDesc = groupMetadata.desc;
                        msg.groupMembers = groupMetadata.participants;
                        msg.groupAdmins = groupMetadata.participants.filter(p => p.admin).map(p => p.id);
                        msg.isAdmin = msg.groupAdmins.includes(msg.sender);
                        msg.isBotAdmin = msg.groupAdmins.includes(conn.user.id);
                        msg.participants = groupMetadata.participants.map(u => u.id);
                        msg.mentions = msg.body.match(/@(\d*)/g)?.map(x => x.split('@')[1] + '@s.whatsapp.net') || [];
                        break;
                    } catch (error) {
                        retries++;
                        if (retries < tired) {
                            await delay(1000 * retries);
                            continue;
                        }
                        throw error;
                    }
                }
            } catch (error) {
                console.error(error);
                msg.groupMetadata = {};
                msg.groupName = '';
                msg.groupDesc = '';
                msg.groupMembers = [];
                msg.groupAdmins = [];
                msg.isAdmin = false;
                msg.isBotAdmin = false;
                msg.participants = [];
                msg.mentions = [];
            }
          }
       }

        msg.reply = async (content, options = {}) => {
            if (typeof content === 'string') {
                return conn.sendMessage(msg.user, { text: content }, { quoted: msg });
            }
            return conn.sendMessage(msg.user, content, { quoted: msg });
        };

        msg.send = async (content, options = {}) => {
            if (typeof content === 'string') {
                content = { text: content };
            }
            const sent = await conn.sendMessage(msg.user, content, options);
             if (sent.key) {
                await conn.sendMessage(msg.user, {
                    react: {text: "✅", key: sent.key }
                });
            }
            return sent;
        };

        msg.react = async (emoji = '✅') => {
            await conn.sendMessage(msg.user, {
                react: {
                    text: emoji,
                    key: msg.key
                }
            });
        };

        msg.groupClose = async () => {
            if (!msg.isGroup) return;
            if (!msg.isAdmin && !msg.fromMe) return;
            if (!msg.isBotAdmin) throw new Error('Bot not admin');
            await conn.groupSettingUpdate(msg.user, 'announcement');
            return '_Group closed_';
        };

        msg.groupOpen = async () => {
            if (!msg.isGroup) return;
            if (!msg.isAdmin && !msg.fromMe) return;
            if (!msg.isBotAdmin) throw new Error('Bot not admin');
            await conn.groupSettingUpdate(msg.user, 'not_announcement');
            return '_Group opened_';
        };

        msg.promote = async (user = msg.quoted?.sender || msg.mentions[0]) => {
            if (!msg.isGroup) return;
            if (!msg.isAdmin && !msg.fromMe) return;
            if (!msg.isBotAdmin) throw new Error('Bot not admin');
            if (!user) throw new Error('No user specified');
            await conn.groupParticipantsUpdate(msg.user, [user], 'promote');
            return `@${user.split('@')[0]} promoted to admin`;
        };

        msg.demote = async (user = msg.quoted?.sender || msg.mentions[0]) => {
            if (!msg.isGroup) return;
            if (!msg.isAdmin && !msg.fromMe) return;
            if (!msg.isBotAdmin) throw new Error('Bot not admin');
            if (!user) throw new Error('No user specified');
            await conn.groupParticipantsUpdate(msg.user, [user], 'demote');
            return `@${user.split('@')[0]} demoted to member`;
        };

        msg.kick = async (user = msg.quoted?.sender || msg.mentions[0]) => {
            if (!msg.isGroup) return;
            if (!msg.isAdmin && !msg.fromMe) return;
            if (!msg.isBotAdmin) throw new Error('Bot not admin');
            if (!user) throw new Error('No user specified');
            await conn.groupParticipantsUpdate(msg.user, [user], 'remove');
            return `@${user.split('@')[0]} kicked from group`;
        };

        msg.add = async (number) => {
            if (!msg.isGroup) return;
            if (!msg.isAdmin && !msg.fromMe) return;
            if (!msg.isBotAdmin) throw new Error('Bot not admin');
            const user = (number || msg.text).replace(/[^0-9]/g, '') + '@s.whatsapp.net';
            try { const res = await conn.groupParticipantsUpdate(msg.user, [user], 'add');
                if (res[0].status === "409") {
                    const code = await conn.groupInviteCode(msg.user);
                    return `Cannot add directly\nInvite link: https://chat.whatsapp.com/${code}`;
                }
                return `@${user.split('@')[0]} added to group`;
            } catch (error) {
                const code = await conn.groupInviteCode(msg.user);
                return `Failed to add\nInvite link: https://chat.whatsapp.com/${code}`;
            }
        };

        msg.revoke = async () => {
            if (!msg.isGroup) return;
            if (!msg.isAdmin && !msg.fromMe) return;
            if (!msg.isBotAdmin) throw new Error('Bot not admin');
            await conn.groupRevokeInvite(msg.user);
            return 'Group link revoked';
        };

        msg.getGroupLink = async () => {
            if (!msg.isGroup) return;
            if (!msg.isBotAdmin) return;
            const code = await conn.groupInviteCode(msg.user);
            return `https://chat.whatsapp.com/${code}`;
        };

        if (msg.message.extendedTextMessage?.contextInfo?.quotedMessage) {
            msg.quoted = {
                message: msg.message.extendedTextMessage.contextInfo.quotedMessage,
                sender: jidNormalizedUser(msg.message.extendedTextMessage.contextInfo.participant),
                fromMe: msg.message.extendedTextMessage.contextInfo.participant === conn.user.id,
                type: getContentType(msg.message.extendedTextMessage.contextInfo.quotedMessage),
            };

            msg.quoted.download = async () => {
                const type = msg.quoted.type;
                if (!msg.quoted.message[type]) return null;
                return downloadContentFromMessage(msg.quoted.message[type], type.split('Message')[0]);
            };
        }

        if (msg.type === 'viewOnceMessageV2' && msg.message.viewOnceMessageV2?.message) {
            msg.viewOnce = {
                type: getContentType(msg.message.viewOnceMessageV2.message),
                message: msg.message.viewOnceMessageV2.message
            };
        }

        msg.download = async () => {
            const type = msg.type === 'viewOnceMessageV2' 
                ? getContentType(msg.message.viewOnceMessageV2.message)
                : msg.type;

            if (!msg.message[type] && !(msg.message.viewOnceMessageV2?.message?.[type])) {
                return null;
            }

            return downloadContentFromMessage(
                msg.type === 'viewOnceMessageV2' 
                    ? msg.message.viewOnceMessageV2.message[type] 
                    : msg.message[type], 
                type.split('Message')[0]
            );
        };
    }

    return msg;
};

module.exports = { serialize };
