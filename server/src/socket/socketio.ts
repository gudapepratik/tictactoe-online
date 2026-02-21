import { randomUUID, UUID } from "node:crypto";
import {Server, Socket} from "socket.io"
import { Game, GameState, Player, PlayerAvatar, PlayerInput, PlayerType, Session } from "../types/game";
import { createEmptyBoard, isWinner, resetBoard } from "../utils/gameLogic";
import { generateGameCode } from "../utils/gameCodeGenerator";
import {parse} from "cookie"
import * as jwt from "jsonwebtoken"
import { AuthTokenPayload } from "../types/jwt";

interface EventResponse<T> {
  (ok: boolean, message: string, data: T) : void
}
/*
  emitters (io):
    1. game:players
    2. game:update
  listners:
    1. game:create
    2. game:join
    3. game:input
*/

let games: Map<UUID,Game> = new Map(); // <roomId, Game>
let joinCodeMap : Map<string, {gameId: UUID, socketId?: string, lockExpiryBy?: Date}> = new Map(); // to map game code to gameid
let sessions: Map<string, Session> = new Map();

const initSocketio = (io: Server) => {
  console.log("Socket Server running")
  io.on("connection", (socket: Socket) => {
    console.log(`Socket client ${socket.id} connected !!`)

    socket.on("disconnect", () => {
      const username = socket.data?.user?.username;
      const playerSession = sessions.get(username);
      if(!playerSession) return;

      const game = games.get(playerSession.gameId);
      if(!game) return;

      const player = game.playerO?.username === playerSession.username ? game.playerO : game.playerX?.username === playerSession.username ? game.playerX : null;
      if(!player) return;

      player.connected = false;
      sessions.delete(username);

      io.to(`game:${playerSession.gameId}`).emit("player:offline", {username: playerSession.username, type: playerSession.type});
      console.log(`Socket client ${socket.id} disconnected !!`)
    })

    socket.on("Hello", (username: string, type: PlayerType, res: EventResponse<{name: string, type: string}>) => {
      res?.(true, `Welcome user ${username} type ${type}`, {name: username, type: type});
    })

    socket.on("player:authenticate", (res: EventResponse<{username: string}| null>) => {
      try {
        const raw = socket.handshake.headers.cookie;
        if(!raw) throw new Error("No cookie")

        const {token} = parse(raw);
        const payload = jwt.verify(token!, process.env.SECRET_KEY!) as AuthTokenPayload;

        socket.data.user = {
          username: payload.username
        }
        
        res?.(true, "User authenticated successfully", {username: payload.username});
      } catch (error) {
        if(error instanceof Error)
          res?.(false, `Player Auth Error: ${error.message}`, null);
        res?.(false, "Player Auth Error: Unexpected error has occurred", null);
      }
    })

    socket.on("game:create",(username: string, type: PlayerType, avatar: PlayerAvatar, res: EventResponse<{gameId: UUID, joinLink: string} | null>) => {
      // check if player is already in any game
      let isAlready = false;

      for(const game of games.values()) {
        if(game?.playerX?.username === username || game?.playerO?.username === username) {
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
        // socketId: socket.id,
        wins: 0,
        isHost: true,
        connected: false
      }

      // create game
      const game: Game = {
        board: createEmptyBoard(),
        turn: type,
        playerX: type === "X" ? player : null,
        playerO: type === "O" ? player : null,
        createdAt: new Date(),
        round: 1,
        totalRounds: 1,
        isStarted: false
      }

      const gameId : UUID = randomUUID(); 
      games.set(gameId, game);

      // generate join code
      let joinCode = generateGameCode(6);

      // check if the game code is already taken
      while(joinCodeMap.has(joinCode)) {
        // generate new code
        joinCode = generateGameCode(6);
      }

      // create and join room
      // socket.join(`game:${gameId}`);

      // map joinCode to gameId
      joinCodeMap.set(joinCode, {gameId});

      // create joining link
      const joinLink = `${process.env.FRONTEND_URL}/game/private?join=${joinCode}`;

      // send the response
      res?.(true, "Game created", {gameId, joinLink});
    })

    socket.on("game:checkGame", (joinCode: string, res: EventResponse<{gameId: UUID, availableSymbols: PlayerType[], availableAvatars: PlayerAvatar[], expiresIn: string} | null>) => {
      // check for the game
      if(!joinCodeMap.has(joinCode)) {
        res?.(false, "Wrong Code Entered or requested Game does not Exists", null);
        return;
      }

      const value = joinCodeMap.get(joinCode);

      if(!value?.gameId) {
        res?.(false, "Game not found", null);
        return;
      }

      // check lock
      if(
        value.socketId && 
        value.socketId !== socket.id && 
        value.lockExpiryBy && 
        value.lockExpiryBy.getTime() > Date.now()
      ) {
        res?.(false, "Join Locked: Someone is currently joining. Try again shortly.", null);
        return;
      }

      // set the lock for this user
      value.socketId = socket.id;
      value.lockExpiryBy = new Date(Date.now() + 15 * 1000); // 15 seconds lock

      const game = games.get(value.gameId);

      if(!game) {
        res?.(false, "CheckGame Error: Game not Found", null);
        return;
      }

      let availableSymbols : PlayerType[] = [];
      
      if(!game.playerX) availableSymbols.push("X");
      if(!game.playerO) availableSymbols.push("O");
      
      let allAvatars : PlayerAvatar[] = ["prime", "dwarf", "cyborg"];
      const takenAvatars = new Set<PlayerAvatar>();

      if(game.playerX?.avatar) takenAvatars.add(game.playerX.avatar);
      if(game.playerO?.avatar) takenAvatars.add(game.playerO.avatar);

      const availableAvatars = allAvatars.filter(avatar => !takenAvatars.has(avatar));

      if (availableSymbols.length === 0) {
        res?.(false, "Game is already full", null);
        return;
      }

      res?.(true, "Success: Game Available to Join !!", {gameId: value.gameId, availableSymbols, availableAvatars, expiresIn: "15 seconds"})
    })

    socket.on("game:join", (username: string, joinCode: string, gameId: UUID, type: PlayerType, avatar: PlayerAvatar, res: EventResponse<null>) => {      
      // check if user already exists in any game
      let isAlready = false;
      let isGameExists = false;

      for(const game of games.entries()) {
        if(game[0] === gameId) isGameExists = true;
        if(!isAlready) {
          if(game[1]?.playerX?.username === username || game[1]?.playerO?.username === username) {
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
        // socketId: socket.id,
        type,
        wins: 0,
        isHost: false,
        connected: false
      }
      
      // add in game
      if(type === "X") {
        game.playerX = player;
      } else {
        game.playerO = player;
      }

      // join game room
      // socket.join(`game:${gameId}`);

      // remove the joinCode
      joinCodeMap.delete(joinCode);

      res?.(true, `Player ${username} joined game ${gameId}`, null);

      // broadcast message
      io.to(`game:${gameId}`).emit("game:players", {playerX: game.playerX, playerO: game.playerO});
    })

    socket.on("game:connect", (gameId: UUID, res: EventResponse<Game | null>) => {
      try {
        // 1. check if game exitsts
        const game = games.get(gameId);
        if(!game) throw new Error("Game not found !");
        
        // 2. username
        const playerUsername = socket.data?.user?.username;
        if(!playerUsername) throw new Error("Player username not found !")
        
        // 3. check if player exists in game
        const player = game.playerO?.username === playerUsername ? game.playerO : game.playerX?.username === playerUsername ? game.playerX : null;
        if(!player)
          throw new Error(`Player does not exists in Game ${gameId}`)
        
        // create player session
        sessions.set(playerUsername, {
          gameId: gameId,
          type: player.type,
          username: playerUsername
        })
        player.connected = true;

        // join socket to room
        socket.join(`game:${gameId}`);
        
        // 4. send game state (full)
        res?.(true, "Player connected to game..", game);

        socket.to(`game:${gameId}`).emit("player:connected", player);
      } catch (error) {
        if(error instanceof Error) {
          res?.(false, error.message, null);
        } else {
          res?.(false, "Game Connect Error: Unexpected error occurred !", null);
        }
      }
    })

    socket.on("game:start", (gameId: UUID, totalRounds: number, res: EventResponse<null>) => {
      try {
        const playerUsername = socket.data.user.username;
        if(!playerUsername) throw new Error("Username not Found")
        if(totalRounds > 10) throw new Error("Game rounds can't be > 10")

        const game = games.get(gameId);
        if(!game) throw new Error("Game Not found")
    
        // check if game is already started or running
        if(game.isStarted) throw new Error("Game has already started")

        // check if both players are joined
        if(!game.playerX || !game.playerO) throw new Error("Other player has not joined yet !!")

        // get player check if host or not
        const player : Player | null = game.playerX?.username === playerUsername ? game.playerX : game.playerO?.username === playerUsername ? game.playerO : null
        if(!player) throw new Error("Player Instance not matching")
        if(!player.isHost) throw new Error("Only host can start the game")

        // start the game
        game.totalRounds = totalRounds;
        game.round = 1;
        game.isStarted = true;
        
        io.to(`game:${gameId}`).emit("game:started", {totalRounds: totalRounds, round: 1, isStarted: true});
        
        res?.(true, "Game has started !!", null);
      } catch (error) {
        console.log("game:start Error: ", error);
        if(error instanceof Error) {
          res?.(false, error.message, null)
        }
        res?.(false, "Game Start Error: Unexpected error occurred", null);
      }
    })
    
    socket.on("game:makeMove", (gameId: UUID, idx: number, res: EventResponse<null>) => {
      try {
        if(idx < 0 || idx > 8) throw new Error("Invalid Cell index")

        const game = games.get(gameId);
        
        if(!game) throw new Error("Game not Found !!")
        const session = sessions.get(socket.data?.user?.username);

        if(!session) throw new Error("Player not connected to the game")
        const player : Player | null = game.playerX?.username === session.username ? game.playerX : game.playerO?.username === session.username ? game.playerO : null;
        if(!player || !player.connected) throw new Error("Player not found or currently offline !!")
        if(player.type !== game.turn) throw new Error("Invalid Move, Other players turn")
        
        const row = Math.floor(idx / 3);
        const col = idx % 3;

        if(game.board[row][col] !== "E") throw new Error("Invalid Move, Cell already filled")
        
        game.board[row][col] = game.turn === "X" ? "X" : "O";
        
        const isWin = isWinner(game.board, [row, col], game.turn);
        if(isWin) {
          player.wins += 1;

          // reset board
          resetBoard(game.board);

          // next round
          if(game.totalRounds === game.round) {
            // game over. find the final winner
            if(game.playerO?.wins! === game.playerO?.wins) {
              game.winner = "draw";
            } else if(game.playerX?.wins! > game.playerO?.wins!) {
              game.winner = "X";
            } else {
              game.winner = "O";
            }
          } else {
            game.round += 1; // next round
          }
        }
        game.turn = game.turn === "X" ? "O" : "X";

        const gameState : GameState = {
          idx: idx,
          player: player.username,
          symbol: player.type,
          roundWinner: isWin ? player.type : null,
          gameWinner: game.winner ? game.winner : null,
          isGameOver: game.winner !== undefined
        }
  
        // broadcast the game state
        io.to(`game:${gameId}`).emit("game:update", gameState);
  
        // ack response
        res?.(true, "Game Input: input Registered successfully !", null);
      } catch (error) {
        if(error instanceof Error) {
          res?.(false, error.message, null);
          console.log("Player Move Error", error?.message);
          return;
        }
        res?.(false, "Player Move Error: Unexpected Error occurred", null);
        console.log("Player Move Error: Unexpected Error occurred");
      }
    })


  })
}

export default initSocketio;