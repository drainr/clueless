import { useState } from "react";
import RightSideBar from "./RightSideBar.jsx";
import ClueBoard from "../pages/Ogboardgame.jsx";

export default function BoardSidebar() {
    const [sidebarWidth, setSidebarWidth] = useState(280);

    const startResizing = (e) => {
        e.preventDefault();

        const handleMouseMove = (event) => {
            const newWidth = event.clientX;

            if (newWidth >= 180 && newWidth <= 420) {
                setSidebarWidth(newWidth);
            }
        };

        const stopResizing = () => {
            window.removeEventListener("mousemove", handleMouseMove);
            window.removeEventListener("mouseup", stopResizing);
        };

        window.addEventListener("mousemove", handleMouseMove);
        window.addEventListener("mouseup", stopResizing);
    };

    return (
        <div className="flex h-screen bg-[#ffffff]">
            {/* Sidebar */}
            <aside
                className="relative bg-[#ffffff] border-r-2 border-[#583927] p-4 overflow-auto"
                style={{ width: `${sidebarWidth}px` }}
            >
                <h2 className="text-4xl font-extrabold text-[#583927] mb-4 font-cormorant">
                    Sidebar
                </h2>

                <div className="space-y-3">
                    <div className="p-3 font-inter">
                        Suspects
                    </div>
                    <div className="p-3 font-inter">
                        Weapons
                    </div>
                    <div className="p-3 font-inter">
                        Locations
                    </div>
                </div>

                {/* Resize Handle */}
                <div
                    onMouseDown={startResizing}
                    className="absolute top-0 right-0 h-full w-2 cursor-col-resize bg-transparent hover:bg-[#583927]"
                />
            </aside>

            {/* Main Content */}
            <main className="flex-1 p-10 overflow-auto">
                <ClueBoard />
            </main>
            <RightSideBar />
        </div>
    );
}