import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceStore'
import './AddTransaction.css'

function EditTransaction() {
  const navigate = useNavigate()
  const location = useLocation()
  const { updateTransaction, categories, error } = useFinance()
  const transaction = location.state?.transaction
  const [formData, setFormData] = useState({
    name: transaction?.name || '', amount: transaction?.amount || '', type: transaction?.type || 'Expense',
    category: transaction?.category || 'Food & Dining', date: transaction?.date || '', payment: transaction?.payment || 'UPI', notes: transaction?.notes || '',
  })
  const [isSaving, setIsSaving] = useState(false)
  const availableCategories = categories.filter((category) => category.category_type === formData.type)
  const selectedCategory = availableCategories.some((category) => category.category_name === formData.category)
    ? formData.category
    : availableCategories[0]?.category_name || ''

  const handleChange = (event) => setFormData({ ...formData, [event.target.name]: event.target.value })

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      await updateTransaction(transaction.id, { ...formData, category: selectedCategory })
      navigate('/transactions')
    } catch {
      // FinanceContext exposes the request error on this page.
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="add-transaction-page">
      <div className="page-header"><div><span className="eyebrow">TRANSACTION MANAGEMENT</span><h1>Edit Transaction</h1><p>Update the details of this transaction.</p></div></div>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <div className="form-section"><div className="form-section-title"><h2>Transaction Type</h2><p>Choose whether this is income or an expense.</p></div><div className="type-selector">
          <label className={formData.type === 'Expense' ? 'type-option selected' : 'type-option'}><input type="radio" name="type" value="Expense" checked={formData.type === 'Expense'} onChange={handleChange} /><span>Expense</span></label>
          <label className={formData.type === 'Income' ? 'type-option selected income' : 'type-option'}><input type="radio" name="type" value="Income" checked={formData.type === 'Income'} onChange={handleChange} /><span>Income</span></label>
        </div></div>
        <div className="form-section"><div className="form-section-title"><h2>Transaction Details</h2><p>Update the information below.</p></div><div className="form-grid">
          <div className="form-group"><label>Description</label><input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Grocery shopping" required /></div>
          <div className="form-group"><label>Amount</label><div className="amount-input"><span>₹</span><input type="number" name="amount" value={formData.amount} onChange={handleChange} placeholder="0.00" min="0.01" step="0.01" required /></div></div>
          <div className="form-group"><label>Category</label><select name="category" value={selectedCategory} onChange={handleChange} required><option value="" disabled>Select a category</option>{availableCategories.map((category) => <option key={category.category_id} value={category.category_name}>{category.category_name}</option>)}</select></div>
          <div className="form-group"><label>Date</label><input type="date" name="date" value={formData.date} onChange={handleChange} required /></div>
          <div className="form-group"><label>Payment Method</label><select name="payment" value={formData.payment} onChange={handleChange}><option>UPI</option><option>Credit Card</option><option>Debit Card</option><option>Cash</option><option>Bank Transfer</option></select></div>
          <div className="form-group"><label>Notes</label><input name="notes" value={formData.notes} onChange={handleChange} placeholder="Optional note" /></div>
        </div></div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions"><button type="button" className="secondary-button" onClick={() => navigate('/transactions')}>Cancel</button><button type="submit" className="primary-button" disabled={isSaving || categories.length === 0}>{isSaving ? 'Saving...' : 'Save Changes'}</button></div>
      </form>
    </div>
  )
}

export default EditTransaction