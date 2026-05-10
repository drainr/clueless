frontend\pages\OgBoardGame.jsx
@@ -0,0 +1,89 @@
const BOARD_SIZE = 15;

const rooms = [
    { name: "Study", row: 0, col: 0, width: 4, height: 3, door: { row: 3, col: 2 }, color: "bg-[#D7C0AE]" },
    { name: "Hall", row: 0, col: 6, width: 4, height: 3, door: { row: 3, col: 8 }, color: "bg-[#E8D8C4]" },
    { name: "Lounge", row: 0, col: 11, width: 4, height: 3, door: { row: 3, col: 12 }, color: "bg-[#D9BBA9]" },
    { name: "Library", row: 5, col: 0, width: 4, height: 3, door: { row: 6, col: 4 }, color: "bg-[#C8B6A6]" },
    { name: "Dining Room", row: 5, col: 11, width: 4, height: 3, door: { row: 6, col: 10 }, color: "bg-[#BCAAA4]" },
    { name: "Conservatory", row: 11, col: 0, width: 4, height: 4, door: { row: 10, col: 2 }, color: "bg-[#DDE5B6]" },
    { name: "Ballroom", row: 11, col: 6, width: 4, height: 4, door: { row: 10, col: 8 }, color: "bg-[#FAEDCD]" },
    { name: "Kitchen", row: 11, col: 11, width: 4, height: 4, door: { row: 10, col: 12 }, color: "bg-[#F5EBE0]" },
    {name: "Accusation Room",
        row: 6,
        col: 6,
        width: 3,
        height: 3,
        door: { row: 5, col: 7 }, color: "bg-[#F5EBE0]" },
];

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