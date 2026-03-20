import { useMemo, useState } from 'react'
import {
  PieChart, Pie, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
} from 'recharts'
import { ALL_TRANSACTIONS, TRANSACTION_TYPE } from '../data/transactions'
import { monthlyStats } from '../data/stats'

const CATEGORY_COLORS = [
  '#6366f1', '#8b5cf6', '#ec4899', '#f43f5e', '#f97316',
  '#eab308', '#22c55e', '#14b8a6', '#3b82f6', '#64748b',
]

const fmt = (n) =>
  `$${n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`

function SummaryCard({ label, value, valueClass = 'text-gray-800' }) {
  return (
    <div className="bg-white rounded-xl shadow-sm p-6">
      <p className="text-sm text-gray-500">{label}</p>
      <p className={`text-2xl font-bold mt-1 ${valueClass}`}>{value}</p>
    </div>
  )
}

function PieTooltip({ active, payload }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm">
      <p className="font-medium text-gray-700">{payload[0].name}</p>
      <p className="text-indigo-600 font-semibold">{fmt(payload[0].value)}</p>
    </div>
  )
}

function BarTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-white border border-gray-200 rounded-lg shadow-md px-3 py-2 text-sm space-y-1">
      <p className="font-semibold text-gray-700">{label}</p>
      {payload.map((p) => (
        <p key={p.name} style={{ color: p.fill }} className="font-medium">
          {p.name}: {fmt(p.value)}
        </p>
      ))}
    </div>
  )
}

export default function Dashboard() {
  const [selectedMonth, setSelectedMonth] = useState('')

  const stats = useMemo(() => {
    const txns = selectedMonth
      ? ALL_TRANSACTIONS.filter((t) => t.date.startsWith(selectedMonth))
      : ALL_TRANSACTIONS

    const credits = txns.filter((t) => t.type === TRANSACTION_TYPE.CREDIT)
    const debits  = txns.filter((t) => t.type === TRANSACTION_TYPE.DEBIT)

    const income   = credits.reduce((s, t) => s + t.amount, 0)
    const expenses = debits.reduce((s, t) => s + t.amount, 0)

    const catMap = {}
    debits.forEach((t) => { catMap[t.category] = (catMap[t.category] ?? 0) + t.amount })
    const pieData = Object.entries(catMap)
      .sort((a, b) => b[1] - a[1])
      .map(([name, value], i) => ({
        name,
        value: parseFloat(value.toFixed(2)),
        fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
      }))

    return { income, expenses, net: income - expenses, pieData }
  }, [selectedMonth])

  const barData = monthlyStats.map((m) => ({
    month: m.monthShort,
    key: m.key,
    Income: m.Income,
    Expenses: m.Expenses,
  }))

  return (
    <div>
      {/* Header */}
      <div className="flex items-center justify-between mb-6 gap-4 flex-wrap">
        <h2 className="text-2xl font-bold text-gray-800">Dashboard</h2>
        <select
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-1.5 text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <option value="">All months</option>
          {monthlyStats.map((m) => (
            <option key={m.key} value={m.key}>
              {m.monthFull} {m.year}
            </option>
          ))}
        </select>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard label="Total Income"   value={fmt(stats.income)}   valueClass="text-green-600" />
        <SummaryCard label="Total Expenses" value={fmt(stats.expenses)} valueClass="text-red-500" />
        <SummaryCard
          label="Net Balance"
          value={`${stats.net >= 0 ? '+' : ''}${fmt(stats.net)}`}
          valueClass={stats.net >= 0 ? 'text-green-600' : 'text-red-500'}
        />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Pie — spending by category */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Spending by Category</h3>
          {stats.pieData.length === 0 ? (
            <div className="h-[280px] flex items-center justify-center text-sm text-gray-400">
              No expense data for this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={stats.pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="45%"
                  outerRadius={90}
                  innerRadius={48}
                  paddingAngle={2}
                />
                <Tooltip content={<PieTooltip />} />
                <Legend
                  iconType="circle"
                  iconSize={8}
                  formatter={(v) => <span className="text-xs text-gray-600">{v}</span>}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar — monthly income vs expenses (always all months for context) */}
        <div className="bg-white rounded-xl shadow-sm p-6">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Monthly Income vs Expenses</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={barData} barCategoryGap="30%" barGap={4}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
              <XAxis
                dataKey="month"
                tick={({ x, y, payload }) => {
                  const isSelected = barData.find((b) => b.month === payload.value)?.key === selectedMonth
                  return (
                    <text x={x} y={y + 12} textAnchor="middle" fontSize={12}
                      fill={isSelected ? '#6366f1' : '#94a3b8'}
                      fontWeight={isSelected ? 700 : 400}>
                      {payload.value}
                    </text>
                  )
                }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                axisLine={false}
                tickLine={false}
                tickFormatter={(v) => `$${v >= 1000 ? `${(v / 1000).toFixed(0)}k` : v}`}
              />
              <Tooltip content={<BarTooltip />} cursor={{ fill: '#f8fafc' }} />
              <Legend
                iconType="circle"
                iconSize={8}
                formatter={(v) => <span className="text-xs text-gray-600">{v}</span>}
              />
              <Bar dataKey="Income"   fill="#22c55e" radius={[4, 4, 0, 0]} />
              <Bar dataKey="Expenses" fill="#f43f5e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  )
}
