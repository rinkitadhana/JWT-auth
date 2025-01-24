import express from "express"
import "dotenv/config"
import { router } from "./routes/auth"
import connectDB from "./config/database"

require("dotenv").config()
const app = express()
const PORT = process.env.PORT

connectDB()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.get("/", (req, res) => {
  res.send("Hello")
})
app.use("/api", router)

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`)
})
