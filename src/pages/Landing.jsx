import { useState } from 'react'
import { GoogleLogin } from '@react-oauth/google'
import { CURRENCY } from '../constants'
import { post } from '../api/client'

const NAV_LINKS = ['Features', 'How It Works', 'Reports']

const FEATURES = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: 'Smart Categories',
    desc: 'Organise every rupee into categories like Food, EMI, Travel, and more. Build a structure that matches your lifestyle.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 10h16M4 14h10M4 18h6" />
      </svg>
    ),
    title: 'Sub-Categories',
    desc: 'Go deeper with sub-categories under each category — track Groceries vs Dining separately inside Food.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M7 16V4m0 0L3 8m4-4l4 4M17 8v12m0 0l4-4m-4 4l-4-4" />
      </svg>
    ),
    title: 'Every Transaction',
    desc: 'Log credits and debits with date, description, and even attach a proof photo. Nothing slips through the cracks.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    title: 'Visual Dashboard',
    desc: 'See your spending by category on a pie chart and compare monthly income vs expenses on a bar chart at a glance.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    title: 'Detailed Reports',
    desc: 'Monthly breakdowns, top spending categories, largest expenses, and averages — all in one readable report.',
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    ),
    title: 'Planned Expenses',
    desc: 'Keep a wishlist of upcoming purchases with expected dates and prices so you can plan ahead with confidence.',
  },
]

const STEPS = [
  {
    step: '01',
    title: 'Create a Category',
    desc: 'Start by adding broad categories — Food, Transport, Entertainment, EMI, Health — whatever fits your life.',
  },
  {
    step: '02',
    title: 'Add Sub-Categories',
    desc: 'Break each category into sub-categories for precise tracking. Food becomes Groceries, Dining, Snacks.',
  },
  {
    step: '03',
    title: 'Log Transactions',
    desc: 'Add credit or debit transactions under any sub-category. Attach proof and set the date.',
  },
  {
    step: '04',
    title: 'Review & Analyse',
    desc: 'Visit your Dashboard for charts or Reports for a full breakdown. Know exactly where your money goes.',
  },
]

const STATS = [
  { value: '10+', label: 'Expense categories' },
  { value: '100%', label: 'Private & local' },
  { value: '∞', label: 'Transactions supported' },
]

function SignInModal({ onClose, onSignIn }) {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  // const [mobile, setMobile] = useState('')
  // const [mobileError, setMobileError] = useState('')
  // const [step, setStep] = useState('mobile') // 'mobile' | 'otp'
  // const [otp, setOtp] = useState('')
  // const [otpError, setOtpError] = useState('')
  // const [sentMobile, setSentMobile] = useState('')

  function saveSession(data) {
    localStorage.setItem('token', data.access_token)
    if (data.refresh_token) localStorage.setItem('refresh_token', data.refresh_token)
    localStorage.setItem('categories', JSON.stringify(data.user_categories ?? data))
    onSignIn()
  }


  // function handleMobileSubmit(e) {
  //   e.preventDefault()
  //   const digits = mobile.replace(/\D/g, '')
  //   if (digits.length !== 10) return setMobileError('Enter a valid 10-digit mobile number.')
  //   if (!/^[6-9]/.test(digits)) return setMobileError('Number must start with 6, 7, 8, or 9.')
  //   setMobileError('')
  //   setSentMobile(`+91${digits}`)
  //   setStep('otp')
  // }

  // async function handleOtpSubmit(e) {
  //   e.preventDefault()
  //   if (otp.length !== 6) return setOtpError('Enter the 6-digit OTP.')
  //   setOtpError('')
  //   setLoading(true)
  //   setError('')
  //   try {
  //     const data = await post('/api/users/verify-otp/', { mobile: sentMobile, otp })
  //     saveSession(data)
  //   } catch (err) {
  //     setError(err.message || 'Invalid OTP. Please try again.')
  //   } finally {
  //     setLoading(false)
  //   }
  // }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-8">
        <div className="w-12 h-12 rounded-xl bg-indigo-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" strokeWidth={1.8} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900 mb-1 text-center">Welcome to MoneyTracker</h2>
        <p className="text-sm text-gray-500 mb-6 text-center">Sign in to start tracking your finances.</p>

        {/* Mobile sign-in — commented out, using Google sign-in only */}
        {/* <form onSubmit={handleMobileSubmit} className="mb-4">
          <label className="block text-xs font-medium text-gray-600 mb-1">Mobile Number</label>
          <div className="flex">
            <span className="inline-flex items-center px-3 border border-r-0 border-gray-300 rounded-l-xl bg-gray-50 text-gray-500 text-sm">+91</span>
            <input
              type="tel"
              value={mobile}
              onChange={(e) => { setMobile(e.target.value.replace(/\D/g, '').slice(0, 10)); setMobileError('') }}
              placeholder="9XXXXXXXXX"
              disabled={loading}
              autoFocus
              className="w-full border border-gray-300 rounded-r-xl px-3 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            />
          </div>
          {mobileError && <p className="mt-1 text-xs text-red-500">{mobileError}</p>}
          <button
            type="submit"
            disabled={loading}
            className="mt-3 w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
          >
            Continue with Mobile
          </button>
        </form>

        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400">or</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div> */}

        {/* OTP step — commented out */}
        {/* {step === 'otp' && (
          <form onSubmit={handleOtpSubmit}>
            <label className="block text-xs font-medium text-gray-600 mb-1">OTP</label>
            <input
              type="tel"
              value={otp}
              onChange={(e) => { setOtp(e.target.value.replace(/\D/g, '').slice(0, 6)); setOtpError('') }}
              placeholder="------"
              disabled={loading}
              autoFocus
              className="w-full border border-gray-300 rounded-xl px-3 py-2.5 text-sm text-center tracking-[0.5em] font-mono focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-60"
            />
            {otpError && <p className="mt-1 text-xs text-red-500">{otpError}</p>}
            <button type="submit" disabled={loading}
              className="mt-3 w-full py-2.5 bg-indigo-600 text-white text-sm font-medium rounded-xl hover:bg-indigo-700 disabled:opacity-60 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Verifying…' : 'Verify OTP'}
            </button>
            <button type="button" onClick={() => { setStep('mobile'); setOtp(''); setError('') }} disabled={loading}
              className="mt-2 w-full text-xs text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors"
            >
              Change number
            </button>
          </form>
        )} */}

        <div className="flex justify-center">
          <GoogleLogin
            onSuccess={async (credentialResponse) => {
              setLoading(true)
              setError('')
              try {
                const data = await post('/api/auth/signin/', { access_token: credentialResponse.credential })
                saveSession(data)
              } catch (err) {
                setError(err.message || 'Sign in failed. Please try again.')
              } finally {
                setLoading(false)
              }
            }}
            onError={() => setError('Google sign-in failed. Please try again.')}
          />
        </div>

        {error && <p className="mt-3 text-xs text-red-500 text-center">{error}</p>}

        <button
          onClick={onClose}
          disabled={loading}
          className="mt-4 w-full text-xs text-gray-400 hover:text-gray-600 disabled:opacity-40 transition-colors"
        >
          Cancel
        </button>
      </div>
    </div>
  )
}

