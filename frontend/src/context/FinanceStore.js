import { createContext, useContext } from 'react'

export const FinanceContext = createContext()

export function useFinance() {
  return useContext(FinanceContext)
}