import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceStore'
import './Transactions.css'

function Transactions() {
  const { transactions, deleteTransaction, summary, loading, error } = useFinance()
  const navigate = useNavigate()
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState('All')

  const filteredTransactions = transactions.filter((transaction) => {
    const searchText = search.toLowerCase()
    const matchesSearch = transaction.name.toLowerCase().includes(searchText) || transaction.category.toLowerCase().includes(searchText)
    const matchesFilter = filter === 'All' || transaction.type === filter
    return matchesSearch && matchesFilter
  })

  return (
    <div className="transactions-page">
      <div className="page-header">
        <div><span className="eyebrow">TRANSACTION MANAGEMENT</span><h1>Transactions</h1><p>View and manage your financial activity.</p></div>
        <Link to="/add-transaction" className="primary-button">+ Add Transaction</Link>
      </div>
      <div className="transaction-summary">
        <div className="summary-card"><span>Total Transactions</span><strong>{transactions.length}</strong><small>This account</small></div>
        <div className="summary-card"><span>Total Income</span><strong className="income">+₹{summary.income.toLocaleString('en-IN')}</strong><small>Recorded income</small></div>
        <div className="summary-card"><span>Total Expenses</span><strong className="expense">-₹{summary.expenses.toLocaleString('en-IN')}</strong><small>Recorded expenses</small></div>
        <div className="summary-card"><span>Net Balance</span><strong className={summary.balance >= 0 ? 'income' : 'expense'}>₹{summary.balance.toLocaleString('en-IN')}</strong><small>Income minus expenses</small></div>
      </div>
      <div className="transactions-toolbar">
        <input type="text" className="transaction-search" placeholder="Search transactions..." value={search} onChange={(event) => setSearch(event.target.value)} />
        <div className="transaction-filters">{['All', 'Income', 'Expense'].map((item) => <button key={item} className={filter === item ? 'active' : ''} onClick={() => setFilter(item)}>{item}</button>)}</div>
      </div>
      {error && <p className="form-error" role="alert">{error}</p>}
      <div className="transactions-table-card">
        <div className="transactions-table-wrapper">
          <table className="transactions-table">
            <thead><tr><th>Transaction</th><th>Category</th><th>Date</th><th>Payment</th><th>Amount</th><th>Actions</th></tr></thead>
            <tbody>{filteredTransactions.map((transaction) => <tr key={transaction.id}>
              <td><div className="transaction-name"><div className="transaction-avatar">{transaction.name.charAt(0)}</div><div><strong>{transaction.name}</strong><span>{transaction.type}</span></div></div></td>
              <td>{transaction.category}</td><td>{transaction.date}</td><td>{transaction.payment}</td>
              <td><span className={`amount ${transaction.type === 'Income' ? 'income' : 'expense'}`}>{transaction.type === 'Income' ? '+' : '-'}₹{Number(transaction.amount).toLocaleString('en-IN')}</span></td>
              <td><div className="transaction-actions"><button className="edit-button" onClick={() => navigate('/edit-transaction', { state: { transaction } })}>Edit</button><button className="delete-button" onClick={() => deleteTransaction(transaction.id).catch(() => {})}>Delete</button></div></td>
            </tr>)}</tbody>
          </table>
          {loading && <div className="empty-state">Loading transactions...</div>}
          {filteredTransactions.length === 0 && <div className="empty-state">No transactions found.</div>}
        </div>
      </div>
    </div>
  )
}

export default Transactions
