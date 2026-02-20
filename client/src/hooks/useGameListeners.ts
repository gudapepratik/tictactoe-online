import { useEffect } from "react";
import { useSocket } from "./useSocket";

type GameStartData = {
  totalRounds: number
  round: number
  isStarted: boolean
}

type props = {
  onGameStart: (data: GameStartData) => void
}

export function useGameListeners({onGameStart}: props) {
  const {socket} = useSocket();

  useEffect(() => {
    if(!socket) return;

    const handleGameStart = (data: GameStartData) => onGameStart?.(data);

    socket.on("game:started", handleGameStart);

    return () => {
      socket.off("game:started", handleGameStart);
    }
  },[socket, onGameStart]);
}