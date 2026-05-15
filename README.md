# Clueless

A full-stack web-game where guests and registered users can play Clueless. Guests can sign up, view the home page, and create or join a game. Registered users have all the functionality a guest does plus an interactive friendslist and a statistics dashboard of their wins/losses.

## Minimum Viable Product
Our MVP includes a simple board game (similar to Clue or Murdoku) where users can play as a guest or log in (2 role-based account types), connect with a game room code or link, take turns playing, use a working dice, and have one full gridmap working with associated characters, weapons, and locations.


---
## Trailer
- 

---
## Live Link: 
- https://cluelessgame.netlify.app/
---
## Team

| Members | Roles                                   |
|---------|-----------------------------------------|
| Ivy     | Full-Stack Developer / Project Manager  |
| Thien   | Full-Stack Developer / Game Mechanic    | 
| Angelo  | Full-Stack Developer / Backend          |
| Annika  | Full-Stack Developer / Frontend UI & UX |

---

## Proof of Collaboration

<img width="1916" height="909" alt="Screenshot 2026-05-14 110643" src="https://github.com/user-attachments/assets/c651ff1f-89d9-4111-92e0-e6d29a6ce56d" />

Example contributions:

- Ivy — Frontend/Backend Routing, Error Pages (401 + 404), Socket (Multiplayer Game & Lobby), Leaderboard/Profile Stats, Friend Lists/Requests, nodemailer Lobby Invites, Randomized Guest Names
- Thien — General Game Mechanics, Grid Setup, Player Movement, Shuffling Deck, Selecting Murder Cards, Room Boundaries, Jest Unit Testing
- Angelo — Project Setup, Backend-Database Connection (MongoDB), User vs Guest models, JWT Authentication, Backend Routing, Socket (Updating to Multiplayer Game Mechanics) 
- Annika — Frontend UI/UX design, Landing Page, Dashboard Folder Layout, ../dashboard/boards Future Board Options, Rules Page, Board Themes/Design, Cards (Characters, Weapons, and Rooms), Rolling Dice Animation

---


## Moore's Vision Template

#### FOR fans of Clue
#### WHO are looking for an online alternative to the board game.
#### THE product, ClueLess, is a web game 
#### THAT users can play as a guest or log in to connect with a game room code or link and take turns playing
#### Unlike the Clue board game, mobile app, or Murdoku game 
#### Our product is online, free, and combines the cute style of Murdoku with the strategy of Clue.

Inspired by:
- Clue
- Murdoku
- lefun.fun Clue web-game

---

# Tech Stack

## Frontend
- React + Vite
- Tailwind CSS + DaisyUI
- React Router
- Socket.io-client
- Framer Motion
- React Icons

## Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Socket.io
- JWT Tokens/Authentication
- Nodemailer (Invite Codes)

## Authentication
- JWT Authentication
- Role-Based Authorization

## Unit Testing
- Jest
  
---

# User Roles

## Guest
- Create an account-free session with a randomized display name (e.g. "Sneaky Armadillo")
- Join an existing game via room code
- Play a full game session
- Session expires after 24 hours — no persistent data saved

## Registered User
- Login
- User dashboard
- Create a game
- Join an existing game via room code
- Play a full game session
- Persistent profile with username
- Win/loss statistics tracked across games
- Friends list — send and accept friend requests by username
- Invite friends to a lobby via email directly from the lobby page
- Leaderboard ranking by games won

---

# Features

## Authentication System
- Register/Login
- Role-based routes
- Protected routes
- Anonymous guest accounts created in MongoDB with `isGuest: true` and a 24-hour expiry

## Role-Based Route Protection
- `ProtectedRoute` — any authenticated user including guests
- `RegisteredRoute` — registered users only, bounces guests to `/unauthorized`
- Unauthorized and 404 pages with navigation back to home

## User Dashboard
- Access registered user features
- List of all boards & Create/Join Game buttons
- Friends
- Leaderboard
- Rules
- Profile

