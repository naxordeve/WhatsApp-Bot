/*
Diegoson 
*/

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const sharp = require('sharp');
const webpMetadata = require('webp-metadata');
const config = require('../config'); 

const ff = path.join(__dirname, 'temp');
if (!fs.existsSync(ff)) {
    fs.mkdirSync(ff, { recursive: true });
}

async function makeSticker(input, type) {
    try { const voidi = path.join(ff, `${Date.now()}`);
        const out = `${voidi}.webp`;
        const pack = config.footer || "X Astral"; 
        const creator = config.footer || "Diegoson"; 
        if (type.startsWith('image')) {
            await sharp(input)
                .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .webp()
                .toFile(out);
        } else if (type.startsWith('video') || type.startsWith('gif')) {
            const vid = `${voidi}.mp4`;
            fs.writeFileSync(vid, input);
            await new Promise((resolve, reject) => {
                const cmd = `ffmpeg -i ${vid} -t 6 -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -fs 1M ${out}`;
                exec(cmd, (err) => (err ? reject(err) : resolve()));
            });
            fs.unlinkSync(vid);
        }

        await webpMetadata.write(out, { title: pack, author: creator });
        const sticker = fs.readFileSync(out);
        fs.unlinkSync(out);
        return sticker;
    } catch (err) {
        throw new Error(`${err.message}`);
    }
}

module.exports = { makeSticker };
