import { useState, useEffect } from 'react'
import { GoogleOAuthProvider } from '@react-oauth/google'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
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
  const [isLanding, setIsLanding] = useState(() => !localStorage.getItem('token'))
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [categorySource, setCategorySource] = useState('Categories')

  useEffect(() => {


    window.history.pushState(null, "", window.location.href);

    const handlePopState = () => {
        window.history.pushState(null, "", window.location.href);
    };

    window.addEventListener("popstate", handlePopState);

    return () => {

      if (!localStorage.getItem("token")) {
          return;
      }
      window.removeEventListener("popstate", handlePopState);
    };

  }, [])

  if (isLanding) {
    return (
      <GoogleOAuthProvider clientId={import.meta.env.VITE_GOOGLE_CLIENT_ID}>
        <Landing onSignIn={() => setIsLanding(false)} />
      </GoogleOAuthProvider>
    )
  }

  function handleNavigate(page) {
    setActivePage(page)
    setSelectedCategory(null)
  }

  function handleCategoryClick(category) {
    setCategorySource(activePage)
    setSelectedCategory(category)
    setActivePage('SubCategories')
  }

  function renderPage() {
    if (activePage === 'SubCategories' && selectedCategory) {
      return (
        <SubCategories
          category={selectedCategory}
          onBack={() => handleNavigate(categorySource)}
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
      return <Profile onLogout={() => { localStorage.removeItem('token'); localStorage.removeItem('refresh_token'); localStorage.removeItem('categories'); setIsLanding(true) }} />
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
      <ToastContainer position="top-right" autoClose={3000} />
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
