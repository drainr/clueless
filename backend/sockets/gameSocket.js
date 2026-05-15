/**
 * gameSocket.js — all real-time game events via socket.io.
 * Called from server.js: registerGameSockets(io)
 */
const Room = require("../models/room");
const Game = require("../models/game");
const { characters, weapons, rooms } = require("../gameMechanics/deck/deck");
const { selectMurderCards } = require("../gameMechanics/Deck/Killercards");
const { dealPlayerHands } = require("../gameMechanics/Deck/DealHand");
const PlayerMovement = require("../gameMechanics/PlayerState/playerMovement");

// ── helpers ──────────────────────────────────────────────────────────────────

function buildPublicState(game, room) {
  return {
    gameId: game._id,
    turnPhase: game.turnPhase,
    currentTurnIndex: game.currentTurnIndex,
    players: game.players.map((p) => ({
      displayName: p.displayName,
      character: p.character,
      isHost: room.players.find((r) => r.displayName === p.displayName)?.isHost ?? false,
      isEliminated: p.isEliminated,
      isActive: p.isActive,
      position: p.position,
    })),
  };
}

function getPlayerMovement(position) {
  return new PlayerMovement({ row: position.row, col: position.col });
}

// ── module ───────────────────────────────────────────────────────────────────

module.exports = (io) => {
  io.on("connection", (socket) => {
    console.log(`Socket connected: ${socket.id}`);

    // ── Join room ──────────────────────────────────────────────────────────
    socket.on("join_room", async ({ roomCode, displayName, userId }) => {
      socket.join(roomCode);
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        const existing = room.players.find((p) => p.displayName === displayName);
        if (existing) {
          await Room.findOneAndUpdate(
            { code: roomCode, "players.displayName": displayName },
            { $set: { "players.$.socketId": socket.id, "players.$.isActive": true } }
          );
          return;
        }

        const result = await Room.findOneAndUpdate(
          { code: roomCode, "players.displayName": { $ne: displayName } },
          {
            $push: {
              players: {
                userId: userId || null,
                displayName,
                socketId: socket.id,
                isHost: false,
                isReady: false,
                isActive: true,
              },
            },
          },
          { new: true }
        );

        if (result) {
          io.to(roomCode).emit("player_joined", { displayName, socketId: socket.id });
        }
      } catch (err) {
        console.error("join_room DB error:", err);
      }
    });

    // ── Leave room ─────────────────────────────────────────────────────────
    socket.on("leave_room", async ({ roomCode, displayName }) => {
      socket.leave(roomCode);
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        const leavingPlayer = room.players.find((p) => p.displayName === displayName);
        await Room.findOneAndUpdate(
          { code: roomCode },
          { $pull: { players: { displayName } } }
        );

        if (leavingPlayer?.isHost || room.players.length <= 1) {
          await Room.findByIdAndUpdate(room._id, { status: "finished" });
          io.to(roomCode).emit("room_closed", { message: "Host left the lobby" });
        } else {
          io.to(roomCode).emit("player_left", { displayName });
        }
      } catch (err) {
        console.error("leave_room error:", err);
      }
    });

    // ── Start game ─────────────────────────────────────────────────────────
    socket.on("start_game", async ({ roomCode }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return socket.emit("error", { message: "Room not found" });
        if (room.status !== "waiting") return socket.emit("error", { message: "Game already started" });
        if (room.players.length < 3) return socket.emit("error", { message: "Need at least 3 players" });

        const { killer, weapon, room: murderRoom, remainingDeck } =
          selectMurderCards(characters, weapons, rooms);

        const playerList = room.players.map((p) => ({
          id: p.socketId,
          name: p.displayName,
          displayName: p.displayName,
          character: null,
          hand: [],
        }));

        const dealtPlayers = dealPlayerHands(playerList, remainingDeck);

        // Assign spawn positions — spread players around the board
        const spawnPositions = [
          { row: 4, col: 2 },
          { row: 4, col: 12 },
          { row: 10, col: 2 },
          { row: 10, col: 12 },
        ];

        const gamePlayers = dealtPlayers.map((p, i) => ({
          userId: room.players[i]?.userId ?? null,
          displayName: p.displayName,
          character: characters[i % characters.length].name,
          socketId: p.id,
          hand: p.hand.map((c) => c.name),
          position: spawnPositions[i] ?? { row: 7, col: 7 },
          isEliminated: false,
          isActive: true,
        }));

        const solution = {
          suspect: killer.name,
          weapon: weapon.name,
          location: murderRoom.name,
        };

        const game = await Game.create({
          roomId: room._id,
          players: gamePlayers,
          solution,
          status: "active",
          turnPhase: "roll",
          currentTurnIndex: 0,
        });

        await Room.findByIdAndUpdate(room._id, {
          status: "in_progress",
          gameId: game._id,
        });

        io.to(roomCode).emit("game_started", { roomCode, gameId: game._id });
        io.to(roomCode).emit("game_state", buildPublicState(game, room));

        gamePlayers.forEach((p) => {
          io.to(p.socketId).emit("deal_hand", {
            character: p.character,
            hand: p.hand,
          });
        });

        console.log(`Game started in room ${roomCode} — Game ID: ${game._id}`);
      } catch (err) {
        console.error("start_game error:", err);
        socket.emit("error", { message: "Failed to start game" });
      }
    });

    // ── Get game state (rejoin) ────────────────────────────────────────────
    socket.on("get_game_state", async ({ roomCode }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        const game = await Game.findOne({ roomId: room._id, status: "active" });
        if (!game) return;

        socket.emit("game_state", buildPublicState(game, room));

        const myPlayer = game.players.find((p) => p.socketId === socket.id);
        if (myPlayer) {
          socket.emit("deal_hand", {
            character: myPlayer.character,
            hand: myPlayer.hand,
          });
        }
      } catch (err) {
        console.error("get_game_state error:", err);
      }
    });

    // ── Roll dice ──────────────────────────────────────────────────────────
    socket.on("roll_dice", async ({ roomCode }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        const game = await Game.findOne({ roomId: room._id, status: "active" });
        if (!game) return;

        // Validate it's this player's turn
        const currentPlayer = game.players[game.currentTurnIndex];
        if (currentPlayer.socketId !== socket.id) {
          return socket.emit("error", { message: "Not your turn" });
        }

        if (game.turnPhase !== "roll") {
          return socket.emit("error", { message: "Not time to roll" });
        }

        // Roll dice
        const die1 = Math.ceil(Math.random() * 6);
        const die2 = Math.ceil(Math.random() * 6);
        const roll = die1 + die2;

        // Get reachable tiles using PlayerMovement
        const movement = getPlayerMovement(currentPlayer.position);
        const reachableTiles = movement.getReachableTiles(roll);

        // Update game phase to move
        await Game.findByIdAndUpdate(game._id, { turnPhase: "move", reachableTiles, });

        // Emit to everyone in room
        io.to(roomCode).emit("dice_rolled", {
          displayName: currentPlayer.displayName,
          die1,
          die2,
          roll,
          reachableTiles,
        });

        // Update phase in public state
        io.to(roomCode).emit("phase_changed", { turnPhase: "move" });

      } catch (err) {
        console.error("roll_dice error:", err);
      }
    });

    // ── Move player ────────────────────────────────────────────────────────
    socket.on("move_player", async ({ roomCode, row, col }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        const game = await Game.findOne({ roomId: room._id, status: "active" });
        if (!game) return;

        const currentPlayer = game.players[game.currentTurnIndex];
        if (currentPlayer.socketId !== socket.id) {
          return socket.emit("error", { message: "Not your turn" });
        }

        if (game.turnPhase !== "move") {
          return socket.emit("error", { message: "Not time to move" });
        }

        // Validate move using PlayerMovement
        const isReachable = game.reachableTiles?.some(
          (t) => t.row === row && t.col === col
        );
        if (!isReachable) {
          return socket.emit("error", { message: "That tile is not reachable with your roll" });
        }

        const movement = getPlayerMovement(currentPlayer.position);
        let targetTile = movement.board[row][col];
        let finalRow = row;
        let finalCol = col;

        if (targetTile.type === 'door') {
          const directions = [
            { row: -1, col: 0 },
            { row: 1, col: 0 },
            { row: 0, col: -1 },
            { row: 0, col: 1 },
          ];
          for (const dir of directions) {
            const nr = row + dir.row;
            const nc = col + dir.col;
            if (nr >= 0 && nr < movement.BOARD_SIZE && nc >= 0 && nc < movement.BOARD_SIZE) {
              const neighbour = movement.board[nr][nc];
              if (neighbour.type === 'room' && neighbour.room === targetTile.room) {
                finalRow = nr;
                finalCol = nc;
                targetTile = neighbour;
                break;
              }
            }
          }
        }
        // Determine new room
        const newPosition = { row: finalRow, col: finalCol };
        const inRoom = targetTile.type === 'room' ? targetTile.room : null;

        // Determine next phase
        const nextPhase = inRoom ? "action" : "end_turn";

        // Update player position and phase in MongoDB
        await Game.findOneAndUpdate(
          { _id: game._id, "players.displayName": currentPlayer.displayName },
          {
            $set: {
              "players.$.position": newPosition,
              turnPhase: nextPhase,
            },
          }
        );

        // Emit to all players
        io.to(roomCode).emit("player_moved", {
          displayName: currentPlayer.displayName,
          position: newPosition,
          inRoom,
        });

        io.to(roomCode).emit("phase_changed", {
          turnPhase: nextPhase,
          inRoom,
        });

      } catch (err) {
        console.error("move_player error:", err);
      }
    });

    // ── Make suggestion (interrogate) ──────────────────────────────────────────────
    socket.on('make_suggestion', async ({ roomCode, suspect, weapon }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        const game = await Game.findOne({ roomId: room._id, status: 'active' });
        if (!game) return;

        const currentPlayer = game.players[game.currentTurnIndex];
        if (currentPlayer.socketId !== socket.id)
          return socket.emit('error', { message: 'Not your turn' });
        if (game.turnPhase !== 'action')
          return socket.emit('error', { message: 'Not time to suggest' });

        const movement = getPlayerMovement(currentPlayer.position);
        const tile = movement.board[currentPlayer.position.row][currentPlayer.position.col];

        if (tile.type !== 'room')
          return socket.emit('error', { message: 'Must be fully inside a room to make a suggestion' });

        const location = tile.room;

        const otherPlayers = game.players.filter(
          (p) => p.displayName !== currentPlayer.displayName && !p.isEliminated
        );

        // Find the first player who can refute and their first matching card
        let refutedBy = null;
        let cardShown = null;

        for (const p of otherPlayers) {
          const match = p.hand.find((c) => c === suspect || c === weapon || c === location);
          if (match) {
            refutedBy = p.displayName;
            cardShown = match;
            break;
          }
        }

        // Save the guess
        await Game.findByIdAndUpdate(game._id, {
          $push: {
            guesses: {
              playerId: currentPlayer.displayName,
              type: 'suggestion',
              suspect,
              weapon,
              location,
              refutedBy: refutedBy ?? null,
              cardShown: cardShown ?? null,
              timestamp: new Date(),
            },
          },
        });

        // Tell everyone a suggestion was made
        io.to(roomCode).emit('suggestion_made', {
          byPlayer: currentPlayer.displayName,
          suspect,
          weapon,
          location,
        });

        // Send the result privately to the suggester via toast
        if (cardShown) {
          socket.emit('suggestion_result', {
            suspect,
            weapon,
            location,
            refutedBy,
            cardShown,
            noRefuters: false,
            message: `${refutedBy} disproved your suggestion by showing: ${cardShown}`,
          });
        } else {
          socket.emit('suggestion_result', {
            suspect,
            weapon,
            location,
            refutedBy: null,
            cardShown: null,
            noRefuters: true,
            message: 'Nobody could disprove your suggestion.',
          });
        }

        // Auto-advance turn
        await advanceTurn(game._id, roomCode, io, room);

      } catch (err) {
        console.error('make_suggestion error:', err);
      }
    });

    // ── Refute suggestion ──────────────────────────────────────────────────────────
    socket.on('refute_suggestion', async ({ roomCode, cardShown }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        const game = await Game.findOne({ roomId: room._id, status: 'active' });
        if (!game) return;

        const currentPlayer = game.players[game.currentTurnIndex];
        const refuter = game.players.find((p) => p.socketId === socket.id);
        if (!refuter) return;

        await Game.findOneAndUpdate(
          { _id: game._id, 'guesses.type': 'suggestion' },
          {
            $set: {
              'guesses.$[last].refutedBy': refuter.displayName,
              'guesses.$[last].cardShown': cardShown,
              turnPhase: 'end_turn',
            },
          },
          { arrayFilters: [{ 'last.refutedBy': { $exists: false } }] }
        );

        // Get the suggestion that was just refuted so we can send it back
        const updatedGame = await Game.findById(game._id);
        const lastGuess = updatedGame.guesses
          .filter((g) => g.type === 'suggestion')
          .at(-1);

        // Send full result privately to the suggester
        io.to(currentPlayer.socketId).emit('suggestion_result', {
          suspect: lastGuess.suspect,
          weapon: lastGuess.weapon,
          location: lastGuess.location,
          refutedBy: refuter.displayName,
          cardShown,
          noRefuters: false,
          message: `${refuter.displayName} disproved your suggestion by showing you: ${cardShown}`,
        });

        // Tell everyone a card was shown (but not which one)
        io.to(roomCode).emit('suggestion_refuted', { byPlayer: refuter.displayName });
        io.to(roomCode).emit('phase_changed', { turnPhase: 'end_turn' });

        // Auto-advance turn after refutation
        await advanceTurn(game._id, roomCode, io, room);

      } catch (err) {
        console.error('refute_suggestion error:', err);
      }
    });

    // ── Make accusation ────────────────────────────────────────────────────
    socket.on("make_accusation", async ({ roomCode, suspect, weapon, location }) => {
      console.log('make_accusation received', { roomCode, suspect, weapon, location });
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        const game = await Game.findOne({ roomId: room._id, status: "active" });
        if (!game) return;

        const currentPlayer = game.players[game.currentTurnIndex];
        if (currentPlayer.socketId !== socket.id) {
          return socket.emit("error", { message: "Not your turn" });
        }

        // Validate player is in Accusation Room
        const movement = getPlayerMovement(currentPlayer.position);
        const tile = movement.board[currentPlayer.position.row][currentPlayer.position.col];
        if (tile.room !== "Accusation Room") {
          return socket.emit("error", { message: "Must be in the Accusation Room to accuse" });
        }

        const isCorrect =
          suspect === game.solution.suspect &&
          weapon === game.solution.weapon &&
          location === game.solution.location;

        await Game.findByIdAndUpdate(game._id, {
          $push: {
            guesses: {
              playerId: currentPlayer.displayName,
              type: "accusation",
              suspect,
              weapon,
              location,
              isCorrect,
              timestamp: new Date(),
            },
          },
        });

        if (isCorrect) {
          // Game over — this player wins
          await Game.findByIdAndUpdate(game._id, {
            status: "finished",
            winnerId: currentPlayer.displayName,
            finishedAt: new Date(),
          });
          await Room.findByIdAndUpdate(room._id, { status: "finished" });

          io.to(roomCode).emit("game_over", {
            winner: currentPlayer.displayName,
            solution: game.solution,
          });

        } else {
          // Wrong accusation — eliminate player
          await Game.findOneAndUpdate(
            { _id: game._id, "players.displayName": currentPlayer.displayName },
            { $set: { "players.$.isEliminated": true } }
          );

          io.to(roomCode).emit("player_eliminated", {
            displayName: currentPlayer.displayName,
            message: `${currentPlayer.displayName} made a wrong accusation and is eliminated!`,
          });

          // Check if all players are eliminated
          const updatedGame = await Game.findById(game._id);
          const activePlayers = updatedGame.players.filter(
            (p) => !p.isEliminated && p.isActive
          );

          if (activePlayers.length === 0) {
            await Game.findByIdAndUpdate(game._id, {
              status: "finished",
              finishedAt: new Date(),
            });
            await Room.findByIdAndUpdate(room._id, { status: "finished" });

            io.to(roomCode).emit("game_over", {
              winner: null,
              solution: game.solution,
              message: "Everyone was eliminated. Nobody wins!",
            });
          } else {
            // Advance turn skipping eliminated player
            await advanceTurn(game._id, roomCode, io, room);
          }
        }
      } catch (err) {
        console.error("make_accusation error:", err);
      }
    });

    // ── End turn ───────────────────────────────────────────────────────────
    socket.on("end_turn", async ({ roomCode }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        const game = await Game.findOne({ roomId: room._id, status: "active" });
        if (!game) return;

        const currentPlayer = game.players[game.currentTurnIndex];
        if (currentPlayer.socketId !== socket.id) {
          return socket.emit("error", { message: "Not your turn" });
        }

        await advanceTurn(game._id, roomCode, io, room);

      } catch (err) {
        console.error("end_turn error:", err);
      }
    });

    // ── Abandon game ───────────────────────────────────────────────────────
    socket.on("abandon_game", async ({ roomCode }) => {
      try {
        const room = await Room.findOne({ code: roomCode });
        if (!room) return;

        await Room.findByIdAndUpdate(room._id, { status: "finished" });
        await Game.findOneAndUpdate(
          { roomId: room._id },
          { status: "finished", finishedAt: new Date() }
        );

        io.to(roomCode).emit("game_abandoned", { message: "Game ended early" });
      } catch (err) {
        console.error("abandon_game error:", err);
      }
    });

    // ── Disconnect ─────────────────────────────────────────────────────────
    socket.on("disconnect", async () => {
      console.log(`Socket disconnected: ${socket.id}`);
      try {
        const room = await Room.findOneAndUpdate(
          { "players.socketId": socket.id },
          { $set: { "players.$.isActive": false } },
          { new: true }
        );
        if (!room) return;

        const roomCode = room.code;
        const leavingPlayer = room.players.find((p) => p.socketId === socket.id);

        if (room.status === "in_progress") {
          const activePlayers = room.players.filter((p) => p.isActive);
          if (activePlayers.length < 3) {
            await Room.findByIdAndUpdate(room._id, { status: "finished" });
            await Game.findOneAndUpdate(
              { roomId: room._id },
              { status: "finished", finishedAt: new Date() }
            );
            io.to(roomCode).emit("game_abandoned", {
              message: `${leavingPlayer?.displayName ?? "A player"} left — not enough players to continue.`,
            });
          } else {
            io.to(roomCode).emit("player_left", { displayName: leavingPlayer?.displayName });
          }
        }

        if (room.status === "waiting") {
          if (leavingPlayer?.isHost) {
            await Room.findByIdAndUpdate(room._id, { status: "finished" });
            io.to(roomCode).emit("room_closed", { message: "Host disconnected" });
          } else {
            io.to(roomCode).emit("player_left", { displayName: leavingPlayer?.displayName });
          }
        }
      } catch (err) {
        console.error("disconnect cleanup error:", err);
      }
    });
  });
};

// ── advanceTurn helper ────────────────────────────────────────────────────────
async function advanceTurn(gameId, roomCode, io, room) {
  const game = await Game.findById(gameId);
  if (!game) return;

  const total = game.players.length;
  let nextIndex = (game.currentTurnIndex + 1) % total;
  let checked = 0;

  while (checked < total) {
    const next = game.players[nextIndex];
    if (!next.isEliminated && next.isActive) break;
    nextIndex = (nextIndex + 1) % total;
    checked++;
  }

  await Game.findByIdAndUpdate(gameId, {
    currentTurnIndex: nextIndex,
    turnPhase: "roll",
  });

  const updatedGame = await Game.findById(gameId);

  io.to(roomCode).emit("turn_changed", {
    currentTurnIndex: nextIndex,
    turnPhase: "roll",
    currentPlayer: updatedGame.players[nextIndex].displayName,
  });

  io.to(roomCode).emit("game_state", {
    gameId: updatedGame._id,
    turnPhase: "roll",
    currentTurnIndex: nextIndex,
    players: updatedGame.players.map((p) => ({
      displayName: p.displayName,
      character: p.character,
      isHost: room.players.find((r) => r.displayName === p.displayName)?.isHost ?? false,
      isEliminated: p.isEliminated,
      isActive: p.isActive,
      position: p.position,
    })),
  });
}