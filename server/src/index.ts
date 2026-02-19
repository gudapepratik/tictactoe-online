import { Server } from "socket.io";
import {app} from './app'
import { createServer } from "node:http";
import initSocketio from "./socket/socketio";

const port: string = process.env.PORT || '8000';

// create server
const server = createServer(app);

// const io = new Server(httpServer, {
//   cors: {
//     credentials: true,
//     origin: "http://localhost:5173",
//     methods: ['GET', 'POST', 'PUT', 'PATCH']
//   }
// })
console.log(process.env.FRONTEND_URL)
const io = new Server(server, {
  cors: {
    origin: process.env.FRONTEND_URL,
    credentials: true,
  },
})

server.listen(port, () => {
  console.log(`Server running on PORT ${port}`)

  // initialize socketio
  initSocketio(io);
})

