export type Cell = "X" | "O" | "E";
export type Board = Cell[][];
export type PlayerAvatar = "cyborg" | "dwarf" | "prime";
export type PlayerType = "X" | "O";
export type BoardIndex = [number, number];

export interface EventResponse {
  (ok: boolean, message: string, data: any) : void
}


export interface Player {
  username: string
  socketId: string
  avatar: PlayerAvatar
  type: PlayerType
}

export interface Game {
  board: Board;
  turn: PlayerType;
  playerX: Player | null;
  playerO: Player | null;
  winner?: "X" | "O" | "draw";
  createdAt: Date
}

export interface PlayerInput {
  username: string;
  type: PlayerType;
  idx: BoardIndex;
}

export interface GameState {
  idx: BoardIndex;
  player: string; // username
  symbol: "X" | "O";
  winner: string | null;
}