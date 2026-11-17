import './Alerts.css'

function Alerts() {
  const alerts = [
    { type: 'warning', icon: '!', title: 'Food spending is higher than usual', message: 'You have spent ₹6,240 on Food & Dining this month, which is 18% higher than your usual monthly average.', time: 'Today' },
    { type: 'success', icon: '✓', title: 'Budget goal on track', message: 'Your Transport spending is currently well within your monthly budget.', time: 'Yesterday' },
    { type: 'info', icon: 'i', title: 'Recurring payment detected', message: 'Netflix ₹649 appears to be a recurring monthly expense.', time: '2 days ago' },
    { type: 'warning', icon: '!', title: 'Entertainment budget nearly reached', message: 'You have used 88% of your Entertainment budget with 9 days remaining.', time: '3 days ago' },
  ]

  return (
    <div className="alerts-page">
      <div className="page-header"><div><span className="eyebrow">FINANCIAL MONITORING</span><h1>Smart Alerts</h1><p>Important updates and spending observations.</p></div></div>
      <div className="alert-summary">
        <div className="alert-summary-card"><div className="alert-summary-icon warning">!</div><div><strong>2</strong><span>Needs attention</span></div></div>
        <div className="alert-summary-card"><div className="alert-summary-icon success">✓</div><div><strong>1</strong><span>Positive updates</span></div></div>
        <div className="alert-summary-card"><div className="alert-summary-icon info">i</div><div><strong>1</strong><span>Information</span></div></div>
      </div>
      <div className="alerts-section"><div className="section-heading"><h2>Recent Alerts</h2><span>4 notifications</span></div><div className="alerts-list">
        {alerts.map((alert) => <div className={`alert-card ${alert.type}`} key={`${alert.title}-${alert.time}`}><div className="alert-icon">{alert.icon}</div><div className="alert-content"><div className="alert-title-row"><h3>{alert.title}</h3><span>{alert.time}</span></div><p>{alert.message}</p></div></div>)}
      </div></div>
      <div className="insight-box"><div className="insight-box-icon">✦</div><div><strong>How Smart Alerts work</strong><p>Finuance analyses your transactions, budgets and spending patterns to highlight unusual activity, budget risks and useful financial observations.</p></div></div>
    </div>
  )
}

export default Alerts
