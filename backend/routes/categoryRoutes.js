const express = require('express')
const pool = require('../config/db')

const router = express.Router()

// GET all categories
router.get('/', async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT *
       FROM categories
       ORDER BY category_type, category_name`
    )

    res.json(result.rows)
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch categories' })
  }
})

// GET one category
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `SELECT *
       FROM categories
       WHERE category_id = $1`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to fetch category' })
  }
})

// POST a category
router.post('/', async (req, res) => {
  try {
    const { category_name, category_type } = req.body

    const result = await pool.query(
      `INSERT INTO categories
       (category_name, category_type)
       VALUES ($1, $2)
       RETURNING *`,
      [category_name, category_type]
    )

    res.status(201).json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to create category' })
  }
})

// PUT a category
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params
    const { category_name, category_type } = req.body

    const result = await pool.query(
      `UPDATE categories
       SET category_name = $1,
           category_type = $2
       WHERE category_id = $3
       RETURNING *`,
      [category_name, category_type, id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json(result.rows[0])
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to update category' })
  }
})

// DELETE a category
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const result = await pool.query(
      `DELETE FROM categories
       WHERE category_id = $1
       RETURNING *`,
      [id]
    )

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Category not found' })
    }

    res.json({
      message: 'Category deleted successfully',
      category: result.rows[0]
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({ message: 'Failed to delete category' })
  }
})

module.exports = router