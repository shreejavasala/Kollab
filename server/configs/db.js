import mongoose from 'mongoose'

const connectDB = async () => {
  try {
    mongoose.connection.on('connected', () => console.log(`MongoDB connected successfully`))
    await mongoose.connect(`${process.env.MONGO_URI}/kollab`)
  } catch (error) {
    console.log(`Error connecting to Database: ${error.message}`)
  }
}

export default connectDB