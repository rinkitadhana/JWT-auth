import { Response } from "express"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "secret"
const JWT_EXPIRY = process.env.JWT_EXPIRY || "1h"

const generateJWT = (res: Response, userId: string) => {
  const token = jwt.sign({ userId }, JWT_SECRET, { expiresIn: JWT_EXPIRY })

  const expiryInSeconds = parseInt(JWT_EXPIRY as string)
  if (isNaN(expiryInSeconds)) {
    throw new Error("Invalid JWT_EXPIRY value")
  }

  res.cookie("jwt", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: expiryInSeconds * 1000,
    path: "/",
  })
}
const clearJWT = (res: Response) => {
  res.cookie("jwt", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    expires: new Date(0),
    path: "/",
  })
}

export { generateJWT, clearJWT }
