import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import "../components/LandingPage/Landing.css";
import Login from "./Login";
import Register from "./Register";
import logo from "../assets/Clueless_Favicon.png";
import TextType from "../components/TextType/TextType";
import { motion } from "framer-motion";

import scarlet from "../assets/classic/characters/miss-scarlett.png";
import mustard from "../assets/classic/characters/colonel-mustard.png";
import plum from "../assets/classic/characters/professor-plum.png";

import knife from "../assets/classic/weapons/knife.png";
import candlestick from "../assets/classic/weapons/candle.png";
import revolver from "../assets/classic/weapons/revolver.png";
import Footer from "../components/Footer/Footer.jsx";

const LandingPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState("login");
  const [guestLoading, setGuestLoading] = useState(false);
  const [guestCodePrompt, setGuestCodePrompt] = useState(false);
  const [roomCode, setRoomCode] = useState("");
  const [codeError, setCodeError] = useState(null);

  const { user, loginAsGuest, logout, setError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state?.openLogin) {
      setShowModal(true);
      setModalType("login");
    }
  }, []);

  const fadeUp = {
    hidden: {
      opacity: 0,
      y: 45,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.65,
        ease: "easeOut",
      },
    },
  };

  const staggerParent = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const handlePlayNow = () => {
    if (user) {
      user.isGuest ? setGuestCodePrompt(true) : navigate("/dashboard/boards");

      return;
    }

    setShowModal(true);
    setModalType("login");
    setError(null);
  };

  const handleLogout = () => {
    logout();
  };

  const handleSwitch = (type) => {
    setModalType(type);
    setError(null);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setGuestCodePrompt(false);
    setRoomCode("");
    setCodeError(null);
    setError(null);
  };

  const handleContinueAsGuest = async () => {
    setGuestLoading(true);

    try {
      await loginAsGuest();
      setShowModal(false);
      setGuestCodePrompt(true);
    } catch (err) {
      // error set in context
    } finally {
      setGuestLoading(false);
    }
  };

  const handleGuestJoin = () => {
    if (!roomCode.trim()) return;

    setCodeError(null);
    navigate(`/lobby/${roomCode.trim().toUpperCase()}`);
  };

  return (
    <div className="landing_container">
      <motion.div
        className="landing_content"
        initial={{ opacity: 0, y: 35 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.75, ease: "easeOut" }}
      >
        <motion.img
          src={logo}
          alt="Clueless"
          className="landing_logo"
          initial={{ opacity: 0, scale: 0.8, rotate: -4 }}
          animate={{ opacity: 1, scale: 1, rotate: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />

        <motion.h1
          className="landing_title"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.65 }}
        >
          Clueless
        </motion.h1>

        <motion.p
          className="landing_description"
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.65 }}
        >
          <TextType
            text={[
              "Solve the mystery before your opponents do. Find the suspect, weapon, and room. Enter the mansion and follow the clues.",
            ]}
            typingSpeed={55}
            showCursor={true}
            cursorCharacter="|"
          />
        </motion.p>

        {user ? (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "12px",
            }}
          >
            <p
              style={{
                color: "#F5E8D3",
                fontWeight: 600,
                margin: 0,
                fontSize: "14px",
              }}
            >
              Logged in as <strong>{user.username}</strong>
              {user.isGuest && " (Guest)"}
            </p>

            <motion.button
              className="landing_btn"
              onClick={handlePlayNow}
              whileHover={{ y: -3, scale: 1.03 }}
              whileTap={{ y: 3, scale: 0.98 }}
            >
              {user.isGuest ? "JOIN GAME" : "PLAY NOW"}
            </motion.button>

            <button
              onClick={handleLogout}
              style={{
                background: "none",
                border: "1px solid #F5E8D3",
                color: "#F5E8D3",
                padding: "8px 24px",
                borderRadius: "8px",
                fontWeight: 600,
                fontSize: "13px",
                cursor: "pointer",
                opacity: 0.8,
                transition: "opacity 0.15s ease",
              }}
              onMouseOver={(e) => (e.target.style.opacity = "1")}
              onMouseOut={(e) => (e.target.style.opacity = "0.8")}
            >
              Log Out
            </button>
          </div>
        ) : (
          <motion.button
            className="landing_btn"
            onClick={handlePlayNow}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.45, duration: 0.65 }}
            whileHover={{ y: -3, scale: 1.03 }}
            whileTap={{ y: 3, scale: 0.98 }}
          >
            PLAY NOW
          </motion.button>
        )}
      </motion.div>

      <motion.div
        className="landing_scroll_content"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.08 }}
        variants={staggerParent}
      >
        <motion.section className="landing_story_section" variants={fadeUp}>
          <p className="landing_small_title">The Mystery Begins</p>

          <h2>Explore the mansion. Question everyone. Solve the case.</h2>

          <p>
            Clueless is a cozy detective board game where every player is trying
            to uncover the hidden suspect, weapon, and room before anyone else
            does.
          </p>
        </motion.section>

        <motion.section className="landing_rules_grid" variants={staggerParent}>
          <motion.div className="landing_rule_card" variants={fadeUp}>
            <span>🎲</span>
            <h3>Roll</h3>
            <p>Move across the mansion board and reach different rooms.</p>
          </motion.div>

          <motion.div className="landing_rule_card" variants={fadeUp}>
            <span>🔎</span>
            <h3>Interrogate</h3>
            <p>Ask about suspects, weapons, and rooms to eliminate clues.</p>
          </motion.div>

          <motion.div className="landing_rule_card" variants={fadeUp}>
            <span>🕯️</span>
            <h3>Accuse</h3>
            <p>Enter the center room and make your final accusation.</p>
          </motion.div>
        </motion.section>

        <motion.section className="landing_showcase" variants={fadeUp}>
          <div className="landing_showcase_text">
            <p className="landing_small_title">Meet the Suspects</p>

            <h2>Everyone has a secret.</h2>

            <p>
              Choose your character and move carefully. Any player could hold
              the clue you need to solve the mystery.
            </p>
          </div>

          <div className="landing_image_row">
            <motion.img
              src={scarlet}
              alt="Scarlet"
              whileHover={{ y: -8, rotate: -2 }}
            />

            <motion.img
              src={mustard}
              alt="Mustard"
              whileHover={{ y: -8, rotate: 2 }}
            />

            <motion.img
              src={plum}
              alt="Plum"
              whileHover={{ y: -8, rotate: -2 }}
            />
          </div>
        </motion.section>

        <motion.section className="landing_showcase reverse" variants={fadeUp}>
          <div className="landing_image_row">
            <motion.div
              className="weapon_card"
              whileHover={{ y: -7, scale: 1.03 }}
            >
              <img src={knife} alt="Knife" />
            </motion.div>

            <motion.div
              className="weapon_card"
              whileHover={{ y: -7, scale: 1.03 }}
            >
              <img src={candlestick} alt="Candlestick" />
            </motion.div>

            <motion.div
              className="weapon_card"
              whileHover={{ y: -7, scale: 1.03 }}
            >
              <img src={revolver} alt="Revolver" />
            </motion.div>
          </div>

          <div className="landing_showcase_text">
            <p className="landing_small_title">Collect the Evidence</p>

            <h2>The weapon changes everything.</h2>

            <p>
              Search for clues and figure out which weapon was used before the
              other players uncover the truth first.
            </p>
          </div>
        </motion.section>
      </motion.div>
      <Footer />
      {showModal && (
        <div className="modal_overlay" onClick={handleCloseModal}>
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <button className="modal_close" onClick={handleCloseModal}>
              ×
            </button>

            {modalType === "login" && (
              <Login
                onSwitch={() => handleSwitch("register")}
                onGuestClick={handleContinueAsGuest}
                guestLoading={guestLoading}
              />
            )}

            {modalType === "register" && (
              <Register
                onSwitch={() => handleSwitch("login")}
                onGuestClick={handleContinueAsGuest}
                guestLoading={guestLoading}
              />
            )}
          </div>
        </div>
      )}

      {guestCodePrompt && (
        <div className="modal_overlay" onClick={handleCloseModal}>
          <div className="modal_content" onClick={(e) => e.stopPropagation()}>
            <button className="modal_close" onClick={handleCloseModal}>
              ×
            </button>

            <div
              className="form_area"
              style={{
                padding: "30px 40px",
                gap: "16px",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <h2 className="title">Enter Room Code</h2>

              <p
                style={{
                  color: "#8c6f61",
                  fontSize: "13px",
                  margin: 0,
                  textAlign: "center",
                }}
              >
                Ask the host for the 6-character room code
              </p>

              <input
                type="text"
                className="form_style"
                placeholder="e.g. AB12CD"
                value={roomCode}
                onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                maxLength={6}
                style={{
                  letterSpacing: "0.15em",
                  textAlign: "center",
                  fontWeight: 700,
                  fontSize: "18px",
                }}
              />

              {codeError && (
                <p style={{ color: "#A44A3F", fontWeight: 600, margin: 0 }}>
                  {codeError}
                </p>
              )}

              <button
                className="btn"
                onClick={handleGuestJoin}
                disabled={roomCode.trim().length !== 6}
              >
                Join Game
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LandingPage;
