import { Board, BoardIndex, Cell } from "../types/game";

export function isWinnerOrDraw(board: Board, idx: BoardIndex, symbol: "X" | "O") : boolean | "draw" {
  const [row, col] = idx;

  let cellFilledCount = 0;

  // check row
  let win = true;
  for(let i=0; i < 3; i++) {
    if(board[row][i] !== "E") cellFilledCount++;
    if(board[row][i] !== symbol) {
      win = false;
      break;
    }
  }

  if(win) return true;

  // check col
  win = true;
  for(let i = 0; i < 3; i++) {
    if(board[row][i] !== "E") cellFilledCount++;
    if(board[i][col] !== symbol) {
      win = false;
      break;
    }
  }

  if(win) return true;

  // check diag
  win = true;
  if(row == col) {
    for(let i = 0; i < 3; i++) {
      if(board[i][i] !== symbol) {
        win = false;
        break;
      }
    }
    if(win) return true;
  }

  // check anti-diag
  win = true;
  if(row + col == 2) { // i.e top-right or bottom-left
    for(let i = 0; i < 3; i++) {
      if(board[2 - i][i] !== symbol) {
        win = false;
        break;
      }
    }
    if(win) return true;
  }

  if(cellFilledCount === 9) {
    return "draw";
  }

  return false;
}

export function createEmptyBoard(): Board {
  return Array.from({length: 3}, () =>
    Array.from({length: 3}, () => "E" as Cell)
  )
}

export function resetBoard(board: Board) : void {
  board.forEach((row) => {
    row.forEach((_, i, arr) => {
      arr[i] = "E"
    })
  })
}
