import './Analytics.css'
import { useEffect, useState } from 'react'
import { useFinance } from '../context/FinanceStore'
import { getCategorySpending, getMonthlyAnalytics } from '../api'

function Analytics() {
  const { summary, transactions } = useFinance()
  const [months, setMonths] = useState([])
  const [categories, setCategories] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    Promise.all([getMonthlyAnalytics(), getCategorySpending()])
      .then(([monthlyResult, categoryResult]) => {
        if (cancelled) return
        setMonths(monthlyResult)
        setCategories(categoryResult)
        setError('')
      })
      .catch((requestError) => {
        if (!cancelled) setError(requestError.message || 'Unable to load analytics.')
      })
    return () => { cancelled = true }
  }, [transactions])

  const chartMonths = months.slice(-6)
  const maxMonthlyValue = Math.max(...chartMonths.flatMap((month) => [Number(month.income), Number(month.expenses)]), 1)
  const totalExpense = transactions.filter((transaction) => transaction.type === 'Expense').reduce((total, transaction) => total + Number(transaction.amount), 0)
  const weekendExpense = transactions.filter((transaction) => {
    if (transaction.type !== 'Expense') return false
    const weekday = new Date(`${transaction.date}T00:00:00`).getDay()
    return weekday === 0 || weekday === 6
  }).reduce((total, transaction) => total + Number(transaction.amount), 0)
  const weekendShare = totalExpense ? Math.round(weekendExpense / totalExpense * 100) : 0
  const monthlyExpenseChange = chartMonths.length > 1 && Number(chartMonths.at(-2).expenses) > 0
    ? Math.round((Number(chartMonths.at(-1).expenses) - Number(chartMonths.at(-2).expenses)) / Number(chartMonths.at(-2).expenses) * 100)
    : 0
  const categoryTotal = categories.reduce((total, category) => total + Number(category.total_spending), 0)
  const average = (field, fallback) => months.length
    ? months.reduce((total, month) => total + Number(month[field]), 0) / months.length
    : fallback

  return (
    <div className="analytics-page">
      <div className="page-header">
        <div>
          <p className="eyebrow">FINANCIAL INTELLIGENCE</p>
          <h1>Analytics</h1>
          <p className="page-subtitle">Understand your spending patterns and financial behaviour.</p>
        </div>
        <select className="period-select"><option>Last 6 months</option><option>Last 12 months</option><option>This year</option></select>
      </div>
      {error && <p className="analytics-error" role="alert">{error}</p>}

      <div className="analytics-kpis">
        <div className="analytics-kpi"><span>Average Monthly Spending</span><strong>₹{average('expenses', summary.expenses).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong><small className="negative-change">Across recorded months</small></div>
        <div className="analytics-kpi"><span>Average Monthly Income</span><strong>₹{average('income', summary.income).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong><small className="positive-change">Across recorded months</small></div>
        <div className="analytics-kpi"><span>Average Savings</span><strong>₹{(average('income', summary.income) - average('expenses', summary.expenses)).toLocaleString('en-IN', { maximumFractionDigits: 0 })}</strong><small className="positive-change">Income minus expenses</small></div>
        <div className="analytics-kpi"><span>Savings Rate</span><strong>{summary.savingsRate}%</strong><small className="positive-change">Current rate</small></div>
      </div>

      <div className="analytics-grid">
        <section className="analytics-card large">
          <div className="analytics-card-header"><div><h2>Income vs Expenses</h2><p>Monthly comparison</p></div></div>
          <div className="analytics-chart"><div className="analytics-bars">
            {chartMonths.map((month) => {
              const label = new Date(Number(month.year), Number(month.month) - 1).toLocaleString('en', { month: 'short' })
              return <div className="analytics-month" key={`${month.year}-${month.month}`}><div className="bar-pair"><div className="income-bar" title={`Income: ${Number(month.income).toLocaleString('en-IN')}`} style={{ height: `${Math.max(3, Number(month.income) / maxMonthlyValue * 190)}px` }} /><div className="expense-bar" title={`Expenses: ${Number(month.expenses).toLocaleString('en-IN')}`} style={{ height: `${Math.max(3, Number(month.expenses) / maxMonthlyValue * 190)}px` }} /></div><span>{label} '{String(month.year).slice(-2)}</span></div>
            })}
          </div></div>
          <div className="chart-legend"><span><i className="legend-income" />Income</span><span><i className="legend-expense" />Expenses</span></div>
        </section>

        <section className="analytics-card">
          <div className="analytics-card-header"><div><h2>Top Categories</h2><p>Where your money goes</p></div></div>
          <div className="top-categories">{categories.map((category) => <div className="top-category" key={category.category_name}><div className="category-heading"><span>{category.category_name}</span><strong>₹{Number(category.total_spending).toLocaleString('en-IN')}</strong></div><div className="category-bar"><div style={{ width: `${categoryTotal ? Number(category.total_spending) / categoryTotal * 100 : 0}%` }} /></div></div>)}</div>
          {categories.length === 0 && <p className="analytics-empty">No expense data yet.</p>}
        </section>
      </div>

      <div className="analytics-bottom"><section className="analytics-card insight-analysis">
        <div className="analytics-card-header"><div><h2>Spending Behaviour</h2><p>Patterns detected from your transactions</p></div></div>
        <div className="behaviour-grid">
          <div><strong>Weekend Spending</strong><span>{weekendShare}% of recorded expenses</span></div>
          <div><strong>Largest Expense Category</strong><span>{categories[0]?.category_name || 'Not available yet'}</span></div>
          <div><strong>Months Tracked</strong><span>{months.length} months with activity</span></div>
          <div><strong>Month-over-Month</strong><span>{monthlyExpenseChange >= 0 ? 'Increased' : 'Decreased'} by {Math.abs(monthlyExpenseChange)}%</span></div>
        </div>
      </section></div>
    </div>
  )
}

export default Analytics
