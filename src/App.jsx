import { useState } from 'react'
import Navbar from './components/Navbar'
import Sidebar from './components/Sidebar'
import Dashboard from './pages/Dashboard'
import Categories from './pages/Categories'
import Transactions from './pages/Transactions'
import SubCategories from './pages/SubCategories'
import Profile from './pages/Profile'
import Reports from './pages/Reports'
import Wishlists from './pages/Wishlists'
import Landing from './pages/Landing'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [activePage, setActivePage] = useState('Dashboard')
  const [isLanding, setIsLanding] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(null)

  if (isLanding) {
    return (
      <Landing onSignIn={() => setIsLanding(false)} />
    )
  }

  function handleNavigate(page) {
    setActivePage(page)
    setSelectedCategory(null)
  }

  function handleCategoryClick(category) {
    setSelectedCategory(category)
    setActivePage('SubCategories')
  }

  function renderPage() {
    if (activePage === 'SubCategories' && selectedCategory) {
      return (
        <SubCategories
          category={selectedCategory}
          onBack={() => handleNavigate('Categories')}
        />
      )
    }
    if (activePage === 'Transactions') {
      return <Transactions onCategoryClick={handleCategoryClick} />
    }
    if (activePage === 'Categories') {
      return <Categories onCategoryClick={handleCategoryClick} />
    }
    if (activePage === 'Dashboard') {
      return <Dashboard />
    }
    if (activePage === 'Profile') {
      return <Profile />
    }
    if (activePage === 'Reports') {
      return <Reports />
    }
    if (activePage === "Wishlists") {
        return <Wishlists />;
    }
    return <p className="text-gray-400">Page coming soon.</p>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <Navbar onToggleSidebar={() => setSidebarOpen((prev) => !prev)} />
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        onNavigate={handleNavigate}
      />

      <main className="fixed top-16 left-0 right-0 bottom-0 lg:left-64 transition-all duration-300 overflow-y-auto bg-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {renderPage()}
        </div>
      </main>
    </div>
  )
}

export default App
