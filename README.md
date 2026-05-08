# Clueless

A full-stack web-game where guests and registered users can play Clueless. Guests can sign up, view the home page, and create or join a game. Registered users have all the functionality a guest does plus an interactive friendslist and a statistics dashboard of their wins/losses.

## Minimum Viable Product
Our MVP includes a simple board game (similar to Clue or Murdoku) where users can play as a guest or log in (2 role-based account types), connect with a game room code or link, take turns playing, use a working dice, and have one full gridmap working with associated characters, weapons, and locations.


---
## Trailer
- 

---
## Live Link: 
- 

## Team

| Members | Roles                                   |
|---------|-----------------------------------------|
| Ivy     | Full-Stack Developer / Project Manager  |
| Thien   | Full-Stack Developer / Game Mechanic    | 
| Angelo  | Full-Stack Developer / Backend          |
| Annika  | Full-Stack Developer / Frontend UI & UX |

---

## Proof of Collaboration


Example contributions:

- Ivy — 
- Thien — 
- Angelo — 
- Annika — 

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
- React
- Vite
- Tailwind CSS
- DaisyUI
- React Router
- React Icons

## Backend
- Node.js + Express.js
- MongoDB + Mongoose
- Nodemailer (Invite Codes)

## Authentication
- 

---

# User Roles

## Guest
- 

## Registered User
- User Dashboard
- Win/Loss Statistics
- Friend's List

---

# Features

## Authentication System
- Register/Login
- Role-based routes
- Protected routes

## User Dashboard
- Manage companies
- Manage users
- View job postings
- Automated Emails

---

# Email Notifications
 
---

# Database Models

## User
- name
- email
- password
- role
- companyName
- companyBio

## Guest
- 

---

# API Endpoints
 
### Authentication (`/routes/auth`)
| Method | Endpoint | Description | Access |
|--------|----------|-------------|--------|
| POST | `/register` | Register new user | Public |
| POST | `/login` | Login, returns JWT | Public |
 
---

# Pages & Routes

### Public
| Route | Page | Description |
|-------|------|-------------|
| `/` | Homepage | Landing page |
| `/auth` | AuthPage | Login/signup |
 
### Guest
| Route | Page | Description |
 
### Registered User Only
| Route | Page | Description |
|-------|------|-------------|
| `/dashboard` | Dashboard | Win/Loss Statistics |

---

## UML State Diagram


---

# System Flow

---

# UI Main Theme

Colors:
-

Fonts:
- 

---

# Challenges

- 

---

# Running Locally

## Environment Variables
```
// In Root Directory (same level as frontend & backend folders)

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
