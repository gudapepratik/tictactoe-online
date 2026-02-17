import { createContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type SocketContextType = {
  socket: Socket | null;
  isSocketConnected: boolean;
};

export const SocketContext = createContext<SocketContextType | null>(null);

type props = {
  children: React.ReactNode
}

export const SocketProvider = ({children}: props) => {
  const socketRef = useRef<Socket>(null);
  const [isSocketConnected, setIsSocketConnected] = useState<boolean>(false);

  useEffect(() => {
    if(socketRef.current) {
      setIsSocketConnected(true);
      return;
    }

    const socket: Socket = io("http://localhost:8000", {
      reconnectionAttempts: 10,
      withCredentials: true,
    })

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket client connected");
      setIsSocketConnected(true);
    })

    socket.on("disconnect", () => {
      console.log("Socket client Disconnected")
      setIsSocketConnected(false);
    })

    return () => {
      socket.close();
      setIsSocketConnected(false);
      socketRef.current = null;
    }
  }, [])

  return (
    <SocketContext.Provider value={{socket: socketRef.current, isSocketConnected}}>
      {children}
    </SocketContext.Provider>
  )
}