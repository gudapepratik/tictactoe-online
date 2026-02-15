import { Server } from "socket.io";
import {app} from './app'
import { createServer } from "node:http";

const port: string = process.env.PORT || '8000';

// create server
const httpServer = createServer(app);

const io = new Server(httpServer, {
  cors: {
    credentials: true,
    origin: [`${process.env.FRONTEND_URL}`],
    methods: ['GET', 'POST', 'PUT', 'PATCH']
  }
})

httpServer.listen(port, () => {
  console.log(`Server running on PORT ${port}`)

  // initialize socketio
})

