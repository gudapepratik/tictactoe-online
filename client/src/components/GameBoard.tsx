import { useState, useRef } from "react";
import { FaXmark } from "react-icons/fa6";
import { FaO } from "react-icons/fa6";

type Cell = "X" | "O" | null;

type Props = {
  board: Cell[];
  turn: "X" | "O";
  handlePlayerMove: (idx: number) => void;
  /** Username of the local player */
  mySymbol?: "X" | "O" | null;
  /** Is it this player's turn? */
  isMyTurn?: boolean;
};

function GameBoard({ board, turn, handlePlayerMove, mySymbol, isMyTurn = true }: Props) {
  const [justPlaced, setJustPlaced] = useState<number | null>(null);
  const prevBoard = useRef<Cell[]>(Array(9).fill(null));

  // detect which cell was most recently placed
  board.forEach((cell, i) => {
    if (cell !== null && prevBoard.current[i] === null) {
      if (justPlaced !== i) setJustPlaced(i);
    }
  });
  prevBoard.current = [...board];

  const isTurnX = turn === "X";
  const hoverClass = isTurnX
    ? "hover:bg-cyan-400/10 hover:drop-shadow-[0_0_8px_#22d3ee]"
    : "hover:bg-pink-500/10 hover:drop-shadow-[0_0_8px_#ff2bd6]";

  return (
    <div
      className={`relative grid grid-cols-3 w-[280px] h-[280px] md:w-[340px] md:h-[340px] bg-[#080818] ${isTurnX ? "pixel-box" : "pixel-box-pink"
        }`}
    >
      {Array.from({ length: 9 }, (_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;

        const borders = [
          col !== 2 && "border-r-2 border-gray-600",
          row !== 2 && "border-b-2 border-gray-600",
        ]
          .filter(Boolean)
          .join(" ");

        const isEmpty = board[i] === null;
        const canClick = isEmpty && isMyTurn;

        return (
          <div
            key={i}
            onClick={() => {
              if (!canClick) return;
              setJustPlaced(i);
              handlePlayerMove(i);
            }}
            className={`flex items-center justify-center ${borders} ${canClick ? `cursor-pointer ${hoverClass}` : "cursor-default"
              } transition-colors duration-100`}
          >
            {board[i] === "X" && (
              <span
                className={`neon-blue ${justPlaced === i ? "animate-cellPop" : ""}`}
              >
                <FaXmark size={56} />
              </span>
            )}
            {board[i] === "O" && (
              <span
                className={`neon-pink ${justPlaced === i ? "animate-cellPop" : ""}`}
              >
                <FaO size={44} />
              </span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default GameBoard;