import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useSocket } from "../hooks/useSocket";
import { roomAPI, friendAPI } from "../utils/api";

export default function Lobby() {
  const { roomCode } = useParams();
  const { user } = useAuth();
  const socket = useSocket();
  const navigate = useNavigate();
  const [room,         setRoom]         = useState(null);
  const [error,        setError]        = useState(null);
  const [friends,      setFriends]      = useState([]);
  const [invitedIds,   setInvitedIds]   = useState([]);
  const [inviteError,  setInviteError]  = useState(null);
  const [showFriends,  setShowFriends]  = useState(false);

  const isHost = room?.players?.find(
    (p) => p.displayName === user?.username
  )?.isHost;

  useEffect(() => {
    const loadRoom = async () => {
      try {
        const res = await roomAPI.getByCode(roomCode);
        setRoom(res.data);
      } catch {
        setError("Room not found.");
      }
    };
    loadRoom();
  }, [roomCode]);

  // Load friends list when host opens invite panel
  useEffect(() => {
    if (!showFriends || !isHost) return;
    friendAPI.getFriends()
      .then((res) => setFriends(res.data))
      .catch(() => setFriends([]))
  }, [showFriends, isHost]);

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit("join_room", {
      roomCode,
      displayName: user.username,
      userId: user.id,
    });

    const refreshRoom = async () => {
      try {
        const res = await roomAPI.getByCode(roomCode);
        setRoom(res.data);
      } catch (err) {
        console.error("Failed to refresh room", err);
      }
    };

    socket.on("player_joined", refreshRoom);
    socket.on("game_started", ({ roomCode: gameRoomCode }) => {
      navigate(`/game/${gameRoomCode}`);
    });

    return () => {
      socket.off("player_joined");
      socket.off("game_started");
    };
  }, [socket, user, roomCode]);

  const handleStartGame = () => {
    socket.emit("start_game", { roomCode });
  };

  const copyCode = () => {
    navigator.clipboard.writeText(roomCode);
  };

  const handleInvite = async (friendId, friendName) => {
    setInviteError(null);
    try {
      await friendAPI.sendInviteEmail(friendId, roomCode);
      setInvitedIds((prev) => [...prev, friendId]);
    } catch (err) {
      setInviteError(`Failed to invite ${friendName}`);
    }
  };

  if (error)
    return <div style={{ padding: "2rem", color: "#A44A3F" }}>{error}</div>;
  if (!room)
    return <div style={{ padding: "2rem" }}>Loading room...</div>;

  return (
    <div style={{
      minHeight: "100vh", background: "#F5E8D3",
      display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center", gap: "24px",
    }}>
      <h1 style={{
        fontFamily: "Cormorant Garamond, serif",
        fontSize: "2.5rem", color: "#7A5C46", margin: 0,
      }}>
        Game Lobby
      </h1>

      {/* Room code */}
      <div style={{
        background: "#fff", border: "2px solid #7A5C46",
        borderRadius: "12px", padding: "20px 40px",
        textAlign: "center", boxShadow: "3px 3px 0px #D9B86A",
      }}>
        <p style={{
          margin: "0 0 8px", color: "#8c6f61", fontSize: "12px",
          fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em",
        }}>
          Room Code
        </p>
        <p style={{
          margin: 0, fontSize: "2.5rem", fontWeight: 900,
          color: "#3D2B1F", letterSpacing: "0.2em",
        }}>
          {roomCode}
        </p>
        <button
          onClick={copyCode}
          style={{
            marginTop: "10px", padding: "6px 16px", background: "#7A5C46",
            color: "#F5E8D3", border: "none", borderRadius: "6px",
            fontSize: "12px", fontWeight: 600, cursor: "pointer",
          }}
        >
          Copy Code
        </button>
      </div>

      {/* Players list */}
      <div style={{
        background: "#fff", border: "2px solid #7A5C46",
        borderRadius: "12px", padding: "20px", minWidth: "300px",
        boxShadow: "3px 3px 0px #D9B86A",
      }}>
        <p style={{
          margin: "0 0 12px", fontWeight: 700, color: "#7A5C46",
          textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.08em",
        }}>
          Players ({room.players?.length ?? 0}/{room.maxPlayers})
        </p>
        {room.players?.map((p, i) => (
          <div key={i} style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            padding: "8px 0",
            borderBottom: i < room.players.length - 1 ? "1px solid #e8d9c8" : "none",
          }}>
            <span style={{ fontWeight: 600, color: "#3D2B1F" }}>
              {p.displayName} {p.isHost && "👑"}
            </span>
            <span style={{ fontSize: "12px", color: "#8c6f61" }}>
              {p.displayName === user?.username ? "You" : "Joined"}
            </span>
          </div>
        ))}
      </div>

      {/* Invite friends */}
      {user && (
        <div style={{
          background: "#fff", border: "2px solid #7A5C46",
          borderRadius: "12px", padding: "20px", minWidth: "300px",
          boxShadow: "3px 3px 0px #D9B86A",
        }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: showFriends ? "12px" : 0 }}>
            <p style={{ margin: 0, fontWeight: 700, color: "#7A5C46", textTransform: "uppercase", fontSize: "12px", letterSpacing: "0.08em" }}>
              Invite Friends
            </p>
            <button
              onClick={() => setShowFriends((p) => !p)}
              style={{
                padding: "4px 12px", background: "#7A5C46", color: "#F5E8D3",
                border: "none", borderRadius: "6px", fontSize: "12px",
                fontWeight: 600, cursor: "pointer",
              }}
            >
              {showFriends ? "Hide" : "Show Friends"}
            </button>
          </div>

          {showFriends && (
            <>
              {inviteError && (
                <p style={{ color: "#A44A3F", fontSize: "12px", fontWeight: 600, margin: "0 0 8px" }}>
                  {inviteError}
                </p>
              )}
              {friends.length === 0 ? (
                <p style={{ color: "#8c6f61", fontSize: "13px", margin: 0 }}>
                  No friends to invite yet.
                </p>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                  {friends.map((f) => {
                    const alreadyInRoom = room.players?.some((p) => p.displayName === f.username);
                    const invited       = invitedIds.includes(f._id);
                    return (
                      <div key={f._id} style={{
                        display: "flex", justifyContent: "space-between", alignItems: "center",
                        padding: "8px 12px", background: "#fffdf8",
                        border: "1px solid #d8c6b4", borderRadius: "8px",
                      }}>
                        <span style={{ fontWeight: 600, color: "#3D2B1F", fontSize: "13px" }}>
                          👤 {f.username}
                        </span>
                        {alreadyInRoom ? (
                          <span style={{ fontSize: "11px", color: "#9CAF88", fontWeight: 700 }}>
                            ✓ In lobby
                          </span>
                        ) : invited ? (
                          <span style={{ fontSize: "11px", color: "#6C8AA6", fontWeight: 700 }}>
                            ✓ Invited
                          </span>
                        ) : (
                          <button
                            onClick={() => handleInvite(f._id, f.username)}
                            style={{
                              padding: "5px 12px", background: "#6C8AA6",
                              color: "#F5E8D3", border: "none", borderRadius: "6px",
                              fontSize: "12px", fontWeight: 700, cursor: "pointer",
                            }}
                          >
                            📧 Invite
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Start button — host only */}
      {isHost ? (
        <>
          <button
            onClick={handleStartGame}
            disabled={room.players?.length < 3}
            style={{
              padding: "14px 48px", background: "#A44A3F", color: "#F5E8D3",
              border: "none", borderRadius: "10px", fontWeight: 800,
              fontSize: "16px", cursor: "pointer",
              boxShadow: "3px 3px 0px #D9B86A",
              opacity: room.players?.length < 3 ? 0.6 : 1,
            }}
          >
            Start Game
          </button>
          {room.players?.length < 3 && (
            <p style={{ color: "#8c6f61", fontSize: "13px", fontWeight: 600, margin: 0 }}>
              Need at least {3 - (room.players?.length ?? 0)} more player
              {3 - room.players?.length !== 1 ? "s" : ""} to start
            </p>
          )}
        </>
      ) : (
        <p style={{ color: "#8c6f61", fontWeight: 600 }}>
          Waiting for host to start the game...
        </p>
      )}
    </div>
  );
}