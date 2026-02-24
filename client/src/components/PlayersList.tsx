import type { IconType } from "react-icons";

type Player = {
  avatar?: IconType;
  username: string;
  type: "X" | "O";
  wins: number;
  borderColor: string;
  connected: boolean;
};

type Props = {
  players: Player[];
  turn: "X" | "O";
  myUsername?: string;
};

function PlayersList({ players, turn, myUsername }: Props) {
  return (
    <div className="w-full p-3 flex flex-col gap-3 font-pressStart2P">
      {players.length === 0 && (
        <p className="text-gray-500 text-[10px] text-center blink">
          Waiting for players…
        </p>
      )}
      {players.map((p) => {
        const isActiveTurn = turn === p.type;
        const isX = p.type === "X";

        return (
          <div
            key={p.username}
            className={`relative flex items-center gap-3 p-3 bg-[#0d0d20] border-2 transition-all duration-300 ${isX
                ? isActiveTurn
                  ? "border-cyan-400 animate-turnPulse"
                  : "border-gray-700"
                : isActiveTurn
                  ? "border-pink-500 animate-turnPulsePink"
                  : "border-gray-700"
              }`}
          >
            {/* Active turn indicator */}
            {isActiveTurn && (
              <span
                className={`absolute -left-4 top-1/2 -translate-y-1/2 text-xs ${isX ? "neon-blue" : "neon-pink"
                  } blink`}
              >
                ▶
              </span>
            )}

            {/* Avatar */}
            <div
              className={`shrink-0 flex items-center justify-center w-12 h-12 border-2 ${isX ? "border-cyan-600" : "border-pink-600"
                } bg-[#080818]`}
            >
              {p.avatar && (
                <p.avatar
                  className={`text-3xl ${isX ? "text-cyan-400" : "text-pink-400"}`}
                />
              )}
            </div>

            {/* Info */}
            <div className="flex flex-col gap-1 flex-1 min-w-0">
              {/* Username + badge */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-[10px] truncate ${isX ? "neon-blue" : "neon-pink"
                    }`}
                >
                  {p.username}
                </span>
                {myUsername === p.username && (
                  <span className="text-[8px] bg-gray-700 px-1 text-gray-300">
                    YOU
                  </span>
                )}
              </div>

              {/* Symbol + connection */}
              <div className="flex items-center gap-2">
                <span
                  className={`text-[9px] ${isX ? "text-cyan-600" : "text-pink-600"}`}
                >
                  [{p.type}]
                </span>
                <span
                  className={`inline-block w-2 h-2 rounded-full ${p.connected ? "bg-green-400 shadow-[0_0_6px_#4ade80]" : "bg-red-500"
                    }`}
                />
                <span className="text-[8px] text-gray-500">
                  {p.connected ? "ONLINE" : "OFFLINE"}
                </span>
              </div>
            </div>

            {/* Win count */}
            <div className="text-right shrink-0">
              <p className="text-[8px] text-gray-500">WINS</p>
              <p
                className={`text-lg font-bold ${isX ? "neon-blue" : "neon-pink"
                  }`}
              >
                {p.wins}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}

export default PlayersList;