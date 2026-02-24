import type { Dispatch, SetStateAction } from "react";

type Props = {
  startGame: () => void;
  setRounds: Dispatch<SetStateAction<number>>;
  rounds: number;
  isHost: boolean;
  isGameStarted: boolean;
};

function GameSettings({ startGame, setRounds, rounds, isHost, isGameStarted }: Props) {
  const clamp = (v: number) => Math.max(1, Math.min(10, v));

  return (
    <div className="w-full p-4 font-pressStart2P text-[11px] flex flex-col gap-5">
      {/* Rounds setting */}
      <div className="flex flex-col gap-2">
        <label className="text-gray-400 text-[9px]">ROUNDS (1–10)</label>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setRounds((r) => clamp(r - 1))}
            disabled={!isHost || isGameStarted}
            className="retro-btn text-cyan-400 border-cyan-700 w-8 h-8 text-sm disabled:opacity-30"
          >
            −
          </button>
          <span className="neon-blue text-sm w-6 text-center">{rounds}</span>
          <button
            onClick={() => setRounds((r) => clamp(r + 1))}
            disabled={!isHost || isGameStarted}
            className="retro-btn text-cyan-400 border-cyan-700 w-8 h-8 text-sm disabled:opacity-30"
          >
            +
          </button>
        </div>
      </div>

      {/* Start button */}
      {isHost && !isGameStarted && (
        <button
          onClick={startGame}
          className="retro-btn text-green-400 border-green-500 px-4 py-3 text-[11px] animate-neonPulse"
          style={{ color: "#4ade80" }}
        >
          ▶ START GAME
        </button>
      )}

      {!isHost && (
        <p className="text-gray-600 text-[9px] blink">
          Waiting for host to start…
        </p>
      )}

      {isGameStarted && (
        <p className="neon-green text-[9px]">● GAME IN PROGRESS</p>
      )}
    </div>
  );
}

export default GameSettings;