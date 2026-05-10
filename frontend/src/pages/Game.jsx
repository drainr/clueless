import BoardSidebar from '../components/board/BoardSidebar'
import RightSideBar from '../components/board/RightSideBar'
import ClueBoard    from './Ogboardgame'

export default function Game() {
    return (
        <div className="flex h-screen bg-[#ffffff]">
            <BoardSidebar />

            <main className="flex-1 p-10 overflow-auto">
                <ClueBoard />
            </main>

            <RightSideBar />
        </div>
    )
}