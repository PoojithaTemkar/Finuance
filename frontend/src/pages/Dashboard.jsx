import './Dashboard.css'
import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useFinance } from '../context/FinanceStore'
import { getCategorySpending, getMonthlyAnalytics, getRecentTransactions, getSummary } from '../api'

function Dashboard() {
  const navigate = useNavigate()
  const { transactions, summary } = useFinance()
  const [analyticsSummary, setAnalyticsSummary] = useState(null)
  const [categoryData, setCategoryData] = useState([])
  const [monthlyData, setMonthlyData] = useState([])
  const [recentTransactions, setRecentTransactions] = useState([])
  const [analyticsError, setAnalyticsError] = useState('')

  useEffect(() => {
    let cancelled = false

    Promise.all([
      getSummary(),
      getCategorySpending(),
      getMonthlyAnalytics(),
      getRecentTransactions(),
    ]).then(([nextSummary, nextCategories, nextMonths, nextTransactions]) => {
      if (cancelled) return
      setAnalyticsSummary(nextSummary)
      setCategoryData(nextCategories)
      setMonthlyData(nextMonths)
      setRecentTransactions(nextTransactions)
      setAnalyticsError('')
    }).catch((error) => {
      if (!cancelled) setAnalyticsError(error.message || 'Unable to load dashboard analytics.')
    })

    return () => { cancelled = true }
  }, [transactions])

  const displaySummary = analyticsSummary ? {
    income: Number(analyticsSummary.total_income),
    expenses: Number(analyticsSummary.total_expenses),
    savings: Number(analyticsSummary.savings),
    savingsRate: Number(analyticsSummary.savings_rate),
    balance: Number(analyticsSummary.savings),
  } : summary

  const spendingData = monthlyData.slice(-6).map((item) => ({
    month: new Date(Number(item.year), Number(item.month) - 1).toLocaleString('en', { month: 'short' }),
    value: Number(item.expenses),
  }))
  const maxMonthlyExpense = Math.max(...spendingData.map((item) => item.value), 1)
  const totalCategorySpending = categoryData.reduce((total, item) => total + Number(item.total_spending), 0)
  const donutColors = ['var(--rose)', 'var(--blush2)', 'var(--green)', 'var(--brown)', 'var(--amber)']
  const donutSlices = categoryData.slice(0, 5).reduce((result, category, index) => {
    const share = totalCategorySpending > 0 ? Number(category.total_spending) / totalCategorySpending * 360 : 0
    return {
      offset: result.offset + share,
      slices: [...result.slices, `${donutColors[index % donutColors.length]} ${result.offset}deg ${result.offset + share}deg`],
    }
  }, { offset: 0, slices: [] }).slices
  const largestCategory = categoryData[0]

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div>
          <p className="eyebrow">OVERVIEW</p>
          <h1>Good morning, Aryan.</h1>
          <p className="dashboard-subtitle">
            Here's what's happening with your finances.
          </p>
        </div>

        <button className="add-transaction-btn" onClick={() => navigate('/add-transaction')}>
          <span>+</span>
          Add Transaction
        </button>
      </div>
      {analyticsError && <p className="dashboard-error" role="alert">{analyticsError}</p>}

      <div className="summary-grid">
        <div className="summary-card balance-card">
          <div className="summary-card-top">
            <span>Total Balance</span>
            <div className="card-icon">₹</div>
          </div>

          <h2>₹{displaySummary.balance.toLocaleString('en-IN')}</h2>

          <div className="card-bottom positive">
            <span>↑ 8.4%</span>
            <span>vs last month</span>
          </div>
        </div>

        <div className="summary-card income-card">
          <div className="summary-card-top">
            <span>Income</span>
            <div className="card-icon income-icon">↗</div>
          </div>

          <h2>₹{displaySummary.income.toLocaleString('en-IN')}</h2>

          <div className="card-bottom">
            <span>This month</span>
          </div>
        </div>

        <div className="summary-card expense-card">
          <div className="summary-card-top">
            <span>Expenses</span>
            <div className="card-icon expense-icon">↘</div>
          </div>

          <h2>₹{displaySummary.expenses.toLocaleString('en-IN')}</h2>

          <div className="card-bottom negative">
            <span>↑ 6.2%</span>
            <span>vs last month</span>
          </div>
        </div>

        <div className="summary-card savings-card">
          <div className="summary-card-top">
            <span>Savings Rate</span>
            <div className="card-icon savings-icon">%</div>
          </div>

          <h2>{displaySummary.savingsRate}%</h2>

          <div className="savings-progress">
            <div className="savings-progress-fill"></div>
          </div>

          <div className="card-bottom">
            <span>₹{displaySummary.savings.toLocaleString('en-IN')} saved</span>
          </div>
        </div>
      </div>

      <div className="dashboard-grid">
        <section className="dashboard-card spending-card">
          <div className="section-header">
            <div>
              <h2>Spending Trend</h2>
              <p>Last 6 months</p>
            </div>

            <span className="live-badge">
              <span></span>
              Live
            </span>
          </div>

          <div className="chart">
            <div className="chart-y-axis">
              <span>₹45k</span>
              <span>₹40k</span>
              <span>₹35k</span>
              <span>₹30k</span>
              <span>₹25k</span>
              <span>₹20k</span>
              <span>₹15k</span>
              <span>₹10k</span>
              <span>₹5k</span>
              <span>₹0k</span>
            </div>

            <div className="chart-area">
              <div className="chart-lines">
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
                <span></span>
              </div>

              <div className="bars">
                {spendingData.map((item, index) => (
                  <div className="bar-wrapper" key={item.month}>
                    <div
                      className={`bar ${index === spendingData.length - 1 ? 'current-bar' : ''}`}
                      style={{ height: `${Math.max(4, item.value / maxMonthlyExpense * 185)}px` }}
                    ></div>

                    <span>{item.month}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <section className="dashboard-card category-card">
          <div className="section-header">
            <div>
              <h2>By Category</h2>
              <p>This month</p>
            </div>

            <button className="small-link">View all →</button>
          </div>

          <div className="donut-container">
              <div className="donut" style={{ background: donutSlices.length ? `conic-gradient(${donutSlices.join(', ')})` : 'var(--cream2)' }}>
              <div className="donut-center">
                <strong>₹{displaySummary.expenses.toLocaleString('en-IN')}</strong>
                <span>Total</span>
              </div>
            </div>
          </div>

          <div className="category-list">
            {categoryData.slice(0, 5).map((category, index) => (
              <div className="category-item" key={category.category_name}>
                <span className="category-dot" style={{ background: donutColors[index % donutColors.length] }}></span>
                <span>{category.category_name}</span>
                <strong>{totalCategorySpending ? Math.round(Number(category.total_spending) / totalCategorySpending * 100) : 0}%</strong>
              </div>
            ))}
            {categoryData.length === 0 && <p className="dashboard-subtitle">No expense data yet.</p>}
          </div>
        </section>
      </div>

      <div className="dashboard-bottom-grid">
        <section className="dashboard-card transactions-card">
          <div className="section-header">
            <div>
              <h2>Recent Transactions</h2>
              <p>Your latest activity</p>
            </div>

            <button className="see-all-btn" onClick={() => navigate('/transactions')}>
              See all
              <span>→</span>
            </button>
          </div>

          <div className="transaction-list">
            {recentTransactions.map((transaction) => (
              <div className="transaction-row" key={transaction.transaction_id}>
                <div className={`transaction-icon ${transaction.transaction_type.toLowerCase()}`}>
                  {transaction.transaction_type === 'Income' ? '↗' : '−'}
                </div>

                <div className="transaction-info">
                  <strong>{transaction.description || transaction.category_name}</strong>
                  <span>
                    {transaction.category_name} · {String(transaction.transaction_date).slice(0, 10)}
                  </span>
                </div>

                <strong className={`transaction-amount ${transaction.transaction_type.toLowerCase()}`}>
                  {transaction.transaction_type === 'Income' ? '+' : '-'}₹{Number(transaction.amount).toLocaleString('en-IN')}
                </strong>
              </div>
            ))}
          </div>
        </section>

        <section className="dashboard-card insights-card">
          <div className="section-header">
            <div>
              <h2>Spending Insights</h2>
              <p>Personalised for you</p>
            </div>

            <div className="sparkle">✦</div>
          </div>

          <div className="insight">
            <div className="insight-icon warning">!</div>

            <div>
              <strong>{largestCategory ? `${largestCategory.category_name} is your largest expense category.` : 'Your spending insights will appear here.'}</strong>
              <p>
                {largestCategory ? `Recorded spending: ₹${Number(largestCategory.total_spending).toLocaleString('en-IN')}.` : 'Add transactions to see categories summarized.'}
              </p>
            </div>
          </div>

          <div className="insight">
            <div className="insight-icon success">✓</div>

            <div>
              <strong>You're on track with your savings.</strong>
              <p>Your current savings rate is {displaySummary.savingsRate}%.</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}

export default Dashboard
