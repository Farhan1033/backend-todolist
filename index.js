import express from 'express'
import bodyParser from 'body-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import connectDB from './config/db.js'
import taskRoute from './routers/taskRoute.js'
import { errorHandler } from './middleware/errorMiddleware.js'

dotenv.config()

connectDB()

const app = express()
const PORT = process.env.PORT || 3000

app.use(bodyParser.json())
app.use(cors())

app.use('/tasks', taskRoute)

app.use(errorHandler)

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
})
