import { NavLink } from 'react-router-dom'

function Sidebar() {
  const mainItems = [
    { name: 'Dashboard', path: '/', icon: '✿' },
    { name: 'Expenses', path: '/transactions', icon: '▤' },
    { name: 'Add Transaction', path: '/add-transaction', icon: '+' },
  ]

  const insightItems = [
    { name: 'Analytics', path: '/analytics', icon: '▥' },
    { name: 'Goals', path: '/goals', icon: '◎' },
    { name: 'Budget', path: '/budgets', icon: '▣' },
  ]

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2>Finuance</h2>
        <span>AI EXPENSE ANALYZER</span>
      </div>

      <div className="sidebar-section-title">OVERVIEW</div>

      <nav className="sidebar-nav">
        {mainItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.name}</span>
            {item.name === 'Dashboard' && <span className="nav-active-dot">•</span>}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-section-title">INSIGHTS</div>

      <nav className="sidebar-nav">
        {insightItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              isActive ? 'nav-item active' : 'nav-item'
            }
          >
            <span className="nav-icon">{item.icon}</span>
            <span>{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-section-title">AI & SETTINGS</div>

      <nav className="sidebar-nav">
        <NavLink
          to="/alerts"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <span className="nav-icon">✦</span>
          <span>Smart Alerts</span>
        </NavLink>

        <NavLink
          to="/categories"
          className={({ isActive }) =>
            isActive ? 'nav-item active' : 'nav-item'
          }
        >
          <span className="nav-icon">⚙</span>
          <span>Categories</span>
        </NavLink>
      </nav>

      <div className="sidebar-profile">
        <div className="profile-avatar">A</div>

        <div className="profile-info">
          <strong>Aryan Reddy</strong>
          <span>Personal · Mar 2025</span>
        </div>
      </div>
    </aside>
  )
}

export default Sidebar
