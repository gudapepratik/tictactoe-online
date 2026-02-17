import express, { NextFunction, Request, Response } from "express"
import cors from "cors"
import router from "./routes/router"
import "./config/dotenv"
import { ApiError } from "./utils/apiError";
import cookieParser from 'cookie-parser'

const app = express();

app.use(cors({
  origin: (origin, cb) => {
    if(!origin || origin !== process.env.FRONTEND_URL)
      cb(new Error("CORS error occurred!!"))
    else
      cb(null, true)
  },
  credentials: true
}))

app.use(cookieParser());
app.use(express.static('public'))
app.use(express.json({limit: "16kb"}))
app.use(express.urlencoded({limit:"16kb", "extended": true}))
app.use("/api", router);

// Error Handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  if(err instanceof ApiError) {
    const {statusCode, message, errors} = err;
    res.status(statusCode).json({
      success: false,
      errors,
      message
    })
  } else {
    const {message, stack} = err;
    res.status(500).json({
      success: false,
      message,
      stack
    })
  }
})


export {app};