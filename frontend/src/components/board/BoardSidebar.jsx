import { useState } from "react";

import scarlett  from "../../assets/classic/characters/miss-scarlett.png";
import mustard   from "../../assets/classic/characters/colonel-mustard.png";
import white     from "../../assets/classic/characters/mrs-white.png";
import green     from "../../assets/classic/characters/reverend-green.png";
import peacock   from "../../assets/classic/characters/mrs-peacock.png";
import plum      from "../../assets/classic/characters/professor-plum.png";

import candle    from "../../assets/classic/weapons/candle.png";
import knife     from "../../assets/classic/weapons/knife.png";
import pipe      from "../../assets/classic/weapons/pipe.png";
import revolver  from "../../assets/classic/weapons/revolver.png";
import rope      from "../../assets/classic/weapons/suicide.png";
import wrench    from "../../assets/classic/weapons/wrench.png";

const CHARACTERS = [
  { name: "Miss Scarlett",  img: scarlett },
  { name: "Col. Mustard",   img: mustard  },
  { name: "Mrs. White",     img: white    },
  { name: "Rev. Green",     img: green    },
  { name: "Mrs. Peacock",   img: peacock  },
  { name: "Prof. Plum",     img: plum     },
];

const WEAPONS = [
  { name: "Candlestick", img: candle   },
  { name: "Knife",       img: knife    },
  { name: "Lead Pipe",   img: pipe     },
  { name: "Revolver",    img: revolver },
  { name: "Rope",        img: rope     },
  { name: "Wrench",      img: wrench   },
];

function CardGrid({ items }) {
  return (
    <div className="grid grid-cols-2 gap-2">
      {items.map((item) => (
        <div
          key={item.name}
          className="flex flex-col items-center rounded-lg overflow-hidden"
          style={{ background: "#fff", border: "1px solid #d8c6b4" }}
        >
          <div className="w-full h-20 flex items-center justify-center p-1 bg-[#fdf6ec]">
            <img
              src={item.img}
              alt={item.name}
              className="h-full object-contain"
            />
          </div>
          <span
            className="w-full text-center text-[10px] font-bold py-1 px-1"
            style={{ color: "#3D2B1F", background: "#F5E8D3" }}
          >
            {item.name}
          </span>
        </div>
      ))}
    </div>
  );
}

export default function BoardSidebar() {
  const [sidebarWidth, setSidebarWidth] = useState(280);

  const startResizing = (e) => {
    e.preventDefault();
    const handleMouseMove = (event) => {
      const newWidth = event.clientX;
      if (newWidth >= 220 && newWidth <= 420) setSidebarWidth(newWidth);
    };
    const stopResizing = () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", stopResizing);
    };
    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", stopResizing);
  };

  return (
    <aside
      className="relative p-4 overflow-auto"
      style={{
        width: `${sidebarWidth}px`,
        background: "#F5E8D3",
        borderRight: "2px solid #7A5C46",
        flexShrink: 0,
      }}
    >
      <h2
        className="text-3xl font-extrabold mb-3 font-cormorant"
        style={{ color: "#7A5C46" }}
      >
        Suspects
      </h2>
      <CardGrid items={CHARACTERS} />

      <h2
        className="text-3xl font-extrabold mt-5 mb-3 font-cormorant"
        style={{ color: "#7A5C46" }}
      >
        Weapons
      </h2>
      <CardGrid items={WEAPONS} />

      {/* Resize Handle */}
      <div
        onMouseDown={startResizing}
        className="absolute top-0 right-0 h-full w-2 cursor-col-resize bg-transparent"
        style={{ transition: "background 0.15s" }}
        onMouseOver={(e) => (e.target.style.background = "#D9B86A")}
        onMouseOut={(e)  => (e.target.style.background = "transparent")}
      />
    </aside>
  );
}