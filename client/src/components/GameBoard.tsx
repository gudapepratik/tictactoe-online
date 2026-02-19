import { useState } from "react";
import type { Socket } from "socket.io-client";
import { useSocket } from "../hooks/useSocket";

type Cell = "X" | "O" | null

type props = {
  turn: "X" | "O"
  setTurn: React.Dispatch<React.SetStateAction<"X" | "O">>
}

function GameBoard({turn, setTurn}: props) {
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const {socket, isSocketConnected} = useSocket();

  const handleClick = async (idx: number) => {
    if(!socket) return;
    try {
      const row = idx / 3;
      const col = idx % 3;
  
      socket.emit("game:makeMove", )
    } catch (error) {
      
    }
  }

  return (
    <div className="grid grid-cols-3 w-[300px] h-[300px] border-4 border-cyan-400 shadow-[0_0_20px_#22d3ee]">
      {Array.from({length: 9}, (_, i) => (
        <div 
        key={i}
        onClick={() => handleClick(i)}
        >
          <span
            className={board[i] === "X" ? "text-cyan-400 drop-shadow-[0_0_6px_#22d3ee]": "text-pink-500 drop-shadow-[0_0_6px_#ff2bd6]"}
          >
            {board[i]}
          </span>
        </div>
      ))}
    </div>
  )
}

export default GameBoard;