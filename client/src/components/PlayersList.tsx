import type { IconType } from "react-icons";

type Player =  {
  avatar: IconType
  username: string
  type: "X" | "O"
  wins: number
  borderColor: string
}

type props = {
  players: Player[]
  turn: "X" | "O" // whose turn ?
}
function PlayersList({players, turn}: props) {
  return (
    <div className="w-full p-2 font-pressStart2P text-[12px]">
      <table className="w-full">
        <thead className="" style={{height: "40px"}}>
          <tr>
            <th>Avatar</th>
            <th>Username</th>
            <th>Wins</th>
          </tr>
        </thead>

        <tbody className="text-center">
          {players.map((p, idx) => (
            <tr key={idx} style={{height: "50px"}} className={` ${turn === p.type ? `border-4  ${p.borderColor}`: ``} `}>
              <td><div className="flex justify-center items-center"><p.avatar className="text-[33px] md:text-4xl"/></div></td>
              <td className="">{p.username} <p className="text-sm">{"(" + p.type + ")"}</p> </td>
              <td>{p.wins}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default PlayersList;