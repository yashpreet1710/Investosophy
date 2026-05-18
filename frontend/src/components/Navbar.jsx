 import { Link, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext'
import { TrendingUp, BarChart2, Briefcase, Calculator, Settings, Sun, Moon } from 'lucide-react'

const navLinks = [
  { path: '/markets', label: 'Markets', icon: TrendingUp },
  { path: '/watchlist', label: 'Watchlist', icon: BarChart2 },
  { path: '/portfolio', label: 'Portfolio', icon: Briefcase },
  { path: '/calculators', label: 'Calculators', icon: Calculator },
  { path: '/settings', label: 'Settings', icon: Settings },
]

export default function Navbar() {
  const { theme, toggleTheme } = useTheme()
  const location = useLocation()

  return (
    <>
      {/* Desktop Top Navbar */}
      <nav style={{
        backgroundColor: 'var(--card)',
        borderBottom: '1px solid var(--muted)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }} className="hidden md:flex">
        <Link to="/markets" style={{ fontSize: '20px', fontWeight: 'bold', color: 'var(--green)', textDecoration: 'none' }}>
          Investosophy 📈
        </Link>
        <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
          {navLinks.map(({ path, label }) => (
            <Link key={path} to={path} style={{
              color: location.pathname === path ? 'var(--green)' : 'var(--text)',
              textDecoration: 'none',
              fontWeight: location.pathname === path ? '600' : '400',
            }}>
              {label}
            </Link>
          ))}
          <button onClick={toggleTheme} style={{
            background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text)'
          }}>
            {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
      </nav>

      {/* Mobile Bottom Navbar */}
      <nav style={{
        backgroundColor: 'var(--card)',
        borderTop: '1px solid var(--muted)',
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-around',
        padding: '8px 0',
      }} className="md:hidden">
        {navLinks.map(({ path, label, icon: Icon }) => (
          <Link key={path} to={path} style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '2px',
            textDecoration: 'none',
            color: location.pathname === path ? 'var(--green)' : 'var(--muted)',
            fontSize: '10px',
          }}>
            <Icon size={20} />
            {label}
          </Link>
        ))}
      </nav>
    </>
  )
}
