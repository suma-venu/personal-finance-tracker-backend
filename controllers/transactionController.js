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
    const transactions = await Transaction.find({
      user: req.user.userId
    }).sort({ date: -1 })

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