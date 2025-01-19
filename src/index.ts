import express from "express"
import "dotenv/config"
import { router } from "./routes/auth"
require("dotenv").config()

const app = express()
const PORT = process.env.PORT

app.get("/", (req, res) => {
  res.send("Hello")
})
app.use("/api", router)

app.listen(PORT, () => {
  console.log(`Listening on port http://localhost:${PORT}`)
})
