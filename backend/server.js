const express = require('express')
const cors = require('cors')
require('dotenv').config()

const pool = require('./config/db')
const transactionRoutes = require('./routes/transactionRoutes')
const categoryRoutes = require('./routes/categoryRoutes')
const budgetRoutes = require('./routes/budgetRoutes')
const analyticsRoutes = require('./routes/analyticsRoutes')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/api/health', async (req, res) => {
  try {
    await pool.query('SELECT NOW()')

    res.json({
      status: 'ok',
      message: 'Finuance backend is running',
      database: 'PostgreSQL connected',
    })
  } catch (error) {
    console.error(error)

    res.status(500).json({
      status: 'error',
      message: 'Backend is running, but PostgreSQL connection failed',
    })
  }
})

app.use('/api/transactions', transactionRoutes)
app.use('/api/categories', categoryRoutes)
app.use('/api/budgets', budgetRoutes)
app.use('/api/analytics', analyticsRoutes)

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
  console.log(`Finuance backend running on http://localhost:${PORT}`)
})