import { Request, Response } from "express"
import User, { IUser } from "../models/user"
import bcrypt from "bcryptjs"
import dotenv from "dotenv"
import { errorHandler } from "utils/errorHandler"
import { generateJWT } from "utils/jwtUtils"
dotenv.config()

const registerUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password } = req.body

    const existUser = await User.findOne({ email })
    if (existUser) {
      return res.status(400).json({ message: "User already exists!" })
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

const loginUser = async (req: Request, res: Response) => {
  try {
    const { identifier, password } = req.body

    const user: IUser | null = identifier.includes("@")
      ? await User.findOne({ email: identifier })
      : await User.findOne({ username: identifier })

    if (!user) {
      return res.status(400).json({ message: "User not found!" })
    }

    const isMatch = await bcrypt.compare(password, user.password)
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid password!" })
    }
    generateJWT(res, user._id as string)
    res.status(200).json({ message: "Login successful!" })
  } catch (error) {
    errorHandler(res, error)
  }
}

export { registerUser, loginUser }
