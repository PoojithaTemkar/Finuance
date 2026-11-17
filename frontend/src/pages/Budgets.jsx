import './Budgets.css'
import { useEffect, useMemo, useState } from 'react'
import { createBudget, deleteBudget, getBudgetPerformance, updateBudget } from '../api'
import { useFinance } from '../context/FinanceStore'

function Budgets() {
  const { categories } = useFinance()
  const [budgets, setBudgets] = useState([])
  const [selectedPeriod, setSelectedPeriod] = useState('')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const today = new Date()
  const [formData, setFormData] = useState({ category_id: '', month: today.getMonth() + 1, year: today.getFullYear(), budget_amount: '' })

  const loadBudgets = async () => {
    try {
      setIsLoading(true)
      setError('')
      const data = await getBudgetPerformance()
      setBudgets(data)
      if (!selectedPeriod && data.length) setSelectedPeriod(`${data[0].year}-${String(data[0].month).padStart(2, '0')}`)
    } catch (requestError) {
      setError(requestError.message || 'Unable to load budgets.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    getBudgetPerformance()
      .then((data) => {
        if (!active) return
        setBudgets(data)
        if (data.length) setSelectedPeriod(`${data[0].year}-${String(data[0].month).padStart(2, '0')}`)
      })
      .catch((requestError) => {
        if (active) setError(requestError.message || 'Unable to load budgets.')
      })
      .finally(() => {
        if (active) setIsLoading(false)
      })

    return () => { active = false }
  }, [])

  const periods = useMemo(() => [...new Set(budgets.map((budget) => `${budget.year}-${String(budget.month).padStart(2, '0')}`))], [budgets])
  const visibleBudgets = budgets.filter((budget) => `${budget.year}-${String(budget.month).padStart(2, '0')}` === selectedPeriod)
  const totalBudget = visibleBudgets.reduce((total, budget) => total + Number(budget.budget_amount), 0)
  const totalSpent = visibleBudgets.reduce((total, budget) => total + Number(budget.actual_spending), 0)
  const totalRemaining = totalBudget - totalSpent
  const periodLabel = selectedPeriod
    ? new Date(Number(selectedPeriod.slice(0, 4)), Number(selectedPeriod.slice(5, 7)) - 1).toLocaleString('en', { month: 'long', year: 'numeric' })
    : 'No budget period selected'

  const startCreate = () => {
    setEditingId(null)
    setFormData({ category_id: '', month: today.getMonth() + 1, year: today.getFullYear(), budget_amount: '' })
    setShowForm((current) => !current)
    setError('')
  }

  const startEdit = (budget) => {
    setEditingId(budget.budget_id)
    setFormData({ category_id: String(budget.category_id), month: budget.month, year: budget.year, budget_amount: budget.budget_amount })
    setShowForm(true)
    setError('')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    const payload = {
      user_id: 1,
      category_id: Number(formData.category_id),
      month: Number(formData.month),
      year: Number(formData.year),
      budget_amount: Number(formData.budget_amount),
    }
    try {
      if (editingId) await updateBudget(editingId, payload)
      else await createBudget(payload)
      setShowForm(false)
      setEditingId(null)
      await loadBudgets()
    } catch (requestError) {
      setError(requestError.message || 'Unable to save budget.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (budgetId) => {
    setError('')
    try {
      await deleteBudget(budgetId)
      await loadBudgets()
    } catch (requestError) {
      setError(requestError.message || 'Unable to delete budget.')
    }
  }

  return (
    <div className="budgets-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">MONEY MANAGEMENT</p>
          <h1>Budgets</h1>
          <p className="page-subtitle">Keep your spending aligned with your goals.</p>
        </div>
        <button className="add-btn" onClick={startCreate}><span>+</span> {showForm ? 'Cancel' : 'Create Budget'}</button>
      </div>
      {showForm && <form className="budget-create-form" onSubmit={handleSubmit}><label>Category<select value={formData.category_id} onChange={(event) => setFormData((current) => ({ ...current, category_id: event.target.value }))} required><option value="">Select category</option>{categories.filter((category) => category.category_type === 'Expense').map((category) => <option key={category.category_id} value={category.category_id}>{category.category_name}</option>)}</select></label><label>Month<select value={formData.month} onChange={(event) => setFormData((current) => ({ ...current, month: event.target.value }))}>{Array.from({ length: 12 }, (_, index) => <option key={index + 1} value={index + 1}>{new Date(2000, index).toLocaleString('en', { month: 'long' })}</option>)}</select></label><label>Year<input type="number" min="2000" max="2200" value={formData.year} onChange={(event) => setFormData((current) => ({ ...current, year: event.target.value }))} required /></label><label>Amount<input type="number" min="0.01" step="0.01" value={formData.budget_amount} onChange={(event) => setFormData((current) => ({ ...current, budget_amount: event.target.value }))} required /></label><button className="primary-button" type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : editingId ? 'Save changes' : 'Create budget'}</button></form>}
      {error && <p className="budget-error" role="alert">{error}</p>}

      <div className="budget-overview">
        <div className="budget-overview-card"><span>Total Budget</span><strong>₹{totalBudget.toLocaleString('en-IN')}</strong><small>{periodLabel}</small></div>
        <div className="budget-overview-card"><span>Total Spent</span><strong>₹{totalSpent.toLocaleString('en-IN')}</strong><small>{totalBudget ? (totalSpent / totalBudget * 100).toFixed(1) : '0.0'}% utilized</small></div>
        <div className="budget-overview-card"><span>Remaining</span><strong className="green-text">₹{totalRemaining.toLocaleString('en-IN')}</strong><small>Available to spend</small></div>
      </div>

      <div className="budget-card">
        <div className="budget-card-header"><div><h2>Monthly Budgets</h2><p>{periodLabel}</p></div>{periods.length > 1 && <select aria-label="Budget period" value={selectedPeriod} onChange={(event) => setSelectedPeriod(event.target.value)}>{periods.map((period) => <option key={period} value={period}>{new Date(Number(period.slice(0, 4)), Number(period.slice(5, 7)) - 1).toLocaleString('en', { month: 'long', year: 'numeric' })}</option>)}</select>}</div>
        <div className="budget-list">
          {visibleBudgets.map((budget) => {
            const percentage = Number(budget.utilization_percentage)
            const progressClass = percentage >= 90 ? 'budget-progress-fill danger' : percentage >= 75 ? 'budget-progress-fill warning' : 'budget-progress-fill'

            return (
              <div className="budget-row" key={budget.budget_id}>
                <div className="budget-row-top">
                  <div><strong>{budget.category_name}</strong><span>₹{Number(budget.actual_spending).toLocaleString('en-IN')} of ₹{Number(budget.budget_amount).toLocaleString('en-IN')}</span></div>
                  <strong>{percentage.toFixed(1)}%</strong>
                </div>
                <div className="budget-progress"><div className={progressClass} style={{ width: `${Math.min(percentage, 100)}%` }} /></div>
                <div className="budget-row-bottom">
                  <span>₹{Number(budget.remaining).toLocaleString('en-IN')} remaining</span>
                  {percentage >= 90 && <span className="warning-text">Near limit</span>}
                  <div><button className="budget-action" onClick={() => startEdit(budget)}>Edit</button><button className="budget-action delete" onClick={() => handleDelete(budget.budget_id)}>Delete</button></div>
                </div>
              </div>
            )
          })}
          {isLoading && <p className="budget-empty">Loading budgets...</p>}
          {!isLoading && visibleBudgets.length === 0 && <p className="budget-empty">No budgets for this month yet.</p>}
        </div>
      </div>
    </div>
  )
}

export default Budgets
