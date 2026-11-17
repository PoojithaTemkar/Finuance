import { useState } from 'react'
import './Goals.css'

function Goals() {
  const [goals, setGoals] = useState([
    { id: 1, name: 'Emergency Fund', target: 100000, saved: 68420, deadline: 'Dec 2026', icon: '◉' },
    { id: 2, name: 'New Laptop', target: 80000, saved: 52000, deadline: 'Nov 2026', icon: '▣' },
    { id: 3, name: 'Vacation', target: 50000, saved: 28500, deadline: 'Mar 2027', icon: '◇' },
  ])

  const deleteGoal = (id) => setGoals(goals.filter((goal) => goal.id !== id))

  return (
    <div className="goals-page">
      <div className="page-header"><div><span className="eyebrow">FINANCIAL PLANNING</span><h1>My Goals</h1><p>Track your savings goals and stay on course.</p></div><button className="primary-button">+ New Goal</button></div>
      <div className="goal-summary">
        <div className="summary-card"><span>Total Goals</span><strong>{goals.length}</strong><small>Active savings goals</small></div>
        <div className="summary-card"><span>Total Target</span><strong>₹2,30,000</strong><small>Across all goals</small></div>
        <div className="summary-card"><span>Total Saved</span><strong>₹1,48,920</strong><small>64.7% of target</small></div>
      </div>
      <div className="section-heading"><div><h2>Active Goals</h2><p>Your current savings progress</p></div></div>
      <div className="goals-list">
        {goals.map((goal) => {
          const percentage = Math.min(Math.round((goal.saved / goal.target) * 100), 100)
          return (
            <div className="goal-card" key={goal.id}>
              <div className="goal-top"><div className="goal-icon">{goal.icon}</div><div className="goal-info"><h3>{goal.name}</h3><span>Target date: {goal.deadline}</span></div><button className="delete-goal" onClick={() => deleteGoal(goal.id)}>×</button></div>
              <div className="goal-amounts"><div><strong>₹{goal.saved.toLocaleString('en-IN')}</strong><span>saved</span></div><div className="target-amount"><strong>₹{goal.target.toLocaleString('en-IN')}</strong><span>target</span></div></div>
              <div className="goal-progress"><div className="progress-track"><div className="progress-fill" style={{ width: `${percentage}%` }} /></div><span>{percentage}%</span></div>
              <div className="goal-footer"><span>₹{(goal.target - goal.saved).toLocaleString('en-IN')} remaining</span><button className="text-button">View Details →</button></div>
            </div>
          )
        })}
      </div>
      <div className="goal-tip"><div className="tip-icon">✦</div><div><strong>Small progress adds up.</strong><p>Based on your current savings rate, you're building a healthy financial cushion. Keep contributing consistently toward your goals.</p></div></div>
    </div>
  )
}

export default Goals
