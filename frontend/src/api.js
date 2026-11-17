const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

async function handleResponse(response) {
  const data = await response.json().catch(() => null)

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong')
  }

  return data
}

async function request(path, options) {
  const response = await fetch(`${API_BASE_URL}${path}`, options)
  return handleResponse(response)
}

function jsonOptions(method, body) {
  return {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  }
}

export function getTransactions() {
  return request('/transactions')
}

export function createTransaction(transaction) {
  return request('/transactions', jsonOptions('POST', transaction))
}

export function updateTransaction(id, transaction) {
  return request(`/transactions/${id}`, jsonOptions('PUT', transaction))
}

export function deleteTransaction(id) {
  return request(`/transactions/${id}`, { method: 'DELETE' })
}

export function getCategories() {
  return request('/categories')
}

export function createCategory(category) {
  return request('/categories', jsonOptions('POST', category))
}

export function updateCategory(id, category) {
  return request(`/categories/${id}`, jsonOptions('PUT', category))
}

export function deleteCategory(id) {
  return request(`/categories/${id}`, { method: 'DELETE' })
}

export function getBudgets() {
  return request('/budgets')
}

export function createBudget(budget) {
  return request('/budgets', jsonOptions('POST', budget))
}

export function updateBudget(id, budget) {
  return request(`/budgets/${id}`, jsonOptions('PUT', budget))
}

export function deleteBudget(id) {
  return request(`/budgets/${id}`, { method: 'DELETE' })
}

export function getSummary() {
  return request('/analytics/summary')
}

export function getCategorySpending() {
  return request('/analytics/category-spending')
}

export function getMonthlyAnalytics() {
  return request('/analytics/monthly')
}

export function getBudgetPerformance() {
  return request('/analytics/budget-performance')
}

export function getRecentTransactions() {
  return request('/analytics/recent-transactions')
}