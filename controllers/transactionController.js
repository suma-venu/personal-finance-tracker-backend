const mongoose = require('mongoose')
const Transaction = require('../models/Transaction')

const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, description } = req.body

    if (!title?.trim() || !amount || !type || !category?.trim()) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      })
    }

    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero'
      })
    }

    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be income or expense'
      })
    }

    const transaction = await Transaction.create({
      user: req.user.userId,
      title: title.trim(),
      amount: Number(amount),
      type,
      category: category.trim(),
      date: date || Date.now(),
      description: description || ''
    })

    return res.status(201).json({
      success: true,
      message: 'Transaction added successfully',
      transaction
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const getTransactions = async (req, res) => {
  try {
    const { search, type, category, startDate, endDate, sort } = req.query

    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction type'
      })
    }

    if (sort && !['newest', 'oldest'].includes(sort)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sorting option'
      })
    }

    const isValidDate = (value) => {
      if (!value) return true
      if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false

      const parsed = new Date(`${value}T00:00:00.000Z`)
      return !isNaN(parsed.getTime()) &&
        parsed.toISOString().startsWith(value)
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      })
    }

    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date'
      })
    }

    const filter = { user: req.user.userId }

    if (type) filter.type = type
    if (category?.trim()) filter.category = category.trim()

    if (search?.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      filter.title = { $regex: safeSearch, $options: 'i' }
    }

    if (startDate || endDate) {
      filter.date = {}

      if (startDate) {
        filter.date.$gte = new Date(`${startDate}T00:00:00.000Z`)
      }

      if (endDate) {
        const nextDay = new Date(`${endDate}T00:00:00.000Z`)
        nextDay.setUTCDate(nextDay.getUTCDate() + 1)
        filter.date.$lt = nextDay
      }
    }

    const sortOrder = sort === 'oldest' ? 1 : -1

    const transactions = await Transaction.find(filter).sort({
      date: sortOrder
    })

    return res.status(200).json({
      success: true,
      count: transactions.length,
      transactions
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const updateTransaction = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID'
      })
    }

    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user.userId
    })

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      })
    }

    const { title, amount, type, category, date, description } = req.body

    if (title !== undefined) {
      if (typeof title !== 'string' || !title.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Title cannot be empty'
        })
      }
      transaction.title = title.trim()
    }

    if (amount !== undefined) {
      if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
        return res.status(400).json({
          success: false,
          message: 'Amount must be greater than zero'
        })
      }
      transaction.amount = Number(amount)
    }

    if (type !== undefined) {
      if (!['income', 'expense'].includes(type)) {
        return res.status(400).json({
          success: false,
          message: 'Type must be income or expense'
        })
      }
      transaction.type = type
    }

    if (category !== undefined) {
      if (typeof category !== 'string' || !category.trim()) {
        return res.status(400).json({
          success: false,
          message: 'Category cannot be empty'
        })
      }
      transaction.category = category.trim()
    }

    if (date !== undefined) {
      const parsedDate = new Date(date)
      if (isNaN(parsedDate.getTime())) {
        return res.status(400).json({
          success: false,
          message: 'Invalid transaction date'
        })
      }
      transaction.date = parsedDate
    }

    if (description !== undefined) {
      if (typeof description !== 'string') {
        return res.status(400).json({
          success: false,
          message: 'Description must be text'
        })
      }
      transaction.description = description.trim()
    }

    await transaction.save()

    return res.status(200).json({
      success: true,
      message: 'Transaction updated successfully',
      transaction
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

const deleteTransaction = async (req, res) => {
  try {
    const { id } = req.params

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction ID'
      })
    }

    const transaction = await Transaction.findOneAndDelete({
      _id: id,
      user: req.user.userId
    })

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      })
    }

    return res.status(200).json({
      success: true,
      message: 'Transaction deleted successfully'
    })
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message
    })
  }
}

module.exports = {
  addTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction
}