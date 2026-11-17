import { BrowserRouter, Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import FinanceProvider from './context/FinanceContext'

import Dashboard from './pages/Dashboard'
import Transactions from './pages/Transactions'
import AddTransaction from './pages/AddTransaction'
import EditTransaction from './pages/EditTransaction'
import Budgets from './pages/Budgets'
import Analytics from './pages/Analytics'
import Goals from './pages/Goals'
import Alerts from './pages/Alerts'
import Categories from './pages/Categories'

function App() {
  return (
    <FinanceProvider>
      <BrowserRouter>
      <Routes>
        <Route element={<MainLayout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/transactions" element={<Transactions />} />
          <Route path="/add-transaction" element={<AddTransaction />} />
          <Route path="/edit-transaction" element={<EditTransaction />} />
          <Route path="/budgets" element={<Budgets />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/goals" element={<Goals />} />
          <Route path="/alerts" element={<Alerts />} />
          <Route path="/categories" element={<Categories />} />
        </Route>
      </Routes>
      </BrowserRouter>
    </FinanceProvider>
  )
}

export default App
