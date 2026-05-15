import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { roomAPI } from "../utils/api";
import { useSocket } from "../hooks/useSocket";
import Cards from "../components/Cards";
import og from "../assets/og-board.png";
import jungle from "../assets/classic/boards/jungle-board.png";
import underwater from "../assets/classic/boards/underwater-board.png";

export default function Boards() {
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [joinCode, setJoinCode] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCreateGame = async () => {
    setError(null);
    setLoading(true);
    try {
      const res = await roomAPI.create(user.username, socket?.id);
      navigate(`/lobby/${res.data.code}`);
    } catch (err) {
      setError("Failed to create game. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleJoinGame = async () => {
    if (!joinCode.trim()) return;
    setError(null);
    setLoading(true);
    try {
      await roomAPI.getByCode(joinCode.trim().toUpperCase());
      navigate(`/lobby/${joinCode.trim().toUpperCase()}`);
    } catch (err) {
      setError("Room not found. Check the code and try again.");
    } finally {
      setLoading(false);
    }
  };
    const boards = [
        {
            title: "OG Mansion",
            subtitle: "Step into the iconic estate where every room hides a clue and every guest is suspicious.",
            image: og,
        },
        {
            title: "Sunken Secrets",
            subtitle:
                "Explore the depths of the underwater mansion and uncover the killer hidden beneath the waves.",
            image: underwater,
        },
        {
            title: "Jungle Mystery",
            subtitle:
                "Venture through ancient ruins and tangled vines to expose the culprit lurking within.",
            image: jungle,
        },
    ];

  return (
    <div className="m-5">
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "24px",
          marginBottom: "24px",
        }}
      >
        {/* Create game — no input needed */}
        <button
          onClick={handleCreateGame}
          disabled={loading}
          style={{
            padding: "10px 24px",
            background: "#9CAF88",
            color: "#F5E8D3",
            border: "none",
            borderRadius: "8px",
            fontWeight: 700,
            cursor: "pointer",
            fontSize: "14px",
            boxShadow: "2px 2px 0px #D9B86A",
          }}
        >
          + Create Game
        </button>

        {/* Divider */}
        <span style={{ color: "#8c6f61", fontWeight: 600, fontSize: "13px" }}>
          or
        </span>

        {/* Join game — needs code */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            placeholder="Enter room code"
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
            maxLength={6}
            style={{
              padding: "10px 14px",
              border: "2px solid #7A5C46",
              borderRadius: "8px",
              fontSize: "14px",
              width: "160px",
              fontWeight: 600,
              letterSpacing: "0.1em",
              background: "#fffdf8",
              color: "#3D2B1F",
            }}
          />
          <button
            onClick={handleJoinGame}
            disabled={loading || !joinCode.trim()}
            style={{
              padding: "10px 24px",
              background: "#6C8AA6",
              color: "#F5E8D3",
              border: "none",
              borderRadius: "8px",
              fontWeight: 700,
              cursor: "pointer",
              fontSize: "14px",
              boxShadow: "2px 2px 0px #D9B86A",
            }}
          >
            Join Game
          </button>
        </div>
      </div>

      {error && (
        <p style={{ color: "#A44A3F", fontWeight: 600, marginBottom: "16px" }}>
          {error}
        </p>
      )}

        <div className="flex flex-wrap gap-8">
            {boards.map((board) => (
                <Cards
                    key={board.title}
                    title={board.title}
                    subtitle={board.subtitle}
                    image={board.image}
                />
            ))}
        </div>
    </div>
  );
}
