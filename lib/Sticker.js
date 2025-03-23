const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const sharp = require('sharp');
const config = require('../config');

const ff = path.join(__dirname, 'temp');
if (!fs.existsSync(ff)) fs.mkdirSync(ff, { recursive: true });

async function makeSticker(input, type) {
    try {
        const t = path.join(ff, `${Date.now()}`);
        const stk = `${t}.webp`;
        if (type.startsWith('image')) {
            await sharp(input)
                .resize(512, 512, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
                .webp({ lossless: false, quality: 100 }) 
                .toFile(stk);
        } else if (type.startsWith('video') || type.startsWith('gif')) {
            const vid = `${t}.mp4`;
            fs.writeFileSync(vid, input);
            await new Promise((resolve, reject) => {
                const cmd = `ffmpeg -i ${vid} -t 6 -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -fs 1M ${stk}`;
                exec(cmd, (err) => (err ? reject(err) : resolve()));
            });
            fs.unlinkSync(vid);
        }

        const sticker = fs.readFileSync(stk);
        fs.unlinkSync(stk);
        return sticker;
    } catch (err) {
        throw new Error(`${err.message}`);
    }
}

module.exports = { makeSticker };
