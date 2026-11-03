const Budget = require('../models/Budget')
const Transaction = require('../models/Transaction')

const createBudget = async (req, res) => {
  try {
    const { category, amount, month, year } = req.body

    // Validate required fields
    if (!category || amount === undefined || !month || !year) {
      return res.status(400).json({
        success: false,
        message: 'Please provide category, amount, month and year'
      })
    }

    // Validate amount
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Budget amount must be greater than zero'
      })
    }

    // Validate month and year
    if (
      !Number.isInteger(Number(month)) ||
      Number(month) < 1 ||
      Number(month) > 12 ||
      !Number.isInteger(Number(year)) ||
      Number(year) < 2000 ||
      Number(year) > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid month and year'
      })
    }

    const budget = await Budget.create({
      user: req.user.userId,
      category: category.trim(),
      amount: Number(amount),
      month: Number(month),
      year: Number(year)
    })

    return res.status(201).json({
      success: true,
      message: 'Budget created successfully',
      budget
    })
  } catch (error) {
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'A budget already exists for this category and month'
      })
    }

    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getBudgets = async (req, res) => {
  try {
    const { month, year } = req.query

    if (
      !month ||
      !year ||
      !Number.isInteger(Number(month)) ||
      !Number.isInteger(Number(year)) ||
      Number(month) < 1 ||
      Number(month) > 12 ||
      Number(year) < 2000 ||
      Number(year) > 2100
    ) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid month and year'
      })
    }

    const budgets = await Budget.find({
      user: req.user.userId,
      month: Number(month),
      year: Number(year)
    }).sort({ category: 1 })

    const startDate = new Date(Date.UTC(Number(year), Number(month) - 1, 1))
    const endDate = new Date(Date.UTC(Number(year), Number(month), 1))

    const budgetsWithSpending = await Promise.all(
      budgets.map(async (budget) => {
        const expenses = await Transaction.find({
          user: req.user.userId,
          category: budget.category,
          type: 'expense',
          date: {
            $gte: startDate,
            $lt: endDate
          }
        })

        const spent = expenses.reduce(
          (total, transaction) => total + transaction.amount,
          0
        )

        const remaining = budget.amount - spent
        const percentage = (spent / budget.amount) * 100

        return {
          ...budget.toObject(),
          spent,
          remaining,
          percentage: Number(percentage.toFixed(2))
        }
      })
    )

    res.status(200).json({
      success: true,
      count: budgetsWithSpending.length,
      budgets: budgetsWithSpending
    })
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch budgets',
      error: error.message
    })
  }
}

const updateBudget = async (req, res) => {
  try {
    const { amount } = req.body

    if (
      amount === undefined ||
      !Number.isFinite(Number(amount)) ||
      Number(amount) <= 0
    ) {
      return res.status(400).json({
        success: false,
        message: 'Budget amount must be greater than zero'
      })
    }

    const budget = await Budget.findOne({
      _id: req.params.id,
      user: req.user.userId
    })

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      })
    }

    budget.amount = Number(amount)

    await budget.save()

    return res.status(200).json({
      success: true,
      message: 'Budget updated successfully',
      budget
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deleteBudget = async (req, res) => {
  try {
    const budget = await Budget.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId
    })

    if (!budget) {
      return res.status(404).json({
        success: false,
        message: 'Budget not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Budget deleted successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  createBudget,
  getBudgets,
  updateBudget,
  deleteBudget
}