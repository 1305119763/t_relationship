import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import authRoutes from './routes/auth'
import customerRoutes from './routes/customers'
import approvalRoutes from './routes/approvals'
import reportRoutes from './routes/reports'

dotenv.config()

const app = express()
const port = process.env.PORT || 3000

app.use(cors())
app.use(express.json())

app.use('/api/auth', authRoutes)
app.use('/api/customers', customerRoutes)
app.use('/api/approvals', approvalRoutes)
app.use('/api/reports', reportRoutes)

app.get('/', (req, res) => {
  res.send('CRM API is running')
})

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})
