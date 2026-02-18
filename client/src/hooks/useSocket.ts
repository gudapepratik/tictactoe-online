import { useContext } from "react"
import { SocketContext } from "../contexts/SocketContext"

export const useSocket = () => {
  const context = useContext(SocketContext);

  if(!context)
    throw new Error("Socket must be used within SocketProvider")
  return context;
}