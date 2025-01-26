import express from "express"
import dotenv from "dotenv"
import authRouter from "./routes/auth"
import userRouter from "./routes/user"
import connectDB from "./config/database"
import cookieParser from "cookie-parser"
import authenticateUser from "./middlewares/authMiddleware"

dotenv.config()

const app = express()
const PORT = process.env.PORT

connectDB()

app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Hello China!")
})

app.use("/api", authRouter)
app.use("/api/user", authenticateUser, userRouter)
app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`)
})
