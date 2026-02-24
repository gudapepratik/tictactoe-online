import { useEffect, useRef, useState } from "react";

export type PopupType =
    | "gameStart"
    | "roundWin"
    | "roundDraw"
    | "gameWin"
    | "gameDraw";

export type RetroPopupData = {
    type: PopupType;
    /** Username of winner (for roundWin / gameWin) */
    winnerName?: string;
    /** "X" or "O" – drives neon colour */
    winnerSymbol?: "X" | "O";
    roundNumber?: number;
    totalRounds?: number;
};

type Props = {
    data: RetroPopupData;
    onDismiss: () => void;
    /** Auto-dismiss delay in ms (0 = never) */
    autoDismissMs?: number;
};

const configs: Record<
    PopupType,
    {
        title: string;
        emoji: string;
        boxClass: string;
        titleClass: string;
    }
> = {
    gameStart: {
        title: "GAME START!",
        emoji: "⚔️",
        boxClass: "pixel-box",
        titleClass: "neon-blue",
    },
    roundWin: {
        title: "ROUND OVER",
        emoji: "🏅",
        boxClass: "",            // overridden by winner colour below
        titleClass: "",
    },
    roundDraw: {
        title: "ROUND DRAW",
        emoji: "🤝",
        boxClass: "pixel-box-yellow",
        titleClass: "neon-yellow",
    },
    gameWin: {
        title: "GAME OVER",
        emoji: "🏆",
        boxClass: "",
        titleClass: "",
    },
    gameDraw: {
        title: "GAME OVER",
        emoji: "⚖️",
        boxClass: "pixel-box-yellow",
        titleClass: "neon-yellow",
    },
};

function getMessage(data: RetroPopupData): string {
    switch (data.type) {
        case "gameStart":
            return `Round 1 of ${data.totalRounds ?? "?"} — FIGHT!`;
        case "roundWin":
            return `${data.winnerName ?? data.winnerSymbol} wins the round!`;
        case "roundDraw":
            return "No winner — It's a DRAW!";
        case "gameWin":
            return `${data.winnerName ?? data.winnerSymbol} WINS THE GAME!`;
        case "gameDraw":
            return "IT'S A DRAW!";
    }
}

export default function RetroPopup({ data, onDismiss, autoDismissMs = 0 }: Props) {
    const [visible, setVisible] = useState(true);
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

    const handleDismiss = () => {
        setVisible(false);
        onDismiss();
    };

    useEffect(() => {
        if (autoDismissMs > 0) {
            timerRef.current = setTimeout(handleDismiss, autoDismissMs);
        }
        return () => {
            if (timerRef.current) clearTimeout(timerRef.current);
        };
    }, []);

    if (!visible) return null;

    // Derive neon colour from winner symbol for win screens
    const isXWin =
        data.winnerSymbol === "X" &&
        (data.type === "roundWin" || data.type === "gameWin");
    const isOWin =
        data.winnerSymbol === "O" &&
        (data.type === "roundWin" || data.type === "gameWin");

    let cfg = { ...configs[data.type] };
    if (isXWin) { cfg.boxClass = "pixel-box"; cfg.titleClass = "neon-blue"; }
    if (isOWin) { cfg.boxClass = "pixel-box-pink"; cfg.titleClass = "neon-pink"; }

    return (
        <div
            className="fixed inset-0 z-[200] flex items-center justify-center bg-black/70"
            onClick={handleDismiss}
        >
            <div
                className={`retro-pop-in relative flex flex-col items-center justify-center gap-4 p-8 md:p-12 bg-[#080818] border-4 border-current ${cfg.boxClass}`}
                style={{ minWidth: 300, maxWidth: 520 }}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Scanline overlay inside popup */}
                <div
                    className="pointer-events-none absolute inset-0 opacity-20"
                    style={{
                        background:
                            "repeating-linear-gradient(to bottom, rgba(255,255,255,0.07) 0px, rgba(255,255,255,0.07) 1px, transparent 2px, transparent 4px)",
                    }}
                />

                {/* Emoji */}
                <span className="text-5xl md:text-6xl" role="img">{cfg.emoji}</span>

                {/* Title */}
                <h2
                    className={`font-pressStart2P text-xl md:text-3xl text-center flicker ${cfg.titleClass}`}
                >
                    {cfg.title}
                </h2>

                {/* Round badge */}
                {(data.type === "roundWin" || data.type === "roundDraw") && data.roundNumber && (
                    <p className="font-pressStart2P text-[10px] text-gray-400">
                        ROUND {data.roundNumber} / {data.totalRounds ?? "?"}
                    </p>
                )}

                {/* Message */}
                <p
                    className={`font-pressStart2P text-[11px] md:text-sm text-center leading-relaxed ${isXWin ? "neon-blue" : isOWin ? "neon-pink" : "neon-yellow"
                        }`}
                >
                    {getMessage(data)}
                </p>

                {/* Dismiss hint */}
                <p className="font-pressStart2P text-[9px] text-gray-500 mt-2 blink">
                    [ CLICK ANYWHERE TO CONTINUE ]
                </p>

                {/* Auto-dismiss progress bar */}
                {autoDismissMs > 0 && (
                    <div className="w-full bg-gray-800 h-1">
                        <div
                            className="h-1 bg-current"
                            style={{
                                animation: `shrink ${autoDismissMs}ms linear forwards`,
                                width: "100%",
                            }}
                        />
                    </div>
                )}
            </div>

            <style>{`
        @keyframes shrink { from { width: 100%; } to { width: 0%; } }
      `}</style>
        </div>
    );
}
