import type { Dispatch, SetStateAction } from "react";

type props = {
  startGame: () => void
  setRounds: Dispatch<SetStateAction<number>>
  rounds: number
  isHost: boolean
}

function GameSettings({startGame, setRounds, rounds, isHost}: props) {
  return (
    <div className="w-full p-2 font-pressStart2P text-[12px]">
      <table className="w-full">
        <thead className="" style={{height: "40px"}}>
          <tr>
            <th>Setting</th>
            <th>Value</th>
          </tr>
        </thead>

        <tbody className="text-center">
            <tr style={{height: "50px"}}>
              <td>Rounds</td>
              <td>
                <input 
                  type="number" 
                  name="" 
                  value={rounds} 
                  id="" 
                  disabled={!isHost}
                  min={1}
                  max={10}
                  onChange={(e) => setRounds(Number(e.target.value))}
                  className="w-12 bg-zinc-800 text-white p-2"
                  />
              </td>
            </tr>

            {isHost && (
              <tr style={{height: "50px"}}>
                <td>Start Game</td>
                <td>
                  <button 
                  onClick={() => startGame()}
                  className="bg-green-500 p-2 rounded-md border-4 hover:scale-105"
                  >Start Game</button>
                </td>
              </tr>
            )}
        </tbody>
      </table>
    </div>
  )
}

export default GameSettings;