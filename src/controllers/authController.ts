import { Request, Response } from "express"
import User, { IUser } from "../models/user"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import { errorHandler } from "../utils/errorHandler"
import { clearJWT, generateJWT } from "../utils/jwtUtils"
dotenv.config()

const registerUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { username, email, password } = req.body

    if (!username || !email || !password) {
      res.status(400).json({ message: "Missing credentials" })
      return
    }

    const existingEmail = await User.findOne({ email })
    const existingUsername = await User.findOne({ username })
    if (existingEmail || existingUsername) {
      res.status(400).json({
        message: existingEmail
          ? "Email already exists!"
          : "Username already exists!",
      })
      return
    }

    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)

    const newUser = new User({
      username,
      email,
      password: hashedPassword,
    })

    await newUser.save()
    res.status(201).json({ message: "User created successfully!" })
  } catch (error) {
    errorHandler(res, error)
  }
}

const loginUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const { identifier, password } = req.body

    if (!identifier || !password) {
      res.status(400).json({ message: "Missing credentials" })
      return
    }

    const user: IUser | null = identifier.includes("@")
      ? await User.findOne({ email: identifier }).select("+password")
      : await User.findOne({ username: identifier }).select("+password")

    if (!user) {
      res.status(400).json({ message: "User not found!" })
      return
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      res.status(400).json({ message: "Invalid password!" })
      return
    }
    generateJWT(res, user._id as string)
    res.status(200).json({ message: "Login successful!" })
  } catch (error) {
    errorHandler(res, error)
  }
}

const logoutUser = async (req: Request, res: Response): Promise<void> => {
  try {
    clearJWT(res)
    res.status(200).json({ message: "Logout successful!" })
  } catch (error) {
    errorHandler(res, error)
  }
}

export { registerUser, loginUser, logoutUser }