export default function Landing({ onSignIn }) {
  const [showModal, setShowModal] = useState(false)

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Navbar ── */}
      <header className="sticky top-0 z-30 bg-white/80 backdrop-blur border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" strokeWidth={2.2} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-bold text-gray-800 text-lg tracking-tight">MoneyTracker</span>
          </div>

          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-gray-500">
            {NAV_LINKS.map((l) => (
              <a key={l} href={`#${l.toLowerCase().replace(/\s+/g, '-')}`} className="hover:text-indigo-600 transition-colors">
                {l}
              </a>
            ))}
          </nav>

          <button
            onClick={() => setShowModal(true)}
            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Sign in
          </button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-24 text-center">
        <span className="inline-block mb-4 px-3 py-1 rounded-full bg-indigo-50 text-indigo-600 text-xs font-semibold uppercase tracking-widest">
          Personal Finance
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-gray-900 leading-tight mb-6">
          Know exactly where<br />
          <span className="text-indigo-600">your money goes.</span>
        </h1>
        <p className="max-w-2xl mx-auto text-lg text-gray-500 mb-10 leading-relaxed">
          MoneyTracker helps you organise spending into categories and sub-categories,
          log every transaction, and understand your finances through clear dashboards and reports.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Get started — Sign in
        </button>

        {/* Stats strip */}
        <div className="mt-16 grid grid-cols-3 divide-x divide-gray-200 border border-gray-200 rounded-2xl bg-white shadow-sm overflow-hidden max-w-lg mx-auto">
          {STATS.map(({ value, label }) => (
            <div key={label} className="px-6 py-5">
              <p className="text-2xl font-extrabold text-indigo-600">{value}</p>
              <p className="text-xs text-gray-500 mt-0.5">{label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="bg-white py-20 border-y border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <h2 className="text-3xl font-bold text-gray-900 mb-3">Everything you need to track money</h2>
            <p className="text-gray-500 max-w-xl mx-auto">From logging a coffee purchase to reviewing annual spending, MoneyTracker has it covered.</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon, title, desc }) => (
              <div key={title} className="p-6 rounded-2xl border border-gray-100 hover:border-indigo-100 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4">
                  {icon}
                </div>
                <h3 className="font-semibold text-gray-800 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ── */}
      <section id="how-it-works" className="py-20 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl font-bold text-gray-900 mb-3">How it works</h2>
          <p className="text-gray-500 max-w-xl mx-auto">Four simple steps to get full visibility over your finances.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {STEPS.map(({ step, title, desc }, i) => (
            <div key={step} className="relative">
              {i < STEPS.length - 1 && (
                <div className="hidden lg:block absolute top-6 left-full w-full h-px bg-gradient-to-r from-indigo-200 to-transparent z-0" />
              )}
              <div className="relative z-10 bg-white rounded-2xl border border-gray-100 p-6 h-full">
                <span className="text-3xl font-extrabold text-indigo-100">{step}</span>
                <h3 className="font-semibold text-gray-800 mt-2 mb-2">{title}</h3>
                <p className="text-sm text-gray-500 leading-relaxed">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Reports highlight ── */}
      <section id="reports" className="bg-indigo-600 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-white">
            <span className="inline-block mb-3 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-widest">
              Reports
            </span>
            <h2 className="text-3xl font-bold mb-4 leading-tight">Understand your spending, month by month.</h2>
            <p className="text-indigo-100 leading-relaxed mb-6">
              Get a full picture — overall income vs expenses, spending by category, monthly breakdowns,
              your top 5 largest expenses, and average transaction values. Filter by year and page through months.
            </p>
            <ul className="space-y-2 text-sm text-indigo-100">
              {[
                'Overall income & expense summary',
                'Spending ranked by category',
                'Monthly breakdown with pagination',
                'Top 5 largest expenses',
                'Average credit & debit per transaction',
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-indigo-300 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="flex-1 w-full bg-white rounded-2xl shadow-xl p-6 max-w-sm lg:max-w-none">
            <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-4">Monthly Breakdown — 2026</p>
            {[
              { month: 'January', income: 5200, expense: 3100 },
              { month: 'February', income: 4800, expense: 3600 },
              { month: 'March', income: 5500, expense: 2900 },
            ].map(({ month, income, expense }) => {
              const net = income - expense
              return (
                <div key={month} className="mb-4 last:mb-0 pb-4 last:pb-0 border-b last:border-0 border-gray-100">
                  <p className="text-sm font-semibold text-gray-800 mb-2">{month}</p>
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div>
                      <p className="text-gray-400">Income</p>
                      <p className="font-semibold text-green-600">{CURRENCY}{income.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Expenses</p>
                      <p className="font-semibold text-red-500">{CURRENCY}{expense.toLocaleString()}</p>
                    </div>
                    <div>
                      <p className="text-gray-400">Net</p>
                      <p className={`font-semibold ${net >= 0 ? 'text-green-600' : 'text-red-500'}`}>
                        {net >= 0 ? '+' : ''}{CURRENCY}{net.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 text-center max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to take control of your money?</h2>
        <p className="text-gray-500 mb-8">Create your free account and start tracking in minutes.</p>
        <button
          onClick={() => setShowModal(true)}
          className="px-8 py-3 bg-indigo-600 text-white font-semibold rounded-xl hover:bg-indigo-700 transition-colors shadow-sm"
        >
          Sign in to get started
        </button>
      </section>

      {/* ── Footer ── */}
      <footer className="border-t border-gray-100 py-8">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-gray-400">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <span className="font-semibold text-gray-600">MoneyTracker</span>
          </div>
          <p>© {new Date().getFullYear()} MoneyTracker. All rights reserved.</p>
        </div>
      </footer>

      {showModal && (
        <SignInModal
          onClose={() => setShowModal(false)}
          onSignIn={onSignIn}
        />
      )}

    </div>
  )
}
