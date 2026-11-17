const express = require('express')
const pool = require('../config/db')

const router = express.Router()

// GET all budgets
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        b.budget_id,
        b.user_id,
        b.category_id,
        c.category_name,
        b.month,
        b.year,
        b.budget_amount,
        b.created_at
      FROM budgets b
      JOIN categories c
        ON b.category_id = c.category_id
      ORDER BY b.year DESC, b.month DESC, c.category_name
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch budgets' })
  }
})

// GET one budget
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT
        b.budget_id,
        b.user_id,
        b.category_id,
        c.category_name,
        b.month,
        b.year,
        b.budget_amount,
        b.created_at
       FROM budgets b
       JOIN categories c
         ON b.category_id = c.category_id
       WHERE b.budget_id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Budget not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch budget' })
  }
})

// POST a budget
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      category_id,
      month,
      year,
      budget_amount
    } = req.body

    const result = await pool.query(
      `INSERT INTO budgets
       (user_id, category_id, month, year, budget_amount)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [
        user_id,
        category_id,
        month,
        year,
        budget_amount
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to create budget' })
  }
})

// PUT a budget
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const {
      category_id,
      month,
      year,
      budget_amount
    } = req.body

    const result = await pool.query(
      `UPDATE budgets
       SET
         category_id = $1,
         month = $2,
         year = $3,
         budget_amount = $4
       WHERE budget_id = $5
       RETURNING *`,
      [
        category_id,
        month,
        year,
        budget_amount,
        id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Budget not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update budget' })
  }
})

// DELETE a budget
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `DELETE FROM budgets
       WHERE budget_id = $1
       RETURNING *`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Budget not found' })
    }

    res.json({
      message: 'Budget deleted successfully',
      budget: result.rows[0]
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete budget' })
  }
})

module.exports = router