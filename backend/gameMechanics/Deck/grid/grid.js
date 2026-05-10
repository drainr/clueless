// Backend bridge for the shared Clue board layout.
// It reads the shared JSON board data so movement and room entry stay consistent everywhere.
// The backend only needs the generated 2D board array for turn validation.

const { BOARD_SIZE, ROOMS } = require('../../../../frontend/shared/boardLayout.json');

function getRoomAt(row, col) {
  return ROOMS.find(
    (room) =>
      row >= room.row &&
      row < room.row + room.height &&
      col >= room.col &&
      col < room.col + room.width
  ) ?? null;
}

function getDoorAt(row, col) {
  return ROOMS.find((room) => room.door.row === row && room.door.col === col) ?? null;
}

function createBoard() {
  return Array.from({ length: BOARD_SIZE }, (_, row) =>
    Array.from({ length: BOARD_SIZE }, (_, col) => {
      const room = getRoomAt(row, col);
      if (room) {
        return { type: 'room', room: room.name, row, col };
      }

      const doorRoom = getDoorAt(row, col);
      if (doorRoom) {
        return { type: 'door', room: doorRoom.name, row, col };
      }

      return { type: 'hallway', row, col };
    })
  );
}

module.exports = {
  BOARD_SIZE,
  rooms: ROOMS,
  getRoomAt,
  getDoorAt,
  createBoard,
};