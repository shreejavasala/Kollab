import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import connectDB from './configs/db.js'
import { inngest, functions } from "./Inngest/index.js"
import { serve } from 'inngest/express'
import { clerkMiddleware } from '@clerk/express'
import userRouter from './routes/user.route.js'

const PORT = process.env.PORT || 3500
const app = express()

app.use(express.json())
app.use(cors())
app.use(clerkMiddleware())

app.use("/api/inngest", serve({ client: inngest, functions: functions || [] }));

app.get('/', (req, res) => {
  res.json({ success: true, message: 'server is running' })
})

app.use('/api/user', userRouter)

const startServer = async () => {
  try {
    await connectDB()
    app.listen(PORT, () => console.log(`Server is running on PORT: ${PORT}`))
  } catch (error) {
    console.log(`Failed to start server: ${error.message}`)
  }
}

startServer()