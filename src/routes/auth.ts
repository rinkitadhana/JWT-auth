import {
  loginUser,
  logoutUser,
  registerUser,
} from "../controllers/authController"
import express from "express"
const router = express.Router()

router.post("/register", registerUser)
router.post("/login", loginUser)
router.get("/login", (req, res) => {
  res.send("Hello")
})
router.post("/logout", logoutUser)

export default router
