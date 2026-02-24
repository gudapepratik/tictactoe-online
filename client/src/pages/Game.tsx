import { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { GiCyborgFace, GiDwarfFace } from "react-icons/gi";
import { SiPrimefaces } from "react-icons/si";
import type { IconType } from "react-icons";
import GameContainer from "../components/GameContainer";
import PlayersList from "../components/PlayersList";
import GameSettings from "../components/GameSettings";
import GameBoard from "../components/GameBoard";
import RetroPopup, { type RetroPopupData } from "../components/RetroPopup";
import { useSocket } from "../hooks/useSocket";
import type { Game, PlayerAvatar } from "../types/game";
import { emitAsync } from "../utils/asyncSocketEmitter";
import { useGameListeners } from "../hooks/useGameListeners";

type Player = {
  avatar?: IconType;
  username: string;
  type: "X" | "O";
  wins: number;
  borderColor: string;
  connected: boolean;
};

const avatarIconMap: Map<PlayerAvatar, IconType> = new Map([
  ["cyborg", GiCyborgFace],
  ["prime", SiPrimefaces],
  ["dwarf", GiDwarfFace],
]);

type Cell = "X" | "O" | null;

function Game() {
  const params = useParams();
  const [gameId, setGameId] = useState<string | undefined>(undefined);
  const [gameRounds, setGameRounds] = useState<number>(1);
  const { socket, isSocketConnected } = useSocket();
  const [username, setUsername] = useState<string>("");
  const [players, setPlayers] = useState<Player[]>([]);
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [board, setBoard] = useState<Cell[]>(Array(9).fill(null));
  const [totalRounds, setTotalRounds] = useState<number>(0);
  const [round, setRound] = useState<number>(0);
  const [isGameStarted, setIsGameStarted] = useState<boolean>(false);
  const [isHost, setIsHost] = useState<boolean>(false);

  // Retro popup state
  const [popup, setPopup] = useState<RetroPopupData | null>(null);

  // Queue for popups so we can show one after another
  const [popupQueue, setPopupQueue] = useState<RetroPopupData[]>([]);

  const showPopup = (data: RetroPopupData) => {
    setPopupQueue((q) => [...q, data]);
  };

  const handlePopupDismiss = () => {
    setPopup(null);
    // Show next from queue after a tiny delay
    setPopupQueue((q) => {
      const [, ...rest] = q;
      return rest;
    });
  };

  // Drain queue into active popup
  useEffect(() => {
    if (!popup && popupQueue.length > 0) {
      setPopup(popupQueue[0]);
    }
  }, [popup, popupQueue]);

  // ── Connect to game ──────────────────────────────────────────────
  useEffect(() => {
    setGameId(params.gameId);
    if (!socket || !params.gameId) return;
    connectToGame(params.gameId);
  }, [socket]);

  const connectToGame = async (gameId: string) => {
    try {
      if (!socket) return;
      socket.disconnect();
      socket.connect();

      await new Promise<void>((resolve) => {
        socket.once("connect", () => resolve());
      });

      const data = await emitAsync<{ username: string }>(
        socket!,
        "player:authenticate"
      );
      const gameState = await emitAsync<Game>(socket!, "game:connect", gameId);

      setUsername(data.username);

      const newPlayers: Player[] = [];

      if (gameState.playerX) {
        newPlayers.push({
          username: gameState.playerX.username,
          avatar: avatarIconMap.get(gameState.playerX.avatar),
          type: gameState.playerX.type,
          wins: gameState.playerX.wins,
          borderColor: "border-cyan-400",
          connected: gameState.playerX.connected,
        });
      }
      if (gameState.playerO) {
        newPlayers.push({
          username: gameState.playerO.username,
          avatar: avatarIconMap.get(gameState.playerO.avatar),
          type: gameState.playerO.type,
          wins: gameState.playerO.wins,
          borderColor: "border-pink-500",
          connected: gameState.playerO.connected,
        });
      }

      // Determine if authenticated user is host
      if (
        (gameState.playerX?.username === data.username && gameState.playerX?.isHost) ||
        (gameState.playerO?.username === data.username && gameState.playerO?.isHost)
      ) {
        setIsHost(true);
      }

      setPlayers(newPlayers);
      setTotalRounds(gameState.totalRounds);
      setRound(gameState.round);
      setTurn(gameState.turn);
      setIsGameStarted(gameState.isStarted);

      // Restore board if mid-game
      if (gameState.board) {
        const flat = gameState.board.flat().map((c) =>
          c === "E" ? null : (c as "X" | "O")
        );
        setBoard(flat);
      }
    } catch (error) {
      console.error("Error while connecting with game", error);
    }
  };

  // ── Start game ───────────────────────────────────────────────────
  const startGame = async () => {
    try {
      if (gameRounds <= 0 || gameRounds > 10)
        throw new Error("Game rounds can only be > 0 and ≤ 10");
      if (!socket) return;

      socket.emit(
        "game:start",
        gameId,
        gameRounds,
        (ok: boolean, message: string) => {
          if (!ok) console.error("Game Start Error:", message);
        }
      );
    } catch (error) {
      if (error instanceof Error) console.error("Game Start Error:", error.message);
    }
  };

  // ── Player move ──────────────────────────────────────────────────
  const handlePlayerMove = async (idx: number) => {
    try {
      if (!socket) throw new Error("Socket not available");
      socket.emit(
        "game:makeMove",
        gameId,
        idx,
        (ok: boolean, message: string) => {
          if (!ok) console.error("Move Error:", message);
        }
      );
    } catch (error) {
      console.error("Player move Error", error);
    }
  };

  const handleResetGame = async () => {
    // TODO: emit game:reset when server supports it
  };

  const handleEndGame = async () => {
    // TODO: emit game:end when server supports it
  };

  // ── My symbol ────────────────────────────────────────────────────
  const myPlayer = players.find((p) => p.username === username);
  const mySymbol = myPlayer?.type ?? null;
  const isMyTurn = mySymbol === turn;

  // ── Socket listeners ─────────────────────────────────────────────
  useGameListeners({
    onGameStart: useCallback(
      (data) => {
        setTotalRounds(data.totalRounds);
        setGameRounds(data.totalRounds);
        setRound(data.round);
        setIsGameStarted(data.isStarted);
        setBoard(Array(9).fill(null));
        showPopup({
          type: "gameStart",
          totalRounds: data.totalRounds,
          roundNumber: 1,
        });
      },
      []
    ),

    onPlayerConnected: useCallback(
      (data) => {
        setPlayers((prev) => {
          const exists = prev.find((p) => p.username === data.username);
          if (exists) {
            return prev.map((p) =>
              p.username === data.username ? { ...p, connected: true } : p
            );
          }
          return [
            ...prev,
            {
              username: data.username,
              avatar: avatarIconMap.get(data.avatar),
              type: data.type,
              wins: data.wins,
              borderColor:
                data.type === "X" ? "border-cyan-400" : "border-pink-500",
              connected: data.connected,
            },
          ];
        });

        // determine if this socket's user is host
        if (data.username !== username && data.isHost === false) {
          // the other player just joined – if we're the host we already know
        }
      },
      [username]
    ),

    onPlayerOffline: useCallback((data) => {
      setPlayers((prev) =>
        prev.map((p) =>
          p.username === data.username ? { ...p, connected: false } : p
        )
      );
    }, []),

    onPlayerMove: useCallback(
      (data) => {
        const { idx, symbol, roundWinner, gameWinner, isGameOver } = data;

        if (isGameOver) {
          // Update board first, then show game-over popup
          if (!roundWinner) {
            setBoard((b) =>
              b.map((cell, i) => (i === idx ? symbol : cell))
            );
          }

          if (gameWinner === "draw") {
            showPopup({ type: "gameDraw" });
          } else if (gameWinner) {
            const winnerPlayer = players.find((p) => p.type === gameWinner);
            showPopup({
              type: "gameWin",
              winnerSymbol: gameWinner,
              winnerName: winnerPlayer?.username ?? gameWinner,
            });
          }
        } else if (roundWinner) {
          // Round ended ─ update wins, clear board after popup dismiss
          if (roundWinner === "draw") {
            showPopup({
              type: "roundDraw",
              roundNumber: round,
              totalRounds,
            });
          } else {
            const winnerPlayer = players.find((p) => p.type === roundWinner);
            showPopup({
              type: "roundWin",
              winnerSymbol: roundWinner,
              winnerName: winnerPlayer?.username ?? roundWinner,
              roundNumber: round,
              totalRounds,
            });
            // Increment wins for the winner
            setPlayers((prev) =>
              prev.map((p) =>
                p.type === roundWinner ? { ...p, wins: p.wins + 1 } : p
              )
            );
          }
          // Clear board & advance round
          setBoard(Array(9).fill(null));
          setRound((r) => r + 1);
        } else {
          // Normal move
          setBoard((b) =>
            b.map((cell, i) => (i === idx ? symbol : cell))
          );
        }

        // Advance turn
        const nextTurn = symbol === "X" ? "O" : "X";
        setTurn(nextTurn);
      },
      [players, round, totalRounds]
    ),
  });

  // ── Render ───────────────────────────────────────────────────────
  const waitingForOpponent = players.length < 2;

  return (
    <div className="bg-primaryBG w-full min-h-screen crt relative">
      {/* Active Retro Popup */}
      {popup && (
        <RetroPopup
          data={popup}
          onDismiss={handlePopupDismiss}
          autoDismissMs={popup.type === "gameStart" ? 3500 : 0}
        />
      )}

      <div className="w-full min-h-screen flex flex-col p-4 md:p-6 gap-6">

        {/* ── Header ── */}
        <div className="flex flex-col md:flex-row md:items-end gap-2 mt-2">
          <h1 className="font-pressStart2P text-2xl md:text-4xl flex gap-0">
            <span className="neon-blue flicker">TIC</span>
            <span className="neon-pink flicker" style={{ animationDelay: "0.3s" }}>TAC</span>
            <span className="neon-yellow flicker" style={{ animationDelay: "0.6s" }}>TOE</span>
          </h1>
          <div className="flex items-center gap-3">
            <span className="font-pressStart2P text-[9px] text-gray-500">GAME</span>
            <span className="font-pressStart2P text-[10px] neon-blue">#{gameId}</span>
          </div>
        </div>

        {/* ── Main layout ── */}
        <div className="flex flex-col lg:flex-row gap-6 lg:gap-10 flex-1">

          {/* ── Left panel: Players + Settings ── */}
          <div className="w-full lg:w-[320px] flex flex-col gap-4">
            <GameContainer title="PLAYERS" isCollapsable={true}>
              <PlayersList
                players={players}
                turn={turn}
                myUsername={username}
              />
            </GameContainer>

            <GameContainer title="SETTINGS" isCollapsable={true}>
              <GameSettings
                isHost={isHost}
                setRounds={setGameRounds}
                startGame={startGame}
                rounds={gameRounds}
                isGameStarted={isGameStarted}
              />
            </GameContainer>
          </div>

          {/* ── Centre: Board ── */}
          <div className="flex-1 flex flex-col items-center gap-6">

            {/* Round + Turn indicator */}
            {isGameStarted && (
              <div className="flex flex-col items-center gap-3 animate-slideDown">
                {/* Round counter */}
                <div className="font-pressStart2P text-[10px] text-gray-500">
                  ROUND{" "}
                  <span className="neon-yellow">{round}</span>
                  {" / "}
                  <span className="text-gray-400">{totalRounds}</span>
                </div>

                {/* Turn bar */}
                <div
                  className={`px-5 py-2 border-2 font-pressStart2P text-[10px] flex items-center gap-2 ${turn === "X"
                    ? "border-cyan-500 neon-blue animate-turnPulse"
                    : "border-pink-500 neon-pink animate-turnPulsePink"
                    }`}
                >
                  <span className="blink">▶</span>
                  {isMyTurn
                    ? "YOUR TURN"
                    : `${players.find((p) => p.type === turn)?.username ?? turn
                    }'S TURN`}
                  <span className={`ml-1 ${turn === "X" ? "neon-blue" : "neon-pink"}`}>
                    [{turn}]
                  </span>
                </div>
              </div>
            )}

            {/* Waiting overlay */}
            {!isGameStarted && (
              <div className="flex flex-col items-center gap-4">
                {waitingForOpponent ? (
                  <p className="font-pressStart2P text-[10px] text-gray-500 blink">
                    Waiting for opponent to join…
                  </p>
                ) : (
                  <p className="font-pressStart2P text-[10px] text-gray-500 blink">
                    {isHost ? "Press START GAME when ready!" : "Waiting for host to start…"}
                  </p>
                )}
              </div>
            )}

            {/* Board */}
            <GameBoard
              board={board}
              turn={turn}
              handlePlayerMove={handlePlayerMove}
              mySymbol={mySymbol}
              isMyTurn={isMyTurn && isGameStarted}
            />

            {/* Action buttons */}
            <div className="flex items-center gap-4">
              <button
                onClick={handleResetGame}
                className="retro-btn text-yellow-400 border-yellow-600 px-3 py-2 text-[9px]"
              >
                ↺ RESET
              </button>
              <button
                onClick={handleEndGame}
                className="retro-btn text-red-400 border-red-700 px-3 py-2 text-[9px]"
              >
                ✕ END GAME
              </button>
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="font-pressStart2P text-[8px] text-gray-700 text-center mt-auto pt-4 border-t border-gray-800">
          INSERT COIN TO CONTINUE · © 2025 TICTACTOE ONLINE
        </div>
      </div>
    </div>
  );
}

export default Game;