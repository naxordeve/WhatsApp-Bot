const styles = {
    style1: (text) => text.split('').map(c => c + '\u0336').join(''),
    style2: (text) => text.split('').map(c => c + '\u0305').join(''),
    style3: (text) => text.split('').map(c => c + '\u033F').join(''),
    style4: (text) => text.split('').map(c => c + '\u0332').join(''),
    style5: (text) => text.split('').join('\u033D'),
    style6: (text) => text.split('').map(c => c + '\u0308').join(''),
    style7: (text) => text.split('').map(c => c + '\u033E').join(''),
    style8: (text) => text.split('').map(c => c + '\u0324').join(''),
    style9: (text) => text.split('').join('\u0353'),
    style10: (text) => text.split('').map(c => c + '\u0337').join(''),
    style11: (text) => text.split('').map(c => `${c}\u0303`).join(''),
    style12: (text) => text.split('').map(c => `${c}\u033A`).join(''),
    style13: (text) => text.split('').map(c => `${c}\u0346`).join(''),
    style14: (text) => text.split('').map(c => `${c}\u034B`).join(''),
    style15: (text) => text.split('').map(c => `${c}\u034D`).join(''),
    style16: (text) => text.split('').map(c => `${c}\u0350`).join(''),
    style17: (text) => text.split('').map(c => `${c}\u0351`).join(''),
    style18: (text) => text.split('').map(c => `${c}\u0352`).join(''),
    style19: (text) => text.split('').map(c => `${c}\u0354`).join(''),
    style20: (text) => text.split('').map(c => `${c}\u0355`).join('')
};

function getFancyText(text, style = 1) {
    const styleFunc = styles[`style${style}`];
    if (!styleFunc) return text;
    return styleFunc(text);
}

function listStyles(text = 'X ASTRAL') {
    let result = '*╭╼【 FANCY TEXT 】*\n\n';
    Object.keys(styles).forEach((style, i) => {
        result += `${i + 1}. ${styles[style](text)}\n`;
    });
    result += '\n_Reply with number to use style_';
    return result;
}

module.exports = { getFancyText, listStyles };
