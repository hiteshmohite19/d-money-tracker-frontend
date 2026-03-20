function Navbar({ onToggleSidebar }) {
  return (
    <header className="fixed top-0 left-0 right-0 z-30 bg-white shadow-sm h-16 flex items-center px-4 sm:px-6">
      <button
        onClick={onToggleSidebar}
        className="p-2 rounded-md text-gray-500 hover:bg-gray-100 hover:text-indigo-600 transition-colors"
        aria-label="Toggle sidebar"
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      <span className="ml-4 text-xl font-bold text-indigo-600">MoneyTracker</span>
    </header>
  )
}

export default Navbar
