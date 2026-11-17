const express = require('express')
const pool = require('../config/db')

const router = express.Router()

// GET all transactions
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT
        t.transaction_id,
        t.user_id,
        t.category_id,
        c.category_name,
        t.amount,
        t.transaction_type,
        t.transaction_date::text AS transaction_date,
        t.payment_method,
        t.description,
        t.created_at
      FROM transactions t
      JOIN categories c
        ON t.category_id = c.category_id
      ORDER BY t.transaction_date DESC
    `)

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch transactions' })
  }
})

// GET one transaction
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT
        t.transaction_id,
        t.user_id,
        t.category_id,
        c.category_name,
        t.amount,
        t.transaction_type,
        t.transaction_date::text AS transaction_date,
        t.payment_method,
        t.description,
        t.created_at
       FROM transactions t
       JOIN categories c
         ON t.category_id = c.category_id
       WHERE t.transaction_id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch transaction' })
  }
})

// POST a new transaction
router.post('/', async (req, res) => {
  try {
    const {
      user_id,
      category_id,
      amount,
      transaction_type,
      transaction_date,
      payment_method,
      description
    } = req.body

    const result = await pool.query(
      `INSERT INTO transactions
       (user_id, category_id, amount, transaction_type,
        transaction_date, payment_method, description)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING
         transaction_id,
         user_id,
         category_id,
         amount,
         transaction_type,
         transaction_date::text AS transaction_date,
         payment_method,
         description,
         created_at`,
      [
        user_id,
        category_id,
        amount,
        transaction_type,
        transaction_date,
        payment_method,
        description
      ]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to create transaction' })
  }
})

// PUT/update a transaction
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const {
      category_id,
      amount,
      transaction_type,
      transaction_date,
      payment_method,
      description
    } = req.body

    const result = await pool.query(
      `UPDATE transactions
       SET
         category_id = $1,
         amount = $2,
         transaction_type = $3,
         transaction_date = $4,
         payment_method = $5,
         description = $6
       WHERE transaction_id = $7
       RETURNING
         transaction_id,
         user_id,
         category_id,
         amount,
         transaction_type,
         transaction_date::text AS transaction_date,
         payment_method,
         description,
         created_at`,
      [
        category_id,
        amount,
        transaction_type,
        transaction_date,
        payment_method,
        description,
        id
      ]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update transaction' })
  }
})

// DELETE a transaction
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `DELETE FROM transactions
       WHERE transaction_id = $1
       RETURNING *`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Transaction not found' })
    }

    res.json({
      message: 'Transaction deleted successfully',
      transaction: result.rows[0]
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete transaction' })
  }
})

module.exports = router