import { FaO, FaXmark } from "react-icons/fa6";

type Cell = "X" | "O" | null

type props = {
  board: Cell[]
  turn: "X" | "O"
  handlePlayerMove: (idx: number) => void
}

function GameBoard({board, turn, handlePlayerMove}: props) {
  return (
    <div className="grid grid-cols-3 w-[300px] h-[300px] border-4">
      {Array.from({ length: 9 }, (_, i) => {
        const row = Math.floor(i / 3);
        const col = i % 3;

        const borders = [
          col !== 2 && "border-r-2", // not last column
          row !== 2 && "border-b-2"  // not last row
        ].join(" ");

        return (
          <div
            key={i}
            onClick={() => {
              if(board[i] !== null) return; // ignore click if already filled
              handlePlayerMove(i)
            }}
            className={`flex items-center justify-center ${borders} cursor-pointer ${turn === "X" ? "hover:drop-shadow-[0_0_6px_#22d3ee] hover:bg-blue-400/20" : "hover:bg-pink-500/20 hover:drop-shadow-[0_0_6px_#ff2bd6]"} `}
          >
            <span
              className={
                board[i] === "X"
                  ? "text-cyan-400 drop-shadow-[0_0_6px_#22d3ee]"
                  : "text-pink-500 drop-shadow-[0_0_6px_#ff2bd6]"
              }
            >
              {!board[i] ? "E" : board[i] === "X" ? <FaXmark size={30}/> : <FaO size={30}/>}
            </span>
          </div>
        );
      })}
    </div>
  )
}

export default GameBoard;