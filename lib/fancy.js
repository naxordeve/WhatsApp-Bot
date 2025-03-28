const zalgoz = {
    up: ['̍', '̎', '̄', '̅', '̿', '̑', '̐', '͒', '͗', '͑', '̇', '̈', '̊', '͂', '̓', '̈́', '͆', '̋', '̏', '̽', '̉', 'ͣ', 'ͤ', 'ͥ', 'ͦ', 'ͧ', 'ͨ', 'ͩ', 'ͪ', 'ͫ', 'ͬ', 'ͭ', 'ͮ', 'ͯ'],
    down: ['̖', '̗', '̘', '̙', '̜', '̝', '̞', '̟', '̠', '̤', '̥', '̦', '̩', '̪', '̫', '̬', '̭', '̮', '̯', '̰', '̱', '̲', '̳', '̹', '̺', '̻', '̼', 'ͅ', '͇', '͈', '͉', '͍', '͎', '͓', '͚'],
};

function zalgo(text) {
    return text.split('').map(c => c + zalgoz.up[Math.floor(Math.random() * zalgoz.up.length)] + zalgoz.down[Math.floor(Math.random() * zalgoz.down.length)]).join('');
}

const styles = {
    style1: (text) => text.split('').map(c => c + '\u0336').join(''),
    style2: (text) => text.split('').map(c => c + '\u0305').join(''), 
    style3: (text) => text.split('').map(c => c + '\u033F').join(''),
    style4: (text) => text.split('').map(c => c + '\u0332').join(''),
    style5: (text) => text.split('').join('\u033D'),
    style6: (text) => text.split('').map(c => c + '\u0308').join(''),
    style7: (text) => `*${text}*`, 
    style8: (text) => `_${text}_`, 
    style9: (text) => '```' + text + '```', 
    style10: (text) => text.split('').reverse().join(''), 
    style11: (text) => text.toUpperCase(),
    style12: (text) => text.toLowerCase(),
    style13: (text) => text.split('').join(' '),
    style14: (text) => text.split('').map(c => c + '\u0337').join(''),
    style15: (text) => text.split('').map(c => c + '\u0324').join(''), 
    style16: (text) => text.split('').map(c => c.replace(/[a-zA-Z]/g, c => "𝗮𝗯𝗰𝗱𝗲𝗳𝗴𝗵𝗶𝗷𝗸𝗹𝗺𝗻𝗼𝗽𝗾𝗿𝘀𝘁𝘶𝘷𝘄𝘅𝘆𝘇𝗔𝗕𝗖𝗗𝗘𝗙𝗚𝗛𝗜𝗝𝗞𝗟𝗠𝗡𝗢𝗣𝗤𝗥𝗦𝗧𝗨𝗩𝗪𝗫𝗬𝗭"["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c)])).join(''), 
    style17: (text) => text.split('').map(c => c.replace(/[a-zA-Z]/g, c => "𝖆𝖇𝖈𝖉𝖊𝖋𝖌𝖍𝖎𝖏𝖐𝖑𝖒𝖓𝖔𝖕𝖖𝖗𝖘𝖙𝖚𝖛𝖜𝖝𝖞𝖟𝕬𝕭𝕮𝕯𝕰𝕱𝕲𝕳𝕴𝕵𝕶𝕷𝕸𝕹𝕺𝕻𝕼𝕽𝕾𝕿𝖀𝖁𝖂𝖃𝖄𝖅"["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c)])).join(''), 
    style18: (text) => text.split('').map(c => c.replace(/[a-zA-Z]/g, c => "𝒶𝒷𝒸𝒹𝑒𝒻𝑔𝒽𝒾𝒿𝓀𝓁𝓂𝓃𝑜𝓅𝓆𝓇𝓈𝓉𝓊𝓋𝓌𝓍𝓎𝓏𝒜ℬ𝒞𝒟𝒠𝒡𝒢𝒣𝒥𝒦𝒧𝒪𝒫𝒬𝒭𝒮𝒯𝒰𝒱𝒲𝒳𝒴𝒵"["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c)])).join(''), 
    style19: (text) => text.split('').map(c => c.replace(/[a-zA-Z]/g, c => "𝓪𝓫𝓬𝓭𝓮𝓯𝓰𝓱𝓲𝓳𝓴𝓵𝓶𝓷𝓸𝓹𝓺𝓻𝓼𝓽𝓾𝓿𝔀𝔁𝔂𝔃𝓐𝓑𝓒𝓓𝓔𝓕𝓖𝓗𝓘𝓙𝓚𝓛𝓜𝓝𝓞𝓟𝓠𝓡𝓢𝓣𝓤𝓥𝓦𝓧𝓨𝓩"["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c)])).join(''), 
    style20: (text) => text.split('').map(c => c.replace(/[a-zA-Z]/g, c => "𝕒𝕓𝕔𝕕𝕖𝕗𝕘𝕙𝕚𝕛𝕜𝕝𝕞𝕟𝕠𝕡𝕢𝕣𝕤𝕥𝕦𝕧𝕨𝕩𝕪𝕫𝔸𝔹ℂ𝔻𝔼𝔽𝔾ℍ𝕀𝕁𝕂𝕃𝕄ℕ𝕆ℙℚℝ𝕊𝕋𝕌𝕍𝕎𝕏𝕐ℤ"["abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(c)])).join(''),
    style21: (text) => text.split('').map(c => "⁰¹²³⁴⁵⁶⁷⁸⁹abcdefghijklmnopqrstuvwxyz".includes(c.toLowerCase()) ? "⁰¹²³⁴⁵⁶⁷⁸⁹ᵃᵇᶜᵈᵉᶠᵍʰᶦʲᵏˡᵐⁿᵒᵖᵠʳˢᵗᵘᵛʷˣʸᶻ"["0123456789abcdefghijklmnopqrstuvwxyz".indexOf(c.toLowerCase())] : c).join(''), 
    style22: (text) => text.split('').map(c => "₀₁₂₃₄₅₆₇₈₉ₐₑₓₕₖₘₙₒₚₛₜₕ".includes(c.toLowerCase()) ? "₀₁₂₃₄₅₆₇₈₉ₐₑₓₕₖₘₙₒₚₛₜₕ"["0123456789aexhkmnopsth".indexOf(c.toLowerCase())] : c).join(''),
    style23: (text) => zalgo(text), 
    style24: (text) => text.split('').map(c => c + '\u0354').join(''), 
    style25: (text) => text.split('').map(c => c + '\u0355').join('') 
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
    result += '\n_eg fancy 1 naxor_';
    return result;
}

module.exports = { getFancyText, listStyles };
