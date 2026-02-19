import type { Socket } from "socket.io-client";

export function emitAsync<T = any>(socket: Socket, event: string, ...args: any[]) : Promise<T> {
  return new Promise((resolve, reject) => {
    socket.emit(event, ...args, (ok: boolean, message: string, data: T) => {
      if(!ok) return reject(new Error(message));
      resolve(data);
    })
  })
}