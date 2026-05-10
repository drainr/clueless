import boardData from '../../shared/boardLayout.json';

const { BOARD_SIZE, ROOMS: rooms } = boardData;

function getRoomAt(row, col) {
    return rooms.find(
        (room) =>
            row >= room.row &&
            row < room.row + room.height &&
            col >= room.col &&
            col < room.col + room.width
    );
}

function isDoor(row, col) {
    return rooms.some((room) => room.door.row === row && room.door.col === col);
}

export default function ClueBoard({ tileSize = 38 }) {
    function renderTile(row, col) {
        const room = getRoomAt(row, col);
        const door = isDoor(row, col);

        if (room) {
            const isRoomLabel =
                row === room.row + Math.floor(room.height / 2) &&
                col === room.col + Math.floor(room.width / 2);

            return (
                <div
                    key={`${row}-${col}`}
                    className={`relative border border-white/80 ${room.color}`}
                    style={{ height: tileSize, width: tileSize }}
                >
                    {isRoomLabel && (
                        <span className="flex items-center justify-center text-[9px] font-black uppercase text-[#6B4F3F]">
              {room.name}
            </span>
                    )}
                </div>
            );
        }

        return (
            <div
                key={`${row}-${col}`}
                className={`relative border border-[#D6CCC2] ${
                    door ? "bg-[#EAD7BB]" : "bg-[#FFF8EF]"
                }`}
                style={{ height: tileSize, width: tileSize }}
            >
                {door && (
                    <span className="flex h-full w-full items-center justify-center text-xs text-[#A98467]">
            ◆
          </span>
                )}
            </div>
        );
    }

    return (
        <div
            className="mx-auto grid w-max overflow-hidden border-8 border-[#DDBEA9] bg-[#DDBEA9] shadow-xl"
            style={{
                gridTemplateColumns: `repeat(${BOARD_SIZE}, ${tileSize}px)`,
                gridTemplateRows: `repeat(${BOARD_SIZE}, ${tileSize}px)`,
            }}
        >
            {Array.from({ length: BOARD_SIZE }).map((_, row) =>
                Array.from({ length: BOARD_SIZE }).map((_, col) => renderTile(row, col))
            )}
        </div>
    );
}