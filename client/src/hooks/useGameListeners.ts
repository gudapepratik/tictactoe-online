import { useEffect } from "react";
import { useSocket } from "./useSocket";
import type { GameState, Player, PlayerAvatar, PlayerType } from "../types/game";

type GameStartData = {
  totalRounds: number
  round: number
  isStarted: boolean
}

type PlayerOfflineData = {
  username: string
  type: PlayerType
}

type PlayerConnectedData = {
  username: string;
  avatar: PlayerAvatar;
  type: PlayerType;
  wins: number;
  isHost: boolean;
  connected: boolean;
}


type props = {
  onGameStart: (data: GameStartData) => void
  onPlayerOffline: (data: PlayerOfflineData) => void
  onPlayerConnected: (data: Player) => void
  onPlayerMove: (data: GameState) => void
}


// player:connected
// player:offline

export function useGameListeners({onGameStart, onPlayerOffline, onPlayerConnected, onPlayerMove}: props) {
  const {socket} = useSocket();

  useEffect(() => {
    if(!socket) return;

    const handleGameStart = (data: GameStartData) => onGameStart?.(data);
    const handlePlayerOffline = (data: PlayerOfflineData) => onPlayerOffline?.(data)
    const handlePlayerConnected = (data: PlayerConnectedData) => onPlayerConnected?.(data)
    const handlePlayerMove = (data: GameState) => onPlayerMove?.(data);

    socket.on("game:started", handleGameStart);
    socket.on("player:offline", handlePlayerOffline);
    socket.on("player:connected", handlePlayerConnected);
    socket.on("game:update", handlePlayerMove);

    return () => {
      socket.off("game:started", handleGameStart);
      socket.off("player:offline", handlePlayerOffline);
      socket.off("player:connected", handlePlayerConnected);
      socket.off("game:update", handlePlayerMove);
    }
  },[socket, onGameStart, onPlayerOffline, onPlayerConnected, onPlayerMove]);
}