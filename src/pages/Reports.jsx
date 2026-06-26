import { useMemo, useState } from 'react'
import { CURRENCY } from '../constants'
import { ALL_TRANSACTIONS, TRANSACTION_TYPE } from '../data/transactions'
import Section from '../components/reports/Section'
import Row from '../components/reports/Row'
import RankItem from '../components/reports/RankItem'

const fmt = (n) => `${CURRENCY}${n.toFixed(2)}`

const MONTH_NAMES = ['January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December']

export default function Reports() {
  const years = useMemo(() => {
    const set = new Set(ALL_TRANSACTIONS.map((t) => t.date.slice(0, 4)))
    return [...set].sort((a, b) => b.localeCompare(a))
  }, [])

  const [selectedYear, setSelectedYear] = useState(years[0] ?? '')
  const [monthPage, setMonthPage] = useState(0)

  const stats = useMemo(() => {
    const credits = ALL_TRANSACTIONS.filter((t) => t.type === TRANSACTION_TYPE.CREDIT)
    const debits  = ALL_TRANSACTIONS.filter((t) => t.type === TRANSACTION_TYPE.DEBIT)

    const totalIncome   = credits.reduce((s, t) => s + t.amount, 0)
    const totalExpenses = debits.reduce((s, t) => s + t.amount, 0)
    const netBalance    = totalIncome - totalExpenses

    // Category spend breakdown
    const categoryTotals = {}
    debits.forEach((t) => {
      categoryTotals[t.category] = (categoryTotals[t.category] ?? 0) + t.amount
    })
    const topCategories = Object.entries(categoryTotals)
      .sort((a, b) => b[1] - a[1])

    // Monthly breakdown
    const monthlyMap = {}
    ALL_TRANSACTIONS.forEach((t) => {
      const key = t.date.slice(0, 7) // "2026-01"
      if (!monthlyMap[key]) monthlyMap[key] = { income: 0, expense: 0, count: 0 }
      if (t.type === TRANSACTION_TYPE.CREDIT) monthlyMap[key].income += t.amount
      else monthlyMap[key].expense += t.amount
      monthlyMap[key].count++
    })
    const months = Object.entries(monthlyMap).sort((a, b) => a[0].localeCompare(b[0]))

    // Top 5 largest expenses
    const topExpenses = [...debits].sort((a, b) => b.amount - a.amount).slice(0, 5)

    // Most frequent category
    const catCount = {}
    ALL_TRANSACTIONS.forEach((t) => { catCount[t.category] = (catCount[t.category] ?? 0) + 1 })
    const mostFreqCat = Object.entries(catCount).sort((a, b) => b[1] - a[1])[0]

    // Average transaction
    const avgDebit  = totalExpenses / (debits.length || 1)
    const avgCredit = totalIncome   / (credits.length || 1)

    return {
      totalIncome, totalExpenses, netBalance,
      topCategories, months, topExpenses,
      mostFreqCat, avgDebit, avgCredit,
      totalCount: ALL_TRANSACTIONS.length,
      debitCount: debits.length,
      creditCount: credits.length,
    }
  }, [])

  function monthLabel(key) {
    const [year, month] = key.split('-')
    return `${MONTH_NAMES[parseInt(month, 10) - 1]} ${year}`
  }

  return (
    <div>
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Reports</h2>
        <p className="text-sm text-gray-500 mt-1">Summary and insights across all {stats.totalCount} transactions</p>
      </div>

      <div className="space-y-4">

        {/* Overall Summary */}
        <Section title="Overall Summary">
          <Row label="Total income received"      value={fmt(stats.totalIncome)}   valueClass="text-green-600" />
          <Row label="Total expenses paid"        value={fmt(stats.totalExpenses)} valueClass="text-red-500" />
          <Row
            label="Net balance"
            value={`${stats.netBalance >= 0 ? '+' : ''}${fmt(stats.netBalance)}`}
            valueClass={stats.netBalance >= 0 ? 'text-green-600' : 'text-red-500'}
          />
          <div className="pt-2 border-t border-gray-50 mt-2">
            <Row label="Total transactions"   value={`${stats.totalCount} entries`} />
            <Row label="Credit transactions"  value={`${stats.creditCount} entries`} />
            <Row label="Debit transactions"   value={`${stats.debitCount} entries`} />
          </div>
        </Section>

        {/* Averages */}
        <Section title="Averages">
          <Row label="Average expense per transaction"  value={fmt(stats.avgDebit)}  valueClass="text-red-500" />
          <Row label="Average income per transaction"   value={fmt(stats.avgCredit)} valueClass="text-green-600" />
          <Row label="Most transacted category"
            value={`${stats.mostFreqCat[0]} (${stats.mostFreqCat[1]} times)`}
          />
        </Section>

        {/* Top Spending Categories */}
        <Section title="Spending by Category">
          {stats.topCategories.map(([cat, total], i) => (
            <RankItem
              key={cat}
              rank={i + 1}
              label={cat}
              sub={`${fmt(total / stats.totalExpenses * 100).replace(CURRENCY, '')}% of total expenses`}
              value={fmt(total)}
              valueClass="text-red-500"
            />
          ))}
        </Section>

        {/* Monthly Breakdown */}
        {(() => {
          const PAGE_SIZE = 3
          const yearMonths = stats.months.filter(([key]) => key.startsWith(selectedYear))
          const totalPages = Math.ceil(yearMonths.length / PAGE_SIZE)
          const safePage = Math.min(monthPage, Math.max(0, totalPages - 1))
          const pageMonths = yearMonths.slice(safePage * PAGE_SIZE, safePage * PAGE_SIZE + PAGE_SIZE)

          return (
            <Section
              title="Monthly Breakdown"
              action={
                <div className="flex items-center gap-2">
                  {totalPages > 1 && (
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setMonthPage((p) => Math.max(0, p - 1))}
                        disabled={safePage === 0}
                        className="p-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Previous"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                        </svg>
                      </button>
                      <span className="text-xs text-gray-400 min-w-[3rem] text-center">
                        {safePage + 1} / {totalPages}
                      </span>
                      <button
                        onClick={() => setMonthPage((p) => Math.min(totalPages - 1, p + 1))}
                        disabled={safePage === totalPages - 1}
                        className="p-1 rounded text-gray-400 hover:text-gray-600 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                        aria-label="Next"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                  <select
                    value={selectedYear}
                    onChange={(e) => { setSelectedYear(e.target.value); setMonthPage(0) }}
                    className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    {years.map((y) => <option key={y} value={y}>{y}</option>)}
                  </select>
                </div>
              }
            >
              {pageMonths.length === 0 ? (
                <p className="text-gray-400 text-sm py-2">No transactions for {selectedYear}.</p>
              ) : (
                pageMonths.map(([key, m]) => {
                  const net = m.income - m.expense
                  return (
                    <div key={key} className="py-2 border-b border-gray-50 last:border-0">
                      <p className="font-medium text-gray-800 mb-1">{monthLabel(key)}</p>
                      <div className="pl-3 space-y-0.5">
                        <Row label="Income"       value={fmt(m.income)}  valueClass="text-green-600" />
                        <Row label="Expenses"     value={fmt(m.expense)} valueClass="text-red-500" />
                        <Row
                          label="Net"
                          value={`${net >= 0 ? '+' : ''}${fmt(net)}`}
                          valueClass={net >= 0 ? 'text-green-600' : 'text-red-500'}
                        />
                        <Row label="Transactions" value={`${m.count} entries`} />
                      </div>
                    </div>
                  )
                })
              )}
            </Section>
          )
        })()}

        {/* Largest Expenses */}
        <Section title="Top 5 Largest Expenses">
          {stats.topExpenses.map((t, i) => (
            <RankItem
              key={t.id}
              rank={i + 1}
              label={t.description}
              sub={`${t.category} · ${t.subCategory} · ${t.date}`}
              value={fmt(t.amount)}
              valueClass="text-red-500"
            />
          ))}
        </Section>

      </div>
    </div>
  )
}
