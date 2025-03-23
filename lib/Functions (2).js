const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const sharp = require('sharp');

function extractUrl(text) {
    const ur = /(https?:\/\/[^\s]+)/g;
    const matches = text.match(ur);
    return matches ? matches[0] : null;
}

function monospace(input) {
    const boldz = {
        'A': '𝙰', 'B': '𝙱', 'C': '𝙲', 'D': '𝙳', 'E': '𝙴', 'F': '𝙵', 'G': '𝙶',
        'H': '𝙷', 'I': '𝙸', 'J': '𝙹', 'K': '𝙺', 'L': '𝙻', 'M': '𝙼', 'N': '𝙽',
        'O': '𝙾', 'P': '𝙿', 'Q': '𝚀', 'R': '𝚁', 'S': '𝚂', 'T': '𝚃', 'U': '𝚄',
        'V': '𝚅', 'W': '𝚆', 'X': '𝚇', 'Y': '𝚈', 'Z': '𝚉',
        '0': '𝟎', '1': '𝟏', '2': '𝟐', '3': '𝟑', '4': '𝟒', '5': '𝟓', '6': '𝟔',
        '7': '𝟕', '8': '𝟖', '9': '𝟗',
        ' ': ' ' 
    };

    return input.split('').map(char => boldz[char] || char).join('');
}
async function makeSticker(buffer, type) {
    try {
        const tempDir = path.join(__dirname, 'temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        const t = path.join(tempDir, `${Date.now()}`);
        const out = `${t}.webp`;
        if (type.startsWith('image')) {
            await sharp(buffer)
                .resize(512, 512, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .webp()
                .toFile(out);
        } else if (type.startsWith('video')) {
            const i = `${t}.mp4`;
            fs.writeFileSync(i, buffer);
            await new Promise((resolve, reject) => {
                const cmd = `ffmpeg -i ${i} -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -t 10 -fs 1M ${out}`;
                exec(cmd, (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });
            fs.unlinkSync(i);
        }

        const sticker = fs.readFileSync(out);
        fs.unlinkSync(out);
        return sticker;
    } catch (error) {
        throw new Error(`${error.message}`);
    }
}

module.exports = { monospace, makeSticker, extractUrl  };
