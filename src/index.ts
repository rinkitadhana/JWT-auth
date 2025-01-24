import express from "express"
import dotenv from "dotenv"
import { router } from "./routes/auth"
import connectDB from "./config/database"
import cookieParser from "cookie-parser"

dotenv.config()

const app = express()
const PORT = process.env.PORT

connectDB()

app.use(express.json())
app.use(cookieParser())

app.get("/", (req, res) => {
  res.send("Hello China!")
})

app.use("/api", router)

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`)
})
