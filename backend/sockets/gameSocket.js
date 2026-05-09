/**
 * gameSocket.js — all real-time game events via socket.io.
 * Called from server.js: registerGameSockets(io)
 */
module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    socket.on('join_room', ({ roomCode, displayName }) => {
      socket.join(roomCode);
      io.to(roomCode).emit('player_joined', { displayName, socketId: socket.id });
    });

    socket.on('start_game', ({ roomCode }) => {
      // TODO: initialize Game doc, deal cards, emit game_started with each player's hand
      io.to(roomCode).emit('game_started', { roomCode });
    });

    socket.on('roll_dice', ({ roomCode, playerId }) => {
      const die1 = Math.ceil(Math.random() * 6);
      const die2 = Math.ceil(Math.random() * 6);
      io.to(roomCode).emit('dice_rolled', { playerId, die1, die2, roll: die1 + die2 });
    });

    socket.on('move_player', ({ roomCode, playerId, position }) => {
      // TODO: validate move against board rules
      io.to(roomCode).emit('player_moved', { playerId, position });
    });

    socket.on('make_guess', ({ roomCode, guess }) => {
      // TODO: refutation logic, check accusation against solution
      io.to(roomCode).emit('guess_made', { guess });
    });

    socket.on('disconnect', () => {
      console.log(`Socket disconnected: ${socket.id}`);
      // TODO: mark player inactive in room/game docs
    });
  });
};