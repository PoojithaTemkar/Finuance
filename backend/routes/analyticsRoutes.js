const express = require('express')
const pool = require('../config/db')

const router = express.Router()

// =====================================================
// 1. DASHBOARD SUMMARY
// =====================================================

router.get('/summary', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        COALESCE(
          SUM(CASE WHEN transaction_type = 'Income'
              THEN amount ELSE 0 END), 0
        ) AS total_income,

        COALESCE(
          SUM(CASE WHEN transaction_type = 'Expense'
              THEN amount ELSE 0 END), 0
        ) AS total_expenses

      FROM transactions
    `)

    const data = result.rows[0]

    const income = Number(data.total_income)
    const expenses = Number(data.total_expenses)
    const savings = income - expenses

    const savingsRate =
      income > 0
        ? Number(((savings / income) * 100).toFixed(2))
        : 0

    res.json({
      total_income: income,
      total_expenses: expenses,
      savings,
      savings_rate: savingsRate
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to fetch dashboard summary'
    })
  }
})

// =====================================================
// 2. SPENDING BY CATEGORY
// =====================================================

router.get('/category-spending', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        c.category_name,
        SUM(t.amount) AS total_spending
      FROM transactions t
      JOIN categories c
        ON t.category_id = c.category_id
      WHERE t.transaction_type = 'Expense'
      GROUP BY c.category_name
      ORDER BY total_spending DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to fetch category spending'
    })
  }
})

// =====================================================
// 3. MONTHLY INCOME VS EXPENSES
// =====================================================

router.get('/monthly', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        EXTRACT(YEAR FROM transaction_date) AS year,
        EXTRACT(MONTH FROM transaction_date) AS month,

        SUM(
          CASE
            WHEN transaction_type = 'Income'
            THEN amount
            ELSE 0
          END
        ) AS income,

        SUM(
          CASE
            WHEN transaction_type = 'Expense'
            THEN amount
            ELSE 0
          END
        ) AS expenses

      FROM transactions

      GROUP BY
        EXTRACT(YEAR FROM transaction_date),
        EXTRACT(MONTH FROM transaction_date)

      ORDER BY year, month
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to fetch monthly analytics'
    })
  }
})

// =====================================================
// 4. BUDGET VS ACTUAL SPENDING
// =====================================================

router.get('/budget-performance', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.budget_id,
        c.category_name,
        b.month,
        b.year,
        b.budget_amount,

        COALESCE(
          SUM(
            CASE
              WHEN t.transaction_type = 'Expense'
              THEN t.amount
              ELSE 0
            END
          ), 0
        ) AS actual_spending

      FROM budgets b

      JOIN categories c
        ON b.category_id = c.category_id

      LEFT JOIN transactions t
        ON t.category_id = b.category_id
        AND EXTRACT(MONTH FROM t.transaction_date) = b.month
        AND EXTRACT(YEAR FROM t.transaction_date) = b.year

      GROUP BY
        b.budget_id,
        c.category_name,
        b.month,
        b.year,
        b.budget_amount

      ORDER BY b.year DESC, b.month DESC
    `)

    const data = result.rows.map((item) => {
      const budget = Number(item.budget_amount)
      const actual = Number(item.actual_spending)

      const utilization =
        budget > 0
          ? Number(((actual / budget) * 100).toFixed(2))
          : 0

      return {
        ...item,
        budget_amount: budget,
        actual_spending: actual,
        utilization_percentage: utilization,
        remaining: budget - actual
      }
    })

    res.json(data)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to fetch budget performance'
    })
  }
})

// =====================================================
// 5. RECENT TRANSACTIONS
// =====================================================

router.get('/recent-transactions', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.transaction_id,
        c.category_name,
        t.amount,
        t.transaction_type,
        t.transaction_date::text AS transaction_date,
        t.payment_method,
        t.description

      FROM transactions t

      JOIN categories c
        ON t.category_id = c.category_id

      ORDER BY t.transaction_date DESC, t.created_at DESC

      LIMIT 10
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Failed to fetch recent transactions'
    })
  }
})

module.exports = router