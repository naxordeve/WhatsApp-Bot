
const { Command } = require('../../lib/command');
const games = new Map();

Command({
    cmd_name: 'ttt',
    category: 'games',
    desc: 'Play Tic Tac Toe. Use !ttt @mention to challenge'
})(async (msg, conn) => {
    const mentioned = msg.message?.extendedTextMessage?.contextInfo?.mentionedJid?.[0];
    
    if (!mentioned) {
        return msg.reply('Tag a player to challenge!\nExample: !ttt @player');
    }

    if (mentioned === msg.sender) {
        return msg.reply('You cannot play against yourself!');
    }

    const gameId = [msg.sender, mentioned].sort().join(':');
    
    if (games.has(gameId)) {
        return msg.reply('A game is already in progress between these players!');
    }

    const board = Array(9).fill('');
    games.set(gameId, {
        board,
        players: [msg.sender, mentioned],
        currentPlayer: 0
    });
    
    let display = '```\n';
    for (let i = 0; i < 9; i += 3) {
        display += ` ${i + 1} │ ${i + 2} │ ${i + 3} \n`;
        if (i < 6) display += '───┼───┼───\n';
    }
    display += '```';
    
    const challenge = `🎮 Tic Tac Toe Challenge!\n\n@${msg.sender.split('@')[0]} (X) vs @${mentioned.split('@')[0]} (O)\n\n${display}\n\nUse numbers 1-9 to place your mark!`;
    
    await conn.sendMessage(msg.user, {
        text: challenge,
        mentions: [msg.sender, mentioned]
    });
});

Command({
    cmd_name: 'text',
    category: 'events',
    desc: 'Handle TTT game moves'
})(async (msg, conn) => {
    if (!/^[1-9]$/.test(msg.body)) return;
    
    const gameFound = Array.from(games.entries()).find(([_, game]) => game.players.includes(msg.sender));
    if (!gameFound) return;
    
    const [gameId, game] = gameFound;
    if (game.players[game.currentPlayer] !== msg.sender) return;
    
    const move = parseInt(msg.body) - 1;
    if (game.board[move] !== '') {
        return msg.reply('That position is already taken!');
    }
    
    game.board[move] = game.currentPlayer === 0 ? 'X' : 'O';
    
    const lines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
    const winner = lines.some(([a,b,c]) => game.board[a] && game.board[a] === game.board[b] && game.board[a] === game.board[c]) 
        ? game.board[move]
        : game.board.includes('') ? null : 'draw';
    
    let display = '```\n';
    for (let i = 0; i < 9; i += 3) {
        display += ` ${game.board[i] || (i + 1)} │ ${game.board[i + 1] || (i + 2)} │ ${game.board[i + 2] || (i + 3)} \n`;
        if (i < 6) display += '───┼───┼───\n';
    }
    display += '```';
    
    if (winner) {
        const result = winner === 'draw' 
            ? '🎮 Game Over - It\'s a Draw!'
            : `🎮 Game Over - ${winner === 'X' ? '@' + game.players[0].split('@')[0] : '@' + game.players[1].split('@')[0]} Wins! 🎉`;
            
        await conn.sendMessage(msg.user, {
            text: `${result}\n\n${display}`,
            mentions: game.players
        });
        games.delete(gameId);
        return;
    }
    
    game.currentPlayer = 1 - game.currentPlayer;
    await conn.sendMessage(msg.user, {
        text: `🎮 Tic Tac Toe\n\nTurn: @${game.players[game.currentPlayer].split('@')[0]} (${game.currentPlayer === 0 ? 'X' : 'O'})\n\n${display}`,
        mentions: game.players
    });
});
