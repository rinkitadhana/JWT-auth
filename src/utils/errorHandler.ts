import { Response } from "express"

export const errorHandler = (res: Response, error: any) => {
  console.log(error)
  res.status(500).json({ message: "Server Error!" })
}
