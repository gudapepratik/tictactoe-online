import { useEffect, useState } from "react";
import { useSocket } from "../../hooks/useSocket";
import { FaO, FaXmark } from "react-icons/fa6";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { GiCyborgFace, GiDwarfFace } from "react-icons/gi";
import { SiPrimefaces } from "react-icons/si";
import type { IconType } from "react-icons";
import type { PlayerAvatar, PlayerType } from "../../types/game";
import { api } from "../../api/apiClient";
import { emitAsync } from "../../utils/asyncSocketEmitter";

type PlayerAvatarIcon = {value: "cyborg", icon: IconType} | {value: "dwarf", icon: IconType} | {value: "prime", icon: IconType};
type props = {
  joinCode: string
}

type GameValidateData = {
  gameId: string
  availableSymbols: PlayerType[]
  availableAvatars: PlayerAvatar[]
  expiresIn: string
}

const avatars : PlayerAvatarIcon[]= [
  {value: "cyborg", icon: GiCyborgFace},
  {value: "dwarf", icon: GiDwarfFace},
  {value: "prime", icon: SiPrimefaces},
]

function JoinPrivateGame({joinCode} : props) {
  const {socket} = useSocket();
  const [isGameJoined, setIsGameJoined] = useState<boolean>(false);
  const [username, setUsername] = useState<string>("");
  const [symbol, setSymbol] = useState<"X" | "O" | null>(null);
  const [avatar, setAvatar] = useState<string | null>(null);
  const [isAccountCreated, setIsAccountCreated] = useState<boolean>(false);
  const [availableSymbols, setAvailableSymbols] = useState<PlayerType[]>([]);
  const [availableAvatars, setAvailableAvatars] = useState<PlayerAvatar[]>([]);
  const [gameId, setGameId] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleJoinSubmit : React.SubmitEventHandler<HTMLFormElement>  = async (e) => {
    e.preventDefault();
    try {
      // username: string, joinCode: string, gameId: UUID, type: PlayerType, avatar: PlayerAvatar, res: EventResponse<null>
      if(!username || !symbol || !avatar || !gameId || !joinCode || !socket) throw new Error("Unexpected Error")

      // join the game
      await emitAsync(socket, "game:join", username, joinCode, gameId, symbol, avatar);

      setIsGameJoined(true);
      alert("Redirecting to game in 3 seconds...")

      setTimeout(() => {
        navigate(`/game/${gameId}`)
      }, 3 * 1000)
    } catch (error) {
      console.log("Error Joining the Game", error);
      if(error instanceof Error) {
        alert(error.message);
      }
    }
  } 

  const handleCreateAccount = async () => {
    try {
      if(!socket) return;

      // 1. create token
      await api.post("/api/auth/user", {username});

      socket.disconnect();
      socket.connect();

      await new Promise<void>((resolve) => {
        socket.once("connect", () => resolve());
      })
      
      // 2. authenticate the user
      await emitAsync(socket, "player:authenticate");

      // 3. validate game
      const data = await emitAsync<GameValidateData>(socket, "game:checkGame", joinCode);

      setGameId(data.gameId);
      setAvailableAvatars(data.availableAvatars);
      setAvailableSymbols(data.availableSymbols);
      setIsAccountCreated(true);

      alert("Account Created and Game Verified");
    } catch (error) {
      if(error instanceof Error)
        console.log("Create Account Error", error?.message);
      console.log("Create Account Error");
      setIsAccountCreated(false);
    }
  }

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (e) => {
    setUsername(e.target.value);
  }

  return (
      <div className="font-slackey">
      <form onSubmit={handleJoinSubmit} className="flex w-full flex-col gap-8 md:gap-6">
        <div className="flex flex-col items-start w-full gap-1">
          <label htmlFor="username" className="text-white neon-pink text-base md:text-xl">Usern@me</label>
          <div className="flex w-full flex-col md:flex-row items-center gap-2 md:gap-0 justify-between">
            <input type="text" name="username" id="username" disabled={isAccountCreated} value={username} required onChange={handleUsernameChange} className="border-4 border-zinc-400 focus:border-zinc-600 md:w-[70%] w-full focus:scale-[1.02] transition-transform focus:outline-none px-2  text-base md:text-lg text-zinc-800" placeholder="Enter a username..."/>
            <button type="button" onClick={handleCreateAccount} className={`text-white text-[10px] md:text-lg border-4 w-fit md:px-4 md:py-2 px-3 py-2 rounded-lg md:rounded-2xl ${!isAccountCreated ? "hover:scale-110 bg-red-500 hover:bg-red-600" : "bg-green-500"}   transition-all`}>{!isAccountCreated ? "Create account" : "Account Created"}</button>
          </div>
        </div>

        <div className="flex flex-col items-start w-full gap-1">
          <label className="text-white neon-pink text-base md:text-xl">Select your symbol</label>

          <div className="w-full flex items-center gap-4 md:gap-10 justify-center">
            <label className={` ${availableSymbols.includes("X") ? "hover:scale-110 cursor-pointer" : ""} ${symbol === "X" ? "scale-110": "scale-100"} transition-transform`}>
              <input type="radio" name="symbol" disabled={!availableSymbols.includes("X")} checked={symbol === "X"} value={"X"} onChange={() => setSymbol("X")} className="hidden"/>
              <FaXmark className={`${symbol === "X" ? "bg-red-600" : "bg-zinc-900 bg-opacity-55"} ${availableSymbols.includes("X") ? "hover:bg-red-600" : ""}  size-[60px] md:size-[100px] `} />
              {!availableSymbols.includes("X") && <div className="absolute z-30 top-5 md:top-10 text-white text-center -rotate-45 bg-red-600 text-[8px] md:text-xs">Already Taken</div>}
            </label>

            <label className={` ${availableSymbols.includes("O") ? "hover:scale-110 cursor-pointer" : ""}  ${symbol === "O" ? "scale-110": "scale-100"} transition-transform`}>
              <input type="radio" name="symbol" disabled={!availableSymbols.includes("O")}  checked={symbol === "O"} value={"O"} onChange={() => setSymbol("O")} className="hidden"/>
              <FaO className={`${symbol === "O" ? "bg-red-600" : "bg-zinc-900 bg-opacity-55"} ${availableSymbols.includes("O") ? "hover:bg-red-600" : ""}  p-1 size-[60px] md:size-[100px]`}/>
              {!availableSymbols.includes("O") && <div className="absolute z-30 top-5 md:top-10 text-white text-center -rotate-45 bg-red-600 text-[8px] md:text-xs">Already Taken</div>}
            </label>
          </div>
        </div>

        <div className="flex flex-col items-start w-full gap-1">
          <label className="text-white neon-pink text-base md:text-xl">Select your avatar</label>
          <div className="w-full flex items-center gap-4 md:gap-10 justify-center">
            {avatars.map((av) => (
              <label key={av.value} className={` ${availableAvatars.includes(av.value) ? "hover:scale-110 cursor-pointer" : ""} ${avatar === av.value ? "scale-110": "scale-100"} transition-transform`}>
              <input type="radio" name="avatar" disabled={!availableAvatars.includes(av.value)} checked={avatar === av.value} value={av.value} onChange={() => {if(av.value) setAvatar(av.value)}} className="hidden"/>
                <av.icon className={` ${avatar === av.value ? "bg-green-500" : "bg-zinc-900 bg-opacity-55"} ${availableAvatars.includes(av.value) ? "hover:bg-green-500" : ""} p-1 size-[60px] md:size-[100px] flex items-center justify-center`}/>
                {!availableAvatars.includes(av.value) && <div className="absolute z-30 top-5 md:top-10 text-white text-center -rotate-45 bg-red-600 text-[8px] md:text-xs">Already Taken</div>}
              </label>
            ))}
          </div>
        </div>

        <div className="flex w-full justify-center">
          <button 
            className={`text-xl md:text-3xl border-4 w-fit  rounded-2xl px-2 md:px-6 py-2 md:py-3 ${isGameJoined ? "bg-green-500" : "bg-red-500 hover:bg-red-600 hover:scale-110"}  transition-all`}
            type="submit"
            disabled={!isAccountCreated}
            >{!isGameJoined ? "Join Game": "Game Joined"}</button>
        </div>
      </form>
    </div>
  )
}

export default JoinPrivateGame;