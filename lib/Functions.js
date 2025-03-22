const fs = require('fs');
const { exec } = require('child_process');
const sharp = require('sharp');

function monospace(text) {
    return `\`\`\`${text}\`\`\``;
}

async function createSticker(buffer, type) {
    try {
        const tempPath = `./temp/${Date.now()}`;
        const outputPath = `${tempPath}.webp`;

        if (type.startsWith('image')) {
            await sharp(buffer)
                .resize(512, 512, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .webp()
                .toFile(outputPath);
        } else if (type.startsWith('video')) {
            const inputPath = `${tempPath}.mp4`;
            fs.writeFileSync(inputPath, buffer);

            await new Promise((resolve, reject) => {
                const cmd = `ffmpeg -i ${inputPath} -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -t 10 -fs 1M ${outputPath}`;
                exec(cmd, (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });
            fs.unlinkSync(inputPath);
        }

        const sticker = fs.readFileSync(outputPath);
        fs.unlinkSync(outputPath);
        return sticker;
    } catch (error) {
        throw new Error(`Error creating sticker: ${error.message}`);
    }
}

module.exports = { monospace, createSticker };