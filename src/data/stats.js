import { ALL_TRANSACTIONS, TRANSACTION_TYPE } from './transactions'

const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

const credits = ALL_TRANSACTIONS.filter((t) => t.type === TRANSACTION_TYPE.CREDIT)
const debits  = ALL_TRANSACTIONS.filter((t) => t.type === TRANSACTION_TYPE.DEBIT)

export const totalIncome   = credits.reduce((s, t) => s + t.amount, 0)
export const totalExpenses = debits.reduce((s, t)  => s + t.amount, 0)
export const netBalance    = totalIncome - totalExpenses

// Pie chart: spending by category
const catMap = {}
debits.forEach((t) => { catMap[t.category] = (catMap[t.category] ?? 0) + t.amount })
export const categorySpend = Object.entries(catMap)
  .map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) }))
  .sort((a, b) => b.value - a.value)

// Bar chart: monthly income vs expenses
const monthMap = {}
ALL_TRANSACTIONS.forEach((t) => {
  const key = t.date.slice(0, 7) // "2026-01"
  if (!monthMap[key]) monthMap[key] = { income: 0, expenses: 0, count: 0 }
  if (t.type === TRANSACTION_TYPE.CREDIT) monthMap[key].income += t.amount
  else monthMap[key].expenses += t.amount
  monthMap[key].count++
})

export const monthlyStats = Object.entries(monthMap)
  .sort((a, b) => a[0].localeCompare(b[0]))
  .map(([key, v]) => ({
    key,
    year: key.slice(0, 4),
    monthShort: MONTH_SHORT[parseInt(key.slice(5), 10) - 1],
    monthFull:  MONTH_NAMES[parseInt(key.slice(5), 10) - 1],
    Income:   parseFloat(v.income.toFixed(2)),
    Expenses: parseFloat(v.expenses.toFixed(2)),
    net:      parseFloat((v.income - v.expenses).toFixed(2)),
    count:    v.count,
  }))

// Reports: top spending categories with % share
export const topCategories = categorySpend.map((c) => ({
  ...c,
  pct: totalExpenses > 0 ? parseFloat((c.value / totalExpenses * 100).toFixed(1)) : 0,
}))

// Reports: most transacted category
const catCount = {}
ALL_TRANSACTIONS.forEach((t) => { catCount[t.category] = (catCount[t.category] ?? 0) + 1 })
export const mostFrequentCategory = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]

export const avgExpense = totalExpenses / (debits.length  || 1)
export const avgIncome  = totalIncome   / (credits.length || 1)

export const creditCount = credits.length
export const debitCount  = debits.length
export const totalCount  = ALL_TRANSACTIONS.length

// Top 5 largest expenses
export const topExpenses = [...debits].sort((a, b) => b.amount - a.amount).slice(0, 5)

// Available years (descending)
export const availableYears = [...new Set(ALL_TRANSACTIONS.map((t) => t.date.slice(0, 4)))]
  .sort((a, b) => b.localeCompare(a))
