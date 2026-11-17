import { useEffect, useMemo, useState } from 'react'
import { FinanceContext } from './FinanceStore'
import {
  createTransaction as createTransactionRequest,
  deleteTransaction as deleteTransactionRequest,
  getCategories,
  getTransactions,
  updateTransaction as updateTransactionRequest,
} from '../api'

function formatTransaction(transaction, categoryName) {
  const description = transaction.description || ''

  return {
    id: transaction.transaction_id,
    name: description,
    categoryId: transaction.category_id,
    category: transaction.category_name || categoryName || '',
    type: transaction.transaction_type,
    amount: Number(transaction.amount),
    date: String(transaction.transaction_date).slice(0, 10),
    payment: transaction.payment_method || '',
    notes: description,
  }
}

function FinanceProvider({ children }) {
  const [transactions, setTransactions] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const loadTransactions = async () => {
    try {
      setLoading(true)
      setError('')
      const data = await getTransactions()
      setTransactions(data.map((transaction) => formatTransaction(transaction)))
    } catch (requestError) {
      console.error(requestError)
      setError('Unable to load transactions. Check that the backend is running.')
    } finally {
      setLoading(false)
    }
  }

  const loadCategories = async () => {
    try {
      const data = await getCategories()
      setCategories(data)
    } catch (requestError) {
      console.error(requestError)
      setError('Unable to load categories.')
    }
  }

  useEffect(() => {
    let active = true
    Promise.all([getTransactions(), getCategories()])
      .then(([transactionData, categoryData]) => {
        if (!active) return
        setTransactions(transactionData.map((transaction) => formatTransaction(transaction)))
        setCategories(categoryData)
        setError('')
      })
      .catch((requestError) => {
        if (!active) return
        console.error(requestError)
        setError('Unable to load finance data. Check that the backend is running.')
      })
      .finally(() => {
        if (active) setLoading(false)
      })

    return () => { active = false }
  }, [])

  const getCategoryId = (transaction) => {
    const category = categories.find((item) =>
      item.category_id === transaction.categoryId ||
      item.category_name === transaction.category
    )

    if (!category) {
      throw new Error('Choose a valid category')
    }

    return category.category_id
  }

  const toApiTransaction = (transaction) => ({
    category_id: getCategoryId(transaction),
    amount: Number(transaction.amount),
    transaction_type: transaction.type,
    transaction_date: transaction.date,
    payment_method: transaction.payment,
    description: transaction.name || transaction.notes || '',
  })

  const addTransaction = async (transaction) => {
    try {
      setError('')
      const categoryId = getCategoryId(transaction)
      const savedTransaction = await createTransactionRequest({
        user_id: 1,
        ...toApiTransaction(transaction),
      })
      const category = categories.find((item) => item.category_id === categoryId)
      setTransactions((current) => [
        formatTransaction(savedTransaction, category?.category_name),
        ...current,
      ])
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.message || 'Unable to add transaction.')
      throw requestError
    }
  }

  const updateTransaction = async (id, transaction) => {
    try {
      setError('')
      const updatedTransaction = await updateTransactionRequest(id, toApiTransaction(transaction))
      const category = categories.find((item) => item.category_id === updatedTransaction.category_id)
      setTransactions((current) => current.map((item) =>
        item.id === id ? formatTransaction(updatedTransaction, category?.category_name) : item
      ))
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.message || 'Unable to update transaction.')
      throw requestError
    }
  }

  const deleteTransaction = async (id) => {
    try {
      setError('')
      await deleteTransactionRequest(id)
      setTransactions((current) => current.filter((transaction) => transaction.id !== id))
    } catch (requestError) {
      console.error(requestError)
      setError(requestError.message || 'Unable to delete transaction.')
      throw requestError
    }
  }

  const summary = useMemo(() => {
    const income = transactions.filter((item) => item.type === 'Income').reduce((sum, item) => sum + Number(item.amount), 0)
    const expenses = transactions.filter((item) => item.type === 'Expense').reduce((sum, item) => sum + Number(item.amount), 0)
    const savings = income - expenses
    const savingsRate = income > 0 ? Math.round((savings / income) * 100) : 0

    return { income, expenses, savings, savingsRate, balance: savings }
  }, [transactions])

  return (
    <FinanceContext.Provider value={{
      transactions,
      categories,
      loading,
      error,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      loadTransactions,
      loadCategories,
      summary,
    }}>
      {children}
    </FinanceContext.Provider>
  )
}

export default FinanceProvider
