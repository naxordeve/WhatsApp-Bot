const fs = require('fs');
const sharp = require('sharp');
const { exec } = require('child_process');

function monospace(text) {
    return `\`\`\`${text}\`\`\``;
}

async function createSticker(media, mime) {
    try {
        const stickerFileName = `./temp/${Date.now()}.webp`;

        if (mime.split("/")[0] === "image") {
            await sharp(media)
                .resize(512, 512, {
                    fit: 'contain',
                    background: { r: 0, g: 0, b: 0, alpha: 0 }
                })
                .webp()
                .toFile(stickerFileName);
        } else {
            const tempInput = `./temp/${Date.now()}.mp4`;
            fs.writeFileSync(tempInput, media);
            
            await new Promise((resolve, reject) => {
                exec(`ffmpeg -i ${tempInput} -vf "scale=512:512:force_original_aspect_ratio=decrease,format=rgba,pad=512:512:(ow-iw)/2:(oh-ih)/2:color=#00000000" -t 10 -fs 1M ${stickerFileName}`, (error) => {
                    fs.unlinkSync(tempInput);
                    if (error) reject(error);
                    else resolve();
                });
            });
        }

        const stickerBuffer = fs.readFileSync(stickerFileName);
        fs.unlinkSync(stickerFileName);
        return stickerBuffer;
    } catch (error) {
        throw error;
    }
}

module.exports = { monospace, createSticker };