## Real-Time Multiplayer (Socket.io)
- Persistent WebSocket connection per player authenticated via JWT handshake
- Room-based socket channels — events are scoped to `roomCode`
- Events: `join_room`, `leave_room`, `start_game`, `roll_dice`, `move_player`, `make_suggestion`, `refute_suggestion`, `make_accusation`, `end_turn`, `abandon_game`
- Private card dealing — each player receives only their own hand via targeted `socket.emit`
- Turn enforcement server-side — only the active player can roll or move
- Auto-advances turn when no one can refute a suggestion
- Game ends early if a player disconnects and active count drops below 3

## Game Mechanics
- Solution selected randomly at game start — never sent to clients during play
- Remaining cards shuffled and dealt evenly across players (round-robin)
- Players spawn at separate hallway positions outside rooms
- Movement validated server-side using `PlayerMovement` class and board layout JSON
- Reachable tiles calculated via BFS and sent to the active player after dice roll
- Interrogation only available when player is inside a room (not the Accusation Room)
- Accusation only available from the Accusation Room
- Wrong accusation eliminates the player — they can no longer accuse but remain in the game
- All other players are notified of eliminations in real time

## Detective Notepad
- Private per-player checklist of all suspects, weapons, and rooms
- Cards in your own hand are auto-marked as confirmed (safe)
- Cards shown to you during refutation are auto-marked as confirmed
- Click any item to manually toggle confirmed ✓ / denied ✗
- State persists for the entire game session

## Friends & Invites
- Search registered users by username and send friend requests
- Incoming requests shown in Friends page, polled every 30 seconds
- Accept or decline requests — both users added to each other's `friends[]` array
- Remove friends at any time
- From any lobby: open "Invite Friends" panel, click Invite next to a friend's name
- Email sent via Nodemailer with the room code and a direct lobby join link
- Friends already in the lobby are marked "In lobby" — no double invite

## Leaderboard
- Ranks registered users by `gamesWon` descending
- Top 20 players displayed
- Guests excluded — no persistent stats
- Top 3 receive gold/silver/bronze styling

---

# JWT Authentication Flow

- Token generation on login/registration (jwt.sign({id})) then returned to frontend alongside user data
- Token stored in frontend in localStorage (for persistence after frontend closed but backend is up) and as a React state (easily callable during session)
- When making authenticated API calls, tokens are sent in the Authorization header needed by all protected API endpoints
- Token verification works in protect where the token is extracted from the Authorization header then verified against the jwt secret- if valid, attaches the user data to the requested object else returns 401
- Any routes that need authentcation use that protect middleware

---

# Email Notifications
Clueless uses Nodemailer with Gmail SMTP to send email invites for users in a lobby wanting to invite someone on their friendslist.

1. Player opens the Invite Friends panel in the lobby
2. Clicks Invite next to a friend's name
3. `POST /api/friends/invite-email` is called with `{ friendId, roomCode }`
4. Server fetches the friend's email from MongoDB
5. Nodemailer sends an HTML email with the room code and a direct lobby link
6. The invited friend clicks "Join the Game" and lands in the lobby

<img width="1419" height="567" alt="Screenshot 2026-05-14 103135" src="https://github.com/user-attachments/assets/86888b27-510b-47a1-83a3-bfad77ac4613" />
 
---

# Database Models

## Users
- username
- email
- password
- role
- isGuest
- expiresAt
- isActive
- stats.gamesPlayed
- stats.gamesWon
- stats.gamesLost
- stats.totalGuesses
- stats.correctGuesses
- friends
- friendRequests

## Rooms (Lobby)
- code
- status
- players
- maxPlayers
- gameId

## Games
- roomId
- players
- solution
- currentTurnIndex
- turnPhase
- diceRolls
- guesses
- status
- winnerId

---

# API Endpoints
 
### Authentication (`/api/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user, returns JWT | Public |
| POST | `/login` | Login, returns JWT | Public |
| POST | `/guest` | Create guest session, returns JWT | Public |
| GET | `/me` | Get current user from token | Protected |

### Rooms (`/api/rooms`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/` | Create a new room | Protected |
| GET | `/:code` | Get room by code | Public |

### Users (`/api/user`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/leaderboard` | Top 20 users by wins | Public |
| GET | `/:id/stats` | Get user stats | Protected |
| PATCH | `/:id` | Update username or avatar | Protected |

