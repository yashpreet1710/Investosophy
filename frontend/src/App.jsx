import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { UserProvider } from './context/UserContext'
import Navbar from './components/Navbar'
import Onboarding from './pages/Onboarding'
import Markets from './pages/Markets'
import StockDetail from './pages/StockDetail'
import Watchlist from './pages/Watchlist'
import Portfolio from './pages/Portfolio'
import Calculators from './pages/Calculators'
import Settings from './pages/Settings'

function App() {
  const hasOnboarded = localStorage.getItem('user_level')

  return (
    <ThemeProvider>
      <UserProvider>
        <BrowserRouter>
          <div style={{ backgroundColor: 'var(--bg)', minHeight: '100vh', color: 'var(--text)' }}>
            <Routes>
              <Route path="/onboarding" element={<Onboarding />} />
              <Route path="/*" element={
                <>
                  <Navbar />
                  <div style={{ paddingBottom: '80px' }}>
                    <Routes>
                      <Route path="/" element={<Navigate to={hasOnboarded ? "/markets" : "/onboarding"} />} />
                      <Route path="/markets" element={<Markets />} />
                      <Route path="/stock/:symbol" element={<StockDetail />} />
                      <Route path="/watchlist" element={<Watchlist />} />
                      <Route path="/portfolio" element={<Portfolio />} />
                      <Route path="/calculators" element={<Calculators />} />
                      <Route path="/settings" element={<Settings />} />
                    </Routes>
                  </div>
                </>
              } />
            </Routes>
          </div>
        </BrowserRouter>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App