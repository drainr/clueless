import { useState } from "react";

import scarlett from "../../assets/classic/characters/miss-scarlett.png";
import mustard  from "../../assets/classic/characters/colonel-mustard.png";
import white    from "../../assets/classic/characters/mrs-white.png";
import green    from "../../assets/classic/characters/reverend-green.png";
import peacock  from "../../assets/classic/characters/mrs-peacock.png";
import plum     from "../../assets/classic/characters/professor-plum.png";
import candle   from "../../assets/classic/weapons/candle.png";
import knife    from "../../assets/classic/weapons/knife.png";
import pipe     from "../../assets/classic/weapons/pipe.png";
import revolver from "../../assets/classic/weapons/revolver.png";
import rope     from "../../assets/classic/weapons/suicide.png";
import wrench   from "../../assets/classic/weapons/wrench.png";
import study from "../../assets/classic/rooms/study.png";
import conservatory from "../../assets/classic/rooms/conservatory.png";
import dinning from "../../assets/classic/rooms/dinning-room.png";
import hall from "../../assets/classic/rooms/hallway.png";
import kitchen from "../../assets/classic/rooms/kitchen.png";
import library from "../../assets/classic/rooms/library.png";
import lounge from "../../assets/classic/rooms/lounge.png";
import ball from "../../assets/classic/rooms/ball-room.png";

const CHARACTERS = [
  { name: "Miss Scarlett",   img: scarlett },
  { name: "Colonel Mustard", img: mustard  },
  { name: "Mrs. White",      img: white    },
  { name: "Reverend Green",  img: green    },
  { name: "Mrs. Peacock",    img: peacock  },
  { name: "Professor Plum",  img: plum     },
];

const WEAPONS = [
  { name: "Candlestick", img: candle   },
  { name: "Knife",       img: knife    },
  { name: "Lead Pipe",   img: pipe     },
  { name: "Revolver",    img: revolver },
  { name: "Rope",        img: rope     },
  { name: "Wrench",      img: wrench   },
];

const ROOMS_LIST = [
    {name:"Study", img: study    },
    {name:"Hall", img: hall      },
    {name:"Lounge",img: lounge   },
    {name:"Library", img: library   },{
    name:"Dining Room", img: dinning    },
    {name:"Conservatory", img: conservatory },
    {name:"Ballroom", img: ball     },
    {name:"Kitchen", img: kitchen   },
];

// Status cycles: null → confirmed (✓) → denied (✗) → null
function cycleStatus(current) {
  if (current === null)        return 'confirmed';
  if (current === 'confirmed') return 'denied';
  return null;
}

function NotepadCard({ item, status, onToggle, myHand = [] }) {
  const inHand = myHand.includes(item.name ?? item);
  return (
    <div
      onClick={onToggle}
      className="flex flex-col items-center rounded-lg overflow-hidden cursor-pointer select-none"
      style={{
        background: status === 'confirmed' ? '#d4edda' : status === 'denied' ? '#f8d7da' : '#fff',
        border: `1px solid ${status === 'confirmed' ? '#9CAF88' : status === 'denied' ? '#A44A3F' : '#d8c6b4'}`,
        opacity: inHand ? 0.5 : 1,
        position: 'relative',
      }}
      title={inHand ? 'In your hand' : 'Click to mark'}
    >
      {item.img && (
        <div className="w-full h-14 flex items-center justify-center p-1 bg-[#fdf6ec]">
          <img src={item.img} alt={item.name} className="h-full object-contain" />
        </div>
      )}
      <span className="w-full text-center text-[9px] font-bold py-1 px-1"
        style={{ color: "#3D2B1F", background: "#F5E8D3" }}>
        {item.name ?? item}
      </span>
      {status && (
        <div className="absolute top-1 right-1 text-xs font-black"
          style={{ color: status === 'confirmed' ? '#166534' : '#991B1B' }}>
          {status === 'confirmed' ? '✓' : '✗'}
        </div>
      )}
      {inHand && (
        <div className="absolute top-1 left-1 text-[8px] font-bold"
          style={{ color: '#7A5C46' }}>
          MINE
        </div>
      )}
    </div>
  );
}

export default function BoardSidebar({ myHand = [] }) {
  const [sidebarWidth, setSidebarWidth] = useState(280);

  // Notepad state — persists for the whole game
  const [charStatus,   setCharStatus]   = useState({});
  const [weaponStatus, setWeaponStatus] = useState({});
  const [roomStatus,   setRoomStatus]   = useState({});

  const toggleChar   = (name) => setCharStatus((p)   => ({ ...p, [name]: cycleStatus(p[name] ?? null) }));
  const toggleWeapon = (name) => setWeaponStatus((p) => ({ ...p, [name]: cycleStatus(p[name] ?? null) }));
  const toggleRoom   = (name) => setRoomStatus((p)   => ({ ...p, [name]: cycleStatus(p[name] ?? null) }));

  const startResizing = (e) => {
    e.preventDefault();
    const handleMouseMove = (ev) => {
      const w = ev.clientX;
      if (w >= 220 && w <= 480) setSidebarWidth(w);
    };
    const stop = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stop);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stop);
  };

  return (
    <aside
      className="relative p-4 overflow-auto"
      style={{ width: `${sidebarWidth}px`, background: "#F5E8D3", borderRight: "2px solid #7A5C46", flexShrink: 0 }}
    >
      <h2 className="text-2xl font-extrabold mb-1 font-cormorant" style={{ color: "#7A5C46" }}>
        Detective Notes
      </h2>
      <p className="text-[10px] mb-3" style={{ color: "#8c6f61" }}>
        Click to mark ✓ confirmed · ✗ denied
      </p>

      <h3 className="text-base font-extrabold mb-2 font-cormorant" style={{ color: "#7A5C46" }}>Suspects</h3>
      <div className="grid grid-cols-2 gap-1 mb-4">
        {CHARACTERS.map((c) => (
          <NotepadCard key={c.name} item={c} status={charStatus[c.name] ?? null}
            onToggle={() => toggleChar(c.name)} myHand={myHand} />
        ))}
      </div>

      <h3 className="text-base font-extrabold mb-2 font-cormorant" style={{ color: "#7A5C46" }}>Weapons</h3>
      <div className="grid grid-cols-2 gap-1 mb-4">
        {WEAPONS.map((w) => (
          <NotepadCard key={w.name} item={w} status={weaponStatus[w.name] ?? null}
            onToggle={() => toggleWeapon(w.name)} myHand={myHand} />
        ))}
      </div>

      <h3 className="text-base font-extrabold mb-2 font-cormorant" style={{ color: "#7A5C46" }}>Rooms</h3>
      <div className="grid grid-cols-2 gap-1">
        {ROOMS_LIST.map((r) => (
          <NotepadCard key={r} item={r} status={roomStatus[r] ?? null}
            onToggle={() => toggleRoom(r)} myHand={myHand} />
        ))}
      </div>

      <div
        onMouseDown={startResizing}
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize bg-transparent"
        onMouseOver={(e) => (e.target.style.background = "#D9B86A")}
        onMouseOut={(e)  => (e.target.style.background = "transparent")}
      />
    </aside>
  );
}