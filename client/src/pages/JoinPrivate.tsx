import { useEffect, useState } from "react";
import Modal from "../components/Modal";
import JoinPrivateGame from "../components/ui/JoinPrivateGame";
import { useSearchParams } from "react-router-dom";
import { useSocket } from "../hooks/useSocket";
import type { PlayerAvatar, PlayerType } from "../types/game";

type GameValidateData = {
  gameId: string
  availableSymbols: PlayerType[]
  availableAvatars: PlayerAvatar[]
  expiresIn: string
}

function JoinPrivate() {
  const [closeModal, setCloseModal] = useState<boolean>(false);
  const [joinCode, setJoinCode] = useState<string>("");
  const [isVerified, setIsVerified] = useState<boolean>(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const {socket, isSocketConnected} = useSocket();
  const [availableSymbols, setAvailableSymbols] = useState<PlayerType[]>([]);
  const [availableAvatars, setAvailableAvatars] = useState<PlayerAvatar[]>([]);
  const [gameId, setGameId] = useState<string | null>(null);

  useEffect(() => {
    const joinCode = searchParams.get("join");
    if(joinCode)
      setJoinCode(joinCode);
    console.log(joinCode)

    // check if already verified
    if(isVerified) return;

    socket?.emit("game:checkGame", joinCode, (ok: boolean, message: string, data: GameValidateData | null) => {
      if(!ok || !data) {
        console.log("Game Verification Error", message);
        alert(message);
        setIsVerified(false);
        return;
      }

      setGameId(data.gameId);
      setAvailableSymbols(data.availableSymbols);
      setAvailableAvatars(data.availableAvatars);
      
      console.log("Game Validated Successfully")
      alert(message);
      setIsVerified(true);
    })
  }, [isSocketConnected]);

  return (
    <div className="w-full h-screen bg-primaryBG">
      <Modal
        children = {
        <JoinPrivateGame 
          gameId={gameId}
          joinCode={joinCode}
          availableSymbols={availableSymbols}
          availableAvatars={availableAvatars}
        />
        }
        setCloseModal={setCloseModal}
        title="Join Private"
        height=""
        width='70%'
        extraStyles={{
          containerStyles: "bg-zinc-100",
          titleStyles: "text-zinc-800"
        }}
      />
    </div>
  )
};

export default JoinPrivate;