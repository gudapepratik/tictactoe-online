import { randomUUID, UUID } from "node:crypto";
import {Server, Socket} from "socket.io"

interface EventResponse {
  (ok: boolean, message: string, data: any) : void
}

type Cell = "X" | "O" | "E";
type Board = Cell[][];
type PlayerAvatar = "alien" | "robot" | "cyborg";
type PlayerType = "X" | "O";

type Player = {
  username: string
  socketId: string
  avatar: PlayerAvatar
  type: PlayerType
}

interface Game {
  board: Board;
  turn: PlayerType;
  playerX: Player | null;
  playerO: Player | null;
  winner?: "X" | "O" | "draw";
}


function createEmptyBoard(): Board {
  return Array.from({length: 3}, () =>
    Array.from({length: 3}, () => "E" as Cell)
  )
}

let games: Map<UUID,Game> = new Map(); // <roomId, Game>

const initSocketio = (io: Server) => {
  io.on("connection", (socket: Socket) => {
    console.log(`Socket client ${socket.id} connected !!`)

    socket.on("disconnect", () => {
      console.log(`Socket client ${socket.id} disconnected !!`)
    })

    socket.on("game:create",(username: string, type: PlayerType, avatar: PlayerAvatar, res: EventResponse) => {
      // check if socket is already in any game
      let isAlready = false;

      for(const game of games.values()) {
        if(game?.playerX?.socketId === socket.id || game?.playerO?.socketId === socket.id) {
          isAlready = true;
          break;
        }
      }

      if(isAlready) {
        res?.(false, "Game is Already running...", null);
        return;
      }

      const player: Player = {
        username,
        type,
        avatar,
        socketId: socket.id,
      }

      // create game
      const game: Game = {
        board: createEmptyBoard(),
        turn: type,
        playerX: type === "X" ? player : null,
        playerO: type === "O" ? player : null
      }

      const gameId : UUID = randomUUID(); 
      games.set(gameId, game);

      // create and join room
      socket.join(`game:${gameId}`);

      // create joining link
      const joinLink = `${process.env.FRONTEND_URL}/private?join=${gameId}&avl_type=${type === "X"? "O" : "X"}`;

      // send the response
      res?.(true, "Game created", {gameId, joinLink});
    })

    socket.on("game:join", (username: string, gameId: UUID, type: PlayerType, avatar: PlayerAvatar, res: EventResponse) => {
      // check if user already exists in any game
      let isAlready = false;
      let isGameExists = false;

      for(const game of games.entries()) {
        if(game[0] === gameId) isGameExists = true;
        if(!isAlready) {
          if(game[1]?.playerX?.socketId === socket.id || game[1]?.playerO?.socketId === socket.id) {
            isAlready = true;
          }
        }
      }

      if(isAlready) {
        res?.(false, "Error Joining: User already exists in some game", null);
        return;
      }
      if(!isGameExists) {
        res?.(false, "Error Joining: Game with given ID does not exists or is Over", null);
        return;
      }
      
      // get game and add player
      const game = games.get(gameId);
      if(!game) {
        res?.(false, "Error Joining: Request Game not Found", null);
        return;
      }

      // check if username is already taken by other user
      const isSameUsername = (type === "X" && game.playerO?.username === username) || (type === "O" && game.playerX?.username === username);
      if(isSameUsername) {
        res?.(false, "Error Joining: Player with same username already exists in game, Please use different username", null);
        return;
      }

      // check if type of player mismatched
      const isTypeAlreadyExists = (type === "X" && game.playerX) || (type === "O" && game.playerO);
      if(isTypeAlreadyExists) {
        res?.(false, `Error Joining: Player with Same type \"${type}\" already exists`, null);
        return;
      }

      const player : Player = {
        username,
        avatar,
        socketId: socket.id,
        type
      }
      
      // add in game
      if(type === "X") {
        game.playerX = player;
      } else {
        game.playerO = player;
      }

      // join game room
      socket.join(`game:${gameId}`);

      res?.(true, `Player ${username} joined game ${gameId}`, null);

      // broadcast message
      io.to(`game:${gameId}`).emit("game:players", {playerX: game.playerX, playerO: game.playerO});
    })

    
    // turn (whos turn ?), move: {row: , col: }, username
    // socket.on("game:input", )

    
  })
}

export default initSocketio;