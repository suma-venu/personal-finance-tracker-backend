const Transaction = require('../models/Transaction')

const addTransaction = async (req, res) => {
  try {
    const { title, amount, type, category, date, description } = req.body

    // Validate required fields
    if (!title || !amount || !type || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      })
    }

    // Validate amount
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) {
      return res.status(400).json({
        success: false,
        message: 'Amount must be greater than zero'
      })
    }

    // Validate transaction type
    if (!['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Type must be income or expense'
      })
    }

    // Create transaction
    const transaction = await Transaction.create({
      user: req.user.userId,
      title,
      amount: Number(amount),
      type,
      category,
      date,
      description
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

    // Validate transaction type
    if (type && !['income', 'expense'].includes(type)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid transaction type'
      })
    }

    // Validate sorting option
    if (sort && !['newest', 'oldest'].includes(sort)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid sorting option'
      })
    }

    // Validate text filters
    if (
      (search !== undefined && typeof search !== 'string') ||
      (category !== undefined && typeof category !== 'string')
    ) {
      return res.status(400).json({
        success: false,
        message: 'Search and category must be text'
      })
    }

    // Validate date format
    const isValidDate = (date) => {
      if (!date) return true

      if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return false

      const parsedDate = new Date(`${date}T00:00:00.000Z`)

      return !isNaN(parsedDate.getTime()) &&
        parsedDate.toISOString().startsWith(date)
    }

    if (!isValidDate(startDate) || !isValidDate(endDate)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid date format. Use YYYY-MM-DD'
      })
    }

    // Check date range
    if (startDate && endDate && startDate > endDate) {
      return res.status(400).json({
        success: false,
        message: 'Start date cannot be after end date'
      })
    }

    // Build database filter
    const filter = {
      user: req.user.userId
    }

    if (type) filter.type = type

    if (category?.trim()) {
      filter.category = category.trim()
    }

    // Escape special regex characters in search
    if (search?.trim()) {
      const safeSearch = search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

      filter.title = {
        $regex: safeSearch,
        $options: 'i'
      }
    }

    // Date filtering
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
    const { title, amount, type, category, date, description } = req.body

    const transaction = await Transaction.findOne({
      _id: req.params.id,
      user: req.user.userId
    })

    if (!transaction) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      })
    }

    if (title !== undefined) transaction.title = title
    if (amount !== undefined) transaction.amount = amount
    if (type !== undefined) transaction.type = type
    if (category !== undefined) transaction.category = category
    if (date !== undefined) transaction.date = date
    if (description !== undefined) transaction.description = description

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
    const transaction = await Transaction.findOneAndDelete({
      _id: req.params.id,
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