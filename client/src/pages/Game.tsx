import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GiCyborgFace, GiDwarfFace } from "react-icons/gi";
import { SiPrimefaces } from "react-icons/si";
import type { IconType } from "react-icons";
import GameContainer from "../components/GameContainer";
import PlayersList from "../components/PlayersList";
import GameSettings from "../components/GameSettings";
import GameBoard from "../components/GameBoard";
import { useSocket } from "../hooks/useSocket";
import type { Game, PlayerAvatar } from "../types/game";
import { emitAsync } from "../utils/asyncSocketEmitter";
import { useGameListeners } from "../hooks/useGameListeners";

type Player =  {
  avatar?: IconType
  username: string
  type: "X" | "O"
  wins: number
  borderColor: string
}

// const players: Player[]= [
//   {
//     avatar: GiCyborgFace,
//     username: "Pratik_23",
//     type: "X",
//     wins: 2,
//     borderColor: "border-red-500"
//   },
//   {
//     avatar: GiDwarfFace,
//     username: "a14an251",
//     type: "O",
//     wins: 4,
//     borderColor: "border-blue-500"
//   }
// ]

const avatarIconMap : Map<PlayerAvatar,IconType> = new Map([
  ["cyborg", GiCyborgFace],
  ["prime", SiPrimefaces],
  ["dwarf", GiDwarfFace]
])

function Game() {
  const params = useParams();
  const [gameId, setGameId] = useState<string | undefined>(undefined);
  const [gameRounds, setGameRounds] = useState<number>(1);
  const {socket, isSocketConnected} = useSocket();
  const [username, setUsername] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [turn, setTurn] = useState<"X" | "O">();
  const [totalRounds, setTotalRounds] = useState<number>(0);
  const [round, setRound] = useState<number>(0);
  const [winner, setWinner] = useState<"X" | "O" | "draw" | undefined>();
  const [isHost, setIsHost] = useState<boolean>(false);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);

  useEffect(() => {
    setGameId(params.gameId);

    if(!socket || !params.gameId) return;
    connectToGame(params.gameId);

    // connect/reconnect to the game
    // socket.emit("game:connect");
    
  }, [socket]);

  const connectToGame = async (gameId: string) => {
    try {
      if(!socket) return;
      socket.disconnect();
      socket.connect();
      
      await new Promise<void>((resolve) => {
        socket.once("connect", () => resolve());
      })

      // 1. authenticate the user
      const data = await emitAsync<{username: string}>(socket!, "player:authenticate");
      console.log(data);
      // 2. connect to game
      const gameState = await emitAsync<Game>(socket!, "game:connect", gameId);

      setUsername(data.username);
      console.log(gameState);

      if(gameState.playerX) {
        players.push({
          username: gameState.playerX.username,
          avatar: avatarIconMap.get(gameState.playerX.avatar),
          type: gameState.playerX.type,
          wins: gameState.playerX.wins,
          borderColor: "border-red-500"
        })

        if(data.username === gameState.playerX.username && gameState.playerX.isHost) {
          setIsHost(true);
        }
      }
      if(gameState.playerO) {
        players.push({
          username: gameState.playerO.username,
          avatar: avatarIconMap.get(gameState.playerO.avatar),
          type: gameState.playerO.type,
          wins: gameState.playerO.wins,
          borderColor: "border-green-500"
        })

        if(data.username === gameState.playerO.username && gameState.playerO.isHost) {
          setIsHost(true);
        }
      }

      setTotalRounds(gameState.totalRounds);
      setRound(gameState.round);
      setTurn(gameState.turn);
      setWinner(gameState.winner);
    } catch (error) {
      console.log("Error while connecting with game", error)
    }
  }

  const startGame = async () => {
    try {
      if(gameRounds <= 0 || gameRounds > 10) throw new Error("Game rounds can only be > 0 and < 10")

      if(!socket) return;

      socket.emit("game:start", gameId, gameRounds, (ok: boolean, message: string, data: null) => {
        if(!ok) {
          console.log(message);
          alert("Error while starting the game");
        }
      })
    } catch (error) {
      if(error instanceof Error)
        console.log("Game Start Error: ", error.message);
      console.log("Game Start Error: ", error);
    }
  }

  const handleResetGame = async () => {

  }

  const handleEndGame = async () => {

  }

  useGameListeners({
    onGameStart: (data) => {
      setTotalRounds(data.totalRounds)
      setGameRounds(data.totalRounds)
      setRound(data.round)
      setIsGameStarted(data.isStarted)
      alert("Game Started !!!")
    }
  })
  
  return (
    <div className="bg-primaryBG w-full h-screen crt">
      <div className="w-full h-full flex flex-col justify-start p-4 md:p-6">
        {/* Title  */}
        <div className="flex flex-col md:flex-row gap-2 md:items-end mt-4 md:mt-0 font-pressStart2P">
          <h3 className="text-xl md:text-3xl flex"><p className="text-red-500 animate-bounce">Tic</p><p className="text-green-500 animate-bounce">Tac</p><p className="text-fuchsia-500 animate-bounce">Toe</p></h3>
          <p className="text-[8px] md:text-base">#{gameId}</p>
        </div>

        {/* Game Section - 3 sections further  */}
        <div className="w-full h-full flex flex-col md:flex-row gap-4 md:gap-12">
          {/* Player and Setting section  */}
          <div className="w-full md:w-1/3  h-full md:justify-center mt-5 md:mt-0 justify-start flex flex-col gap-10">
            <GameContainer
              children = {<PlayersList players={players} turn="O"/>}
              isCollapsable = {true}
              title="Players"
              width="350px"
              height=""
              styleClasses={{titleStyles: "font-pressStart2P text-sm"}}
            />

            <GameContainer
              children = {<GameSettings isHost={isHost} setRounds={setGameRounds} startGame={startGame} rounds={gameRounds}/>}
              isCollapsable = {true}
              title="Settings"
              width="350px"
              height=""
              styleClasses={{titleStyles: "font-pressStart2P text-sm"}}
            />
          </div>

          {/* Game Board  */}
          <div className="w-full md:w-1/3 h-full md:justify-center p-2 md:p-0 justify-start items-center flex flex-col gap-10">
            {/* Instructions  */}
            <h4 className="font-pressStart2P text-blue-500 text-[10px] text-nowrap md:text-sm">It's your tua_231"...</h4>

            {/* Board  */}
            <GameBoard/>

            {/* Reset and End Buttons  */}
            <div className="flex items-center justify-center gap-4">
              <button onClick={handleResetGame} className="py-2 px-4 hover:bg-red-600 rounded-md border-2 font-pressStart2P text-[10px] md:text-base hover:scale-105">Reset</button>
              <button onClick={handleEndGame} className="py-2 px-4 hover:bg-red-600 rounded-md border-2 font-pressStart2P text-[10px] md:text-base hover:scale-105">End Game</button>
            </div>

          </div>
        </div>
      </div>
    </div>
  )
}

export default Game;