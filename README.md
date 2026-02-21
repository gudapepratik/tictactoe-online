# Tic-Tac-Toe Online

A real-time multiplayer Tic-Tac-Toe game built with React, Express, and Socket.io.

## Features

- **Private games** – create a game and share a code with a friend
- **Multi-round sessions** – play multiple rounds and track wins
- **Player avatars** – choose from three unique avatars
- **Real-time gameplay** – instant move sync via WebSockets
- **Disconnection handling** – gracefully handles players going offline
- **Retro pixel-art UI** – CRT-style aesthetic with custom fonts

## Tech Stack

| Layer | Technologies |
|-------|-------------|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS |
| Backend | Node.js, Express 5, TypeScript |
| Real-time | Socket.io |
| Auth | JSON Web Tokens (JWT) |

## Project Structure

```
tictactoe-online/
├── client/          # React frontend (Vite)
│   └── src/
│       ├── components/   # UI components & modals
│       ├── pages/        # Page-level components
│       ├── hooks/        # Custom hooks (useSocket, etc.)
│       ├── contexts/     # React context providers
│       ├── api/          # Axios API helpers
│       └── types/        # TypeScript type definitions
└── server/          # Express backend
    └── src/
        ├── routes/       # REST API routes
        ├── controllers/  # Business logic
        ├── socket/       # Socket.io event handlers
        └── utils/        # Game logic, code generator, error helpers
```

## Getting Started

### Prerequisites

- Node.js 18+
- npm

### Installation

```bash
# Install client dependencies
cd client && npm install

# Install server dependencies
cd server && npm install
```

### Environment Variables

Create a `.env` file inside the `server/` directory:

```env
PORT=8000
FRONTEND_URL=http://localhost:5173
```

### Running in Development

Open two terminals:

```bash
# Terminal 1 – start the backend (http://localhost:8000)
cd server && npm run dev

# Terminal 2 – start the frontend (http://localhost:5173)
cd client && npm run dev
```

### Building for Production

```bash
# Build the frontend
cd client && npm run build

# Start the backend (serves compiled JS)
cd server && npm start
```

## How to Play

1. Open the app and choose an avatar.
2. Select **Play Private** to create a game and get a shareable code.
3. Share the game code with a friend so they can join your private game.
4. Take turns placing your mark (X or O) on the 3×3 grid.
5. The first player to get three in a row wins the round.
6. Win totals are tracked across all rounds in the session.

## Scripts

### Client (`client/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Type-check and build for production |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview the production build |

### Server (`server/`)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start server with nodemon + ts-node |
| `npm start` | Run compiled production build |

## License

ISC