### Friends (`/api/friends`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/` | Get my friends list | Protected |
| GET | `/requests` | Get pending friend requests | Protected |
| POST | `/request/:username` | Send friend request | Protected |
| POST | `/accept/:userId` | Accept a request | Protected |
| POST | `/decline/:userId` | Decline a request | Protected |
| DELETE | `/:userId` | Remove a friend | Protected |
| POST | `/invite-email` | Send lobby invite email | Protected |

### Game (`/api/game`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| GET | `/grid` | Get board layout JSON | Public |
| GET | `/:id` | Get game by ID (solution hidden) | Protected |

---

# Protected vs Public Backend Routes

| Type | Routes |
|------|--------|
| Public | `POST /api/auth/register`, `POST /api/auth/login`, `POST /api/auth/guest`, `GET /api/rooms/:code` |
| Protected (any user) | `GET /api/auth/me`, `POST /api/rooms`, `GET /api/user/:id/stats` |
| Protected (registered only) | `GET /api/friends`, `POST /api/friends/*`, `PATCH /api/user/:id` |
| Admin only | Future moderation routes via `adminOnly` middleware |

---

# Pages & Frontend Routes

### Public
| Route | Page | Description |
|-------|------|-------------|
| `/` | Landing | Hero page, login/register/guest modal |
| `/unauthorized` | Unauthorized | 401 page with login button |
| `/*` | NotFound | 404 page |

### Guest + Registered
| Route | Page | Description |
|-------|------|-------------|
| `/lobby/:roomCode` | Lobby | Waiting room, player list, invite friends |
| `/game/:roomCode` | Game | Full board, actions, notepad |

### Registered Only
| Route | Page | Description |
|-------|------|-------------|
| `/dashboard/boards` | Boards | Create/join games, active game cards |
| `/dashboard/friends` | Friends | Friend list, requests, search |
| `/dashboard/leaderboard` | Leaderboard | Top players by wins |
| `/dashboard/rules` | Rules | How to play |
| `/dashboard/profile` | Profile | Stats, win rate, logout |

---

# System Architecture


The architecture follows a classic three-tier pattern:

- **Browser** — React client communicates with the server over two channels simultaneously: standard HTTP REST for stateless operations (auth, room creation, friend requests) and a persistent WebSocket connection via Socket.io for all real-time game events.
- **Server** — Express handles both channels. The REST API covers auth, rooms, users, and friends. Socket.io manages the game loop (dice, movement, suggestions, accusations, turn advancement). JWT middleware protects all authenticated routes. Game logic (card dealing, turn engine, board validation) runs server-side so no client can cheat.
- **Data** — MongoDB Atlas stores all persistent state. Nodemailer sits beside the server as an external SMTP relay — it only activates when a player sends a lobby invite email to a friend.
---

# UI Main Theme

Colors:
| Name | Hex |
|------|-----|
| Tea Brown | `#7A5C46` |
| Cream Paper | `#F5E8D3` |
| Sage Green | `#9CAF88` |
| Brick Red | `#A44A3F` |
| Dusty Blue | `#6C8AA6` |
| Candlelight Gold | `#D9B86A` |

Fonts:
-  Cormorant Garamond — headings and titles
- Inter / DM Sans — body text

---

# Key Design Decisions

### Backend Strategy (Full MERN)

We chose the full MERN stack (MongoDB, Express, React, Node.js) with Socket.io rather than Firebase BaaS or a hybrid approach for the following reasons:
- **Socket.io over Firestore listeners** — turn-based games benefit from push-based events (player moved, card shown, accusation made) rather than polling. Socket.io gives us targeted private emits (`io.to(socketId).emit`) which are essential for sending a player their private hand without broadcasting to others. Firestore has no equivalent.
- **Familiarity** — we have already shipped a full MERN + JWT project. Reusing those patterns (bcrypt, Mongoose schemas, protected routes) saved significant setup time and let us focus on the game itself and using Socket which we had no experience in.

### Database Schema Strategy

