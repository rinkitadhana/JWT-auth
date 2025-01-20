import mongoose from "mongoose"
import dotenv from "dotenv"

dotenv.config()

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI)
    console.log("MongoDB is Connected!")
  } catch (error) {
    console.log("MongoDB Connnection Error: ", error)
    process.exit(1)
  }
}

export default connectDB
