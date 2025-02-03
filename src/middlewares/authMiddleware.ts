import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/userModel"

declare global {
  namespace Express {
    interface Request {
      user?: any
    }
  }
}

const authenticateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      res.status(401).json({ message: "Not authorized, no token" })
      return
    }

    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
      res.status(500).json({ message: "JWT secret is not defined" })
      return
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const user = await User.findById(decoded.userId, "_id username email")

    if (!user) {
      res.status(401).json({ message: "Not authorized, user not found" })
      return
    }

    req.user = user

    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      res.status(401).json({ message: "Token expired" })
      return
    }
    if (error instanceof jwt.JsonWebTokenError) {
      res.status(401).json({ message: "Invalid token" })
      return
    }

    console.error("Authentication error:", error)
    res.status(500).json({ message: "Server error during authentication" })
    return
  }
}

export default authenticateUser
