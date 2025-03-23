const fs = require('fs')
const { writeFile } = require('fs/promises')
var config = require('../config')
const PastebinAPI = require("pastebin-js"),
 pastebin = new PastebinAPI(config.PASTE_BIN_API);
module.exports = {
  async MultiAuth(session_id, authFile) {
    return new Promise((resolve, reject) => {
        code = session_id.replace(/_X_ASTRAL_/g, "");
      function _0x31d9(){var _0x4b6482=['127620RKgJAH','fail','11Udaosm','66lBpUCP','11156wYHzqZ','from','8Lgojwc','1634283UYfSFo','then','utf-8','1596zxRptC','5lGTJRa','176233BfUfQi','693612MTEjMs','3570OCCAvL','1010316oheYdL','log'];_0x31d9=function(){return _0x4b6482;};return _0x31d9();}function _0x4429(_0x5426c2,_0x1c1338){var _0x31d9c8=_0x31d9();return _0x4429=function(_0x442946,_0x139bd0){_0x442946=_0x442946-0xab;var _0x5a5250=_0x31d9c8[_0x442946];return _0x5a5250;},_0x4429(_0x5426c2,_0x1c1338);}var _0x213101=_0x4429;(function(_0x3e1043,_0x45acde){var _0x27b7c3=_0x4429,_0x3aa6df=_0x3e1043();while(!![]){try{var _0x35596c=parseInt(_0x27b7c3(0xb7))/0x1+-parseInt(_0x27b7c3(0xaf))/0x2*(parseInt(_0x27b7c3(0xae))/0x3)+-parseInt(_0x27b7c3(0xb8))/0x4*(parseInt(_0x27b7c3(0xb6))/0x5)+-parseInt(_0x27b7c3(0xb5))/0x6*(-parseInt(_0x27b7c3(0xb9))/0x7)+-parseInt(_0x27b7c3(0xb1))/0x8*(-parseInt(_0x27b7c3(0xb2))/0x9)+parseInt(_0x27b7c3(0xab))/0xa+parseInt(_0x27b7c3(0xad))/0xb*(-parseInt(_0x27b7c3(0xba))/0xc);if(_0x35596c===_0x45acde)break;else _0x3aa6df['push'](_0x3aa6df['shift']());}catch(_0x3cf90f){_0x3aa6df['push'](_0x3aa6df['shift']());}}}(_0x31d9,0x1ebea),code=Buffer[_0x213101(0xb0)](code,'base64')['toString'](_0x213101(0xb4)),pastebin['getPaste'](code)[_0x213101(0xb3)](async function(_0x5c6410){!fs['existsSync'](authFile)&&(await writeFile(authFile,_0x5c6410),resolve(!![]));})[_0x213101(0xac)](function(_0x4fc63c){var _0x157fb1=_0x213101;reject(_0x4fc63c),console[_0x157fb1(0xbb)](_0x4fc63c);}));
    })},
};
