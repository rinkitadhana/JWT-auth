import { Request, Response } from "express"
import User from "../models/userModel"
import { errorHandler } from "../utils/errorHandler"

const getUser = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?._id
    const user = await User.findById(userId, "_id username email")
    if (!user) {
      res.status(404).json({ message: "User not found" })
      return
    }
    res.status(200).json(user)
  } catch (error) {
    errorHandler(res, error)
  }
}

export { getUser }
