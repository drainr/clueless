/**
 * gameSocket.js — all real-time game events via socket.io.
 * Called from server.js: registerGameSockets(io)
 */
const Room   = require('../models/room');
const Game   = require('../models/game');
const { characters, weapons, rooms } = require('../gameMechanics/Deck/deck');
const { selectMurderCards }          = require('../gameMechanics/Deck/Killercards');
const { dealPlayerHands }            = require('../gameMechanics/Deck/DealHand');

module.exports = (io) => {
  io.on('connection', (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // ── Join room ────────────────────────────────────────────────────────
    socket.on('join_room', async ({ roomCode, displayName, userId }) => {
      socket.join(roomCode)

      try {
        const room = await Room.findOne({ code: roomCode })
        if (!room) return

        const existing = room.players.find((p) => p.displayName === displayName)
        if (existing) {
          await Room.findOneAndUpdate(
            { code: roomCode, 'players.displayName': displayName },
            { $set: { 'players.$.socketId': socket.id, 'players.$.isActive': true } }
          )
        } else {
          await Room.findOneAndUpdate(
            { code: roomCode },
            {
              $push: {
                players: {
                  userId:   userId || null,
                  displayName,
                  socketId: socket.id,
                  isHost:   false,
                  isReady:  false,
                  isActive: true,
                }
              }
            }
          )
          io.to(roomCode).emit('player_joined', { displayName, socketId: socket.id })
        }
      } catch (err) {
        console.error('join_room DB error:', err)
      }
    });

    // ── Start game ───────────────────────────────────────────────────────
    socket.on('start_game', async ({ roomCode }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room)                     return socket.emit('error', { message: 'Room not found' });
        if (room.status !== 'waiting') return socket.emit('error', { message: 'Game already started' });
        if (room.players.length < 3)   return socket.emit('error', { message: 'Need at least 3 players' });

        const { killer, weapon, room: murderRoom, remainingDeck } = selectMurderCards(
          characters,
          weapons,
          rooms
        );

        const playerList = room.players.map((p) => ({
          id:          p.socketId,
          name:        p.displayName,
          displayName: p.displayName,
          character:   null,
          hand:        [],
        }));

        const dealtPlayers = dealPlayerHands(playerList, remainingDeck);

        const gamePlayers = dealtPlayers.map((p, i) => ({
          userId:       room.players[i]?.userId ?? null,
          displayName:  p.displayName,
          character:    characters[i % characters.length].name,
          socketId:     p.id,
          hand:         p.hand.map((c) => c.name),
          position:     { row: 7, col: 7 },
          isEliminated: false,
          isActive:     true,
        }));

        const solution = {
          suspect:  killer.name,
          weapon:   weapon.name,
          location: murderRoom.name,
        };

        const game = await Game.create({
          roomId:           room._id,
          players:          gamePlayers,
          solution,
          status:           'active',
          turnPhase:        'roll',
          currentTurnIndex: 0,
        });

        await Room.findByIdAndUpdate(room._id, {
          status: 'in_progress',
          gameId: game._id,
        });

        io.to(roomCode).emit('game_started', { roomCode, gameId: game._id });

        gamePlayers.forEach((p) => {
          io.to(p.socketId).emit('deal_hand', {
            character: p.character,
            hand:      p.hand,
          });
        });

        console.log(`Game started in room ${roomCode} — Game ID: ${game._id}`);

      } catch (err) {
        console.error('start_game error:', err);
        socket.emit('error', { message: 'Failed to start game' });
      }
    });

    // ── Dice roll ────────────────────────────────────────────────────────
    socket.on('roll_dice', ({ roomCode, playerId }) => {
      const die1 = Math.ceil(Math.random() * 6);
      const die2 = Math.ceil(Math.random() * 6);
      io.to(roomCode).emit('dice_rolled', { playerId, die1, die2, roll: die1 + die2 });
    });

    // ── Move player ──────────────────────────────────────────────────────
    socket.on('move_player', ({ roomCode, playerId, position }) => {
      io.to(roomCode).emit('player_moved', { playerId, position });
    });

    // ── Suggestion ───────────────────────────────────────────────────────
    socket.on('make_guess', ({ roomCode, guess }) => {
      io.to(roomCode).emit('guess_made', { guess });
    });

    // ── Disconnect ───────────────────────────────────────────────────────
    socket.on('disconnect', async () => {
      console.log(`Socket disconnected: ${socket.id}`);
      try {
        await Room.findOneAndUpdate(
          { 'players.socketId': socket.id },
          { $set: { 'players.$.isActive': false } }
        );
      } catch (err) {
        console.error('disconnect cleanup error:', err);
      }
    });
  });
};