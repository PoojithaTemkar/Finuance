import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceStore'
import './AddTransaction.css'

function AddTransaction() {
  const navigate = useNavigate()
  const { addTransaction, categories, error } = useFinance()
  const [formData, setFormData] = useState({ name: '', amount: '', type: 'Expense', category: '', date: '', payment: 'UPI', notes: '' })
  const [isSaving, setIsSaving] = useState(false)

  const availableCategories = categories.filter((category) => category.category_type === formData.type)
  const selectedCategory = availableCategories.some((category) => category.category_name === formData.category)
    ? formData.category
    : availableCategories[0]?.category_name || ''

  const handleChange = (event) => {
    const { name, value } = event.target
    setFormData((current) => ({ ...current, [name]: value }))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    try {
      await addTransaction({ ...formData, category: selectedCategory })
      navigate('/transactions')
    } catch {
      // FinanceContext exposes the request error on this page.
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="add-transaction-page">
      <div className="page-header"><div><p className="eyebrow">FINANCIAL ACTIVITY</p><h1>Add Transaction</h1><p className="page-subtitle">Record a new income or expense.</p></div></div>
      <form className="transaction-form" onSubmit={handleSubmit}>
        <div className="type-selector">
          <label className={formData.type === 'Expense' ? 'type-option selected' : 'type-option'}><input type="radio" name="type" value="Expense" checked={formData.type === 'Expense'} onChange={handleChange} /><span>Expense</span></label>
          <label className={formData.type === 'Income' ? 'type-option selected income' : 'type-option'}><input type="radio" name="type" value="Income" checked={formData.type === 'Income'} onChange={handleChange} /><span>Income</span></label>
        </div>
        <div className="form-grid">
          <div className="form-group"><label>Description</label><input name="name" value={formData.name} onChange={handleChange} placeholder="e.g. Grocery shopping" required /></div>
          <div className="form-group"><label>Amount</label><div className="amount-input"><span>₹</span><input name="amount" type="number" min="0.01" step="0.01" value={formData.amount} onChange={handleChange} placeholder="0.00" required /></div></div>
          <div className="form-group"><label>Category</label><select name="category" value={selectedCategory} onChange={handleChange} required><option value="" disabled>Select a category</option>{availableCategories.map((category) => <option key={category.category_id} value={category.category_name}>{category.category_name}</option>)}</select></div>
          <div className="form-group"><label>Date</label><input name="date" type="date" value={formData.date} onChange={handleChange} required /></div>
          <div className="form-group"><label>Payment Method</label><select name="payment" value={formData.payment} onChange={handleChange}><option>UPI</option><option>Credit Card</option><option>Debit Card</option><option>Cash</option><option>Bank Transfer</option></select></div>
          <div className="form-group"><label>Notes</label><input name="notes" value={formData.notes} onChange={handleChange} placeholder="Optional note" /></div>
        </div>
        {error && <p className="form-error" role="alert">{error}</p>}
        <div className="form-actions"><button type="button" className="cancel-btn" onClick={() => navigate('/transactions')}>Cancel</button><button type="submit" className="save-btn" disabled={isSaving || categories.length === 0}>{isSaving ? 'Saving...' : 'Save Transaction'}</button></div>
      </form>
    </div>
  )
}

export default AddTransaction