/*
Diegoson 
*/

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const sharp = require('sharp');
const webp = require('node-webpmux');
const config = require('../config');

const ff = path.join(__dirname, 'temp');
if (!fs.existsSync(ff)) fs.mkdirSync(ff, { recursive: true });
async function makeSticker(input, type) {
    try {
        const v = path.join(ff, `${Date.now()}`);
        const stk = `${v}.webp`;
        const final = `${v}_meta.webp`;
        const packName = config.footer || "X Astral";
        const authorName = config.footer || "Diegoson";
        if (type.startsWith('image')) {
            await sharp(input)
                .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .webp()
                .toFile(stk);
        } else if (type.startsWith('video') || type.startsWith('gif')) {
            const vid = `${v}.mp4`;
            fs.writeFileSync(vid, input);
            await new Promise((resolve, reject) => {
                const cmd = `ffmpeg -i ${vid} -t 6 -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -fs 1M ${stk}`;
                exec(cmd, (err) => (err ? reject(err) : resolve()));
            });
            fs.unlinkSync(vid);
        }

        const img = new webp.Image();
        await img.load(stk);
        const metadata = {
            "sticker-pack-id": "https://github.com/naxordeve/whatsapp-bot", 
            "sticker-pack-name": packName,
            "sticker-pack-publisher": authorName,
            "emojis": [""]
        };

        const db = Buffer.concat([
            Buffer.from("RIFF"),
            Buffer.from((JSON.stringify(metadata).length + 22).toString(16), "hex"),
            Buffer.from("WEBPVP8X"),
            Buffer.from(JSON.stringify(metadata))
        ]);

        img.exif = db;
        await img.save(final);
        const sticker = fs.readFileSync(final);
        fs.unlinkSync(stk);
        fs.unlinkSync(final);

        return sticker;
    } catch (err) {
        throw new Error(`${err.message}`);
    }
}

module.exports = { makeSticker };
