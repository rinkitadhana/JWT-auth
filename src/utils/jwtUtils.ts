import { Response } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET
const JWT_EXPIRY = process.env.JWT_EXPIRY

const generateJWT = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })
  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: parseInt(JWT_EXPIRY as string) * 1000,
  })
}

export { generateJWT }
