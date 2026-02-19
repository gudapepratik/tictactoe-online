import { Request, Response } from "express"
import { ApiError } from "../utils/apiError";
import * as jwt from "jsonwebtoken"

const isProd = process.env.NODE_ENV === "production";

async function createUser(req: Request, res: Response) {
  try {
    const {username} = req.body;

    if(!username) 
      throw new ApiError(400, "Username not provided");
    const secret_key = process.env.SECRET_KEY;

    // sign a jwt
    const token = jwt.sign({ username }, secret_key!, {
      expiresIn: "3h"
    })

    // create cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 2 * 60 * 60 * 1000, // 2 hours
      sameSite: isProd ? "none" : "lax",
      secure: isProd
    })

    res.status(201).json({
      success: true,
      message: "User created successfully !!",
      data: null
    })
  } catch (error) {
    console.log(error);
    if(error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: error.success,
        message: error.message,
        errors: error.errors
      })
    } else {
      res.status(500).json({
        success: false,
        message: "createUser: An unexpected error has occurred",
      })
    }
  }
}

async function deleteUser(req: Request, res: Response) {
  try {
    // create cookie
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: isProd ? "none" : "lax",
      secure: isProd
    })

    res.status(200).json({
      success: true,
      message: "User deleted successfully !!",
      data: null
    })
  } catch (error) {
    if(error instanceof ApiError) {
      res.status(error.statusCode).json({
        success: error.success,
        message: error.message,
        errors: error.errors
      })
    } else {
      res.status(500).json({
        success: false,
        message: "deleteUser: An unexpected error has occurred",
      })
    }
  }
}

export {
  createUser,
  deleteUser
}

