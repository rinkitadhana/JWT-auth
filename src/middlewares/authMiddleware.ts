import { Request, Response, NextFunction } from "express"
import jwt from "jsonwebtoken"
import User from "../models/user"

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
) => {
  try {
    const token = req.cookies.jwt

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" })
    }

    const JWT_SECRET = process.env.JWT_SECRET
    if (!JWT_SECRET) {
      return res.status(500).json({ message: "JWT secret is not defined" })
    }

    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string }

    const user = await User.findById(decoded.userId).select("-password")

    if (!user) {
      return res.status(401).json({ message: "Not authorized, user not found" })
    }

    req.user = user

    next()
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ message: "Token expired" })
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" })
    }

    console.error("Authentication error:", error)
    return res
      .status(500)
      .json({ message: "Server error during authentication" })
  }
}

export default authenticateUser
