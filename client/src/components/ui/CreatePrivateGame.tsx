import { useState, type ReactNode } from "react";
import type { IconType } from "react-icons";
import { FaO, FaXmark } from "react-icons/fa6";
import { GiCyborgFace, GiDwarfFace } from "react-icons/gi";
import { SiPrimefaces } from "react-icons/si";
import { useSocket } from "../../hooks/useSocket";
import { useNavigate } from "react-router-dom";
import { api } from "../../api/apiClient";
import { emitAsync } from "../../utils/asyncSocketEmitter";

type PlayerAvatar = {value: "cyborg", icon: IconType} | {value: "dwarf", icon: IconType} | {value: "prime", icon: IconType};
type CreateGameData = {
  gameId: string
  joinLink: string
}

const avatars : PlayerAvatar[] = [
  {value: "cyborg", icon: GiCyborgFace},
  {value: "dwarf", icon: GiDwarfFace},
  {value: "prime", icon: SiPrimefaces},
]

function CreatePrivateGame() {
  const [symbol, setSymbol] = useState<"X" | "O">("X");
  const [avatar, setAvatar] = useState<"cyborg" | "dwarf" | "prime">("cyborg");
  const [username, setUsername] = useState<string>("");
  const {socket, isSocketConnected} = useSocket();
  const [isGameCreated, setIsGameCreated] = useState<boolean>(false);
  const navigate = useNavigate();

  const handleSubmit: React.SubmitEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    try {
      if(!isSocketConnected || !socket) return;
      console.log(symbol, avatar, username);
  
      // 1. create token
      await api.post("/api/auth/user", {username});
      
      // 2. authenticate the user
      await emitAsync(socket, "player:authenticate");

      const data = await emitAsync<CreateGameData>(
        socket,
        "game:create",
        username, 
        symbol,
        avatar
      )

      setIsGameCreated(true);
      const {gameId, joinLink} = data;

      alert(`Game ${gameId} Created Successfully. Send this Code to a friend: ${joinLink}`)
  
      alert("Redirecting to game in 3 seconds...")
      // navigate to game 
      // setTimeout(() => {
      //   navigate(`/game/${gameId}`)
      // }, 3 * 1000)

    } catch (error) {
      console.log("Create Private Error: ", error);
      if(error instanceof Error)
        alert(error.message);
    }
  }

  const handleUsernameChange: React.ChangeEventHandler<HTMLInputElement, HTMLInputElement> = (e) => {
    setUsername(e.target.value);
  }

  return (
    <div className="font-slackey">
      <form onSubmit={handleSubmit} className="flex w-full flex-col gap-8 md:gap-6">
        <div className="flex flex-col items-start w-full gap-1">
          <label htmlFor="username" className="text-zinc-800 text-base md:text-xl">Usern@me</label>
          <input type="text" name="username" id="username" value={username} required onChange={handleUsernameChange} className="border-4 border-zinc-400 focus:border-zinc-600 focus:scale-[1.02] transition-transform focus:outline-none px-2 w-full text-base md:text-lg text-zinc-800" placeholder="Enter a username..."/>
        </div>

        <div className="flex flex-col items-start w-full gap-1">
          <label className="text-zinc-800 text-base md:text-xl">Select your symbol</label>

          <div className="w-full flex items-center gap-4 md:gap-10 justify-center">
            <label className={`cursor-pointer hover:scale-110 ${symbol === "X" ? "scale-110": "scale-100"} transition-transform`}>
              <input type="radio" name="symbol" checked={symbol === "X"} value={"X"} onChange={() => setSymbol("X")} className="hidden"/>
              <FaXmark className={`${symbol === "X" ? "bg-red-600" : "bg-zinc-900 bg-opacity-55"} hover:bg-red-600 size-[60px] md:size-[100px] `} />
            </label>

            <label  className={`cursor-pointer hover:scale-110 ${symbol === "O" ? "scale-110": "scale-100"} transition-transform`}>
              <input type="radio" name="symbol"  checked={symbol === "O"} value={"O"} onChange={() => setSymbol("O")} className="hidden"/>
              <FaO className={`${symbol === "O" ? "bg-red-600" : "bg-zinc-900 bg-opacity-55"} hover:bg-red-600 p-1 size-[60px] md:size-[100px]`}/>
            </label>
          </div>
        </div>

        <div className="flex flex-col items-start w-full gap-1">
          <label className="text-zinc-800 text-base md:text-xl">Select your avatar</label>
          <div className="w-full flex items-center gap-4 md:gap-10 justify-center">
            {avatars.map((av) => (
              <label key={av.value} className={`cursor-pointer hover:scale-110 ${avatar === av.value ? "scale-110": "scale-100"} transition-transform`}>
                <input type="radio" name="avatar" checked={avatar === av.value} value={av.value} onChange={() => setAvatar(av.value)} className="hidden"/>
                <av.icon className={` ${avatar === av.value ? "bg-green-500" : "bg-zinc-900 bg-opacity-55"} hover:bg-green-500 p-1 size-[60px] md:size-[100px] flex items-center justify-center`}/>
              </label>
            ))}
          </div>
        </div>

        <div className="flex w-full justify-center">
          <button 
            className={`text-xl md:text-4xl border-4 w-fit  rounded-2xl px-2 md:px-6 py-2 md:py-3 hover:scale-110 bg-red-500 hover:bg-red-600  transition-all`}
            type="submit"
            >{!isGameCreated ? "Create Game": "Game Created"}</button>
        </div>
      </form>
    </div>
  )
}

export default CreatePrivateGame;