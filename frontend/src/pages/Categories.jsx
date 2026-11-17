import { useState } from 'react'
import { createCategory as createCategoryRequest, deleteCategory as deleteCategoryRequest } from '../api'
import { useFinance } from '../context/FinanceStore'
import './Categories.css'

function Categories() {
  const { categories, transactions, loadCategories } = useFinance()
  const [showForm, setShowForm] = useState(false)
  const [categoryName, setCategoryName] = useState('')
  const [categoryType, setCategoryType] = useState('Expense')
  const [error, setError] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const handleCreate = async (event) => {
    event.preventDefault()
    setIsSaving(true)
    setError('')
    try {
      await createCategoryRequest({ category_name: categoryName.trim(), category_type: categoryType })
      await loadCategories()
      setCategoryName('')
      setShowForm(false)
    } catch (requestError) {
      setError(requestError.message || 'Unable to create category.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (category) => {
    setError('')
    try {
      await deleteCategoryRequest(category.category_id)
      await loadCategories()
    } catch (requestError) {
      setError(requestError.message || 'Unable to delete category.')
    }
  }

  return (
    <div className="categories-page">
      <div className="page-header"><div><span className="eyebrow">TRANSACTION ORGANISATION</span><h1>Categories</h1><p>Organise your income and expenses.</p></div><button className="primary-button" onClick={() => setShowForm((current) => !current)}>{showForm ? 'Cancel' : '+ New Category'}</button></div>
      {showForm && <form className="category-create-form" onSubmit={handleCreate}><label>Category name<input value={categoryName} onChange={(event) => setCategoryName(event.target.value)} maxLength="80" required /></label><label>Type<select value={categoryType} onChange={(event) => setCategoryType(event.target.value)}><option value="Expense">Expense</option><option value="Income">Income</option></select></label><button className="primary-button" type="submit" disabled={isSaving}>{isSaving ? 'Saving...' : 'Save category'}</button></form>}
      {error && <p className="category-error" role="alert">{error}</p>}
      <div className="category-stats">
        <div className="category-stat"><span>Total Categories</span><strong>{categories.length}</strong></div>
        <div className="category-stat"><span>Expense Categories</span><strong>{categories.filter((item) => item.category_type === 'Expense').length}</strong></div>
        <div className="category-stat"><span>Income Categories</span><strong>{categories.filter((item) => item.category_type === 'Income').length}</strong></div>
      </div>
      <div className="category-section"><div className="category-section-header"><div><h2>All Categories</h2><p>Categories used across your transactions.</p></div></div><div className="category-list">
        {categories.map((category) => {
          const transactionCount = transactions.filter((transaction) => transaction.categoryId === category.category_id).length
          return <div className="category-row" key={category.category_id}><div className="category-icon">{category.category_type === 'Income' ? '↗' : '−'}</div><div className="category-name"><strong>{category.category_name}</strong><span>{category.category_type}</span></div><div className="category-count"><strong>{transactionCount}</strong><span>transactions</span></div><button className="category-delete" onClick={() => handleDelete(category)} disabled={transactionCount > 0} title={transactionCount > 0 ? 'Category is used by transactions' : 'Delete category'}>Delete</button></div>
        })}
        {categories.length === 0 && <div className="category-empty">No categories are available.</div>}
      </div></div>
      <div className="category-note"><strong>Tip</strong><span>Keep categories specific enough to make your spending analysis useful, but avoid creating too many categories.</span></div>
    </div>
  )
}

export default Categories
