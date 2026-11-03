const express = require('express')
const router = express.Router()

const protect = require('../middleware/authMiddleware')

const {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget
} = require('../controllers/budgetController')

// Protect all budget routes
router.use(protect)

// Create a budget
router.post('/', createBudget)

// Get monthly budgets
router.get('/', getBudgets)

// Update a budget
router.put('/:id', updateBudget)

// Delete a budget
router.delete('/:id', deleteBudget)

module.exports = router