
const v = new Map();

async function _ID_NUM(sender, options) {
    const CreatePlug = {
        callback: options.callback,
        timeout: options.timeout || 30000,
        Call: options.Call,
        valid: options.valid || [],
        timer: setTimeout(() => {
            if (v.has(sender)) {
                if (CreatePlug.Call) CreatePlug.Call();
                v.delete(sender);
            }
        }, options.timeout || 30000)
    };
    
    v.set(sender, CreatePlug);
}

async function get_flag(msg) {
    if ((v.has(msg.sender)) return false;
    const CreatePlug = v.get(msg.sender);
    const number = parseInt(msg.body);
    if (isNaN(number)) return false;
    if (CreatePlug.valid.length && !CreatePlug.valid.includes(number)) return false;
    clearTimeout(CreatePlug.timer);
    v.delete(msg.sender);
    CreatePlug.callback(number, msg);
    return true;
}

module.exports = { _ID_NUM, get_flag };