- **Solution stored server-side only** — the `solution` field on the Game document is never included in any socket emission during active play. `buildPublicState()` strips it before broadcasting.
- **Room and Game are separate documents** — Room tracks lobby state (who is connected, host, socket IDs, status). Game tracks gameplay state (hands, positions, turn index, guesses). Keeping them separate means the lobby can exist before the game starts and allows querying room status independently of game progress.
- **socketId stored per player** — each player's current socket ID is stored in both the Room and Game documents. This is the key that enables targeted private emits (`deal_hand`, `refute_request`, `card_shown`) to reach only the intended recipient.
- **Guests stored in MongoDB** — guest accounts are real User documents with `isGuest: true` and a 24-hour `expiresAt`. This was simpler than maintaining a separate session store and means guest socket authentication uses the same JWT flow as registered users.
## Non-Functional Requirements
### Security
- **JWT authentication** — all protected routes require a valid signed token. The `protect` middleware verifies signature and expiry before any handler runs.
- **Password hashing** — bcrypt with 12 salt rounds. Plaintext passwords are never stored or logged.
- **Server-authoritative game state** — every game action (roll, move, suggest, accuse) is validated server-side against the current `turnPhase` and the requesting player's identity (`socketId`). Clients cannot skip phases, act out of turn, or read other players' hands.
- **Solution never transmitted** — the murder solution is written to MongoDB at game start and stripped from every outbound emit until the game ends. No client-side code ever receives it during play.

### Performance
- **WebSocket over polling** — socket events fire only when state changes, eliminating the 500ms polling loop that was in the original test implementation. The board no longer hammers the server with GET requests every half-second.
- **Targeted emits** — `io.to(socketId).emit` for private data (hands, refute requests) and `io.to(roomCode).emit` for room-scoped broadcasts. No global broadcasts.
- **Lazy friend list loading** — the invite panel in the lobby only fetches the friend list when the player opens it, not on mount.
- **Single DB read per game action** — socket handlers do one `Game.findOne` per event rather than querying multiple collections. Room and Game documents are kept lean.

### Usability
- **Turn phase UI enforcement** — Roll Dice, Interrogate, Accuse, and End Turn buttons enable and disable automatically based on `turnPhase` state. Players cannot click actions out of sequence.
- **Room position awareness** — Interrogate only appears when the active player is inside a room (not a hallway or the Accusation Room). Accuse only appears in the Accusation Room.
- **Private detective notepad** — suspects, weapons, and rooms are auto-marked as confirmed when a player receives that card in their hand or is shown it during refutation. Players can also manually toggle confirmed/denied.
- **Guest-friendly onboarding** — guests join without registration via a randomized display name. The room code prompt appears immediately after guest login so there is no ambiguity about next steps.
- **Error pages** — 401 Unauthorized and 404 Not Found pages with navigation back to home, styled to match the game aesthetic.
- **Disconnect recovery** — when a socket disconnects, the server marks the player as `isActive: false` in the Room document. If the game drops below 3 active players, it is automatically ended and all remaining players are notified and redirected.
- **Host disconnect closes lobby** — if the host disconnects from the lobby before the game starts, all other players receive a `room_closed` event and are redirected to the home page immediately.
  
---

# Challenges
- **Socket timing** — `game_state` and `deal_hand` events fired before the Game page mounted and registered listeners. Fixed by adding a `get_game_state` socket event that clients emit on mount to re-request their state.
- **Duplicate players in lobby** — React StrictMode double-invoked the socket `useEffect`, causing `join_room` to emit twice. Fixed with an atomic MongoDB `$ne` query that only pushes a player if their `displayName` isn't already in the array.
- **Card hand privacy** — ensuring each player only receives their own hand required targeted `io.to(socketId).emit` rather than broadcasting to the room.
- **Turn phase enforcement** — all game actions (roll, move, suggest, accuse) are validated server-side against the current `turnPhase` in MongoDB so no client can skip phases or act out of turn.
- **Polling vs sockets** — initial board used a REST polling endpoint every 500ms for position updates. Replaced entirely with socket events for real-time multiplayer movement.

---

# Running Locally

## Environment Variables
```
// In Root Directory (same level as frontend & backend folders)
JWT_SECRET=your_secret_key
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/?appName=Cluster0
PORT=3005
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=yourgmail@gmail.com
EMAIL_FROM=yourgmail@gmail.com
EMAIL_PASS=your_16_char_app_password
EMAIL_PREVIEW=false
CLIENT_URL=http://localhost:5173
```

## Backend
```bash
cd backend
npm install
npm run dev
```

## Frontend
```bash
cd frontend
npm install
npm run dev
```

---
