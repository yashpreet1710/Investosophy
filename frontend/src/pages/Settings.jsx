 
import { useTheme } from '../context/ThemeContext'
import { useUser } from '../context/UserContext'
import { Sun, Moon } from 'lucide-react'

const levels = [
  { key: 'beginner', label: 'Complete Beginner', emoji: '🌱' },
  { key: 'intermediate_beginner', label: 'Beginner', emoji: '📚' },
  { key: 'intermediate', label: 'Intermediate', emoji: '📊' },
  { key: 'experienced', label: 'Experienced', emoji: '🚀' },
]

export default function Settings() {
  const { theme, toggleTheme } = useTheme()
  const { userLevel, saveLevel } = useUser()

  const exportPortfolio = () => {
    const data = localStorage.getItem('portfolio') || '[]'
    const blob = new Blob([data], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = 'investiq-portfolio.json'
    a.click()
  }

  const importPortfolio = () => {
    const input = document.createElement('input')
    input.type = 'file'
    input.accept = '.json'
    input.onchange = (e) => {
      const file = e.target.files[0]
      const reader = new FileReader()
      reader.onload = (ev) => {
        try {
          const data = JSON.parse(ev.target.result)
          localStorage.setItem('portfolio', JSON.stringify(data))
          alert('Portfolio imported successfully!')
          window.location.reload()
        } catch {
          alert('Invalid file format!')
        }
      }
      reader.readAsText(file)
    }
    input.click()
  }

  const clearAllData = () => {
    if (window.confirm('Are you sure? This will delete all your data!')) {
      localStorage.clear()
      window.location.href = '/onboarding'
    }
  }

  return (
    <div style={{ padding: '16px', maxWidth: '600px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '24px' }}>⚙️ Settings</h1>

      {/* Theme */}
      <div style={{ backgroundColor: 'var(--card)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>🎨 Theme</h2>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ color: 'var(--muted)' }}>{theme === 'dark' ? '🌙 Dark Mode' : '☀️ Light Mode'}</span>
          <button onClick={toggleTheme} style={{
            backgroundColor: 'var(--bg)', border: '1px solid var(--muted)',
            borderRadius: '10px', padding: '10px 20px', cursor: 'pointer',
            color: 'var(--text)', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px',
          }}>
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            Switch to {theme === 'dark' ? 'Light' : 'Dark'}
          </button>
        </div>
      </div>

      {/* Experience Level */}
      <div style={{ backgroundColor: 'var(--card)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>🎯 Experience Level</h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {levels.map(level => (
            <button key={level.key} onClick={() => saveLevel(level.key)} style={{
              padding: '12px 16px', borderRadius: '10px', cursor: 'pointer',
              border: `1px solid ${userLevel === level.key ? 'var(--green)' : 'var(--muted)'}`,
              backgroundColor: userLevel === level.key ? 'rgba(0,208,132,0.1)' : 'var(--bg)',
              color: 'var(--text)', fontWeight: userLevel === level.key ? '700' : '400',
              display: 'flex', alignItems: 'center', gap: '12px', fontSize: '14px',
            }}>
              <span>{level.emoji}</span>
              <span>{level.label}</span>
              {userLevel === level.key && <span style={{ marginLeft: 'auto', color: 'var(--green)' }}>✓</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Portfolio */}
      <div style={{ backgroundColor: 'var(--card)', borderRadius: '12px', padding: '20px', marginBottom: '16px' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '16px' }}>💼 Portfolio Data</h2>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button onClick={exportPortfolio} style={{
            flex: 1, padding: '12px', backgroundColor: 'var(--bg)',
            border: '1px solid var(--green)', borderRadius: '10px',
            color: 'var(--green)', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
          }}>⬇️ Export JSON</button>
          <button onClick={importPortfolio} style={{
            flex: 1, padding: '12px', backgroundColor: 'var(--bg)',
            border: '1px solid var(--muted)', borderRadius: '10px',
            color: 'var(--text)', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
          }}>⬆️ Import JSON</button>
        </div>
      </div>

      {/* Danger Zone */}
      <div style={{ backgroundColor: 'var(--card)', borderRadius: '12px', padding: '20px', marginBottom: '16px', border: '1px solid var(--red)' }}>
        <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '8px', color: 'var(--red)' }}>⚠️ Danger Zone</h2>
        <p style={{ color: 'var(--muted)', fontSize: '13px', marginBottom: '16px' }}>This will delete all your data including portfolio and watchlist.</p>
        <button onClick={clearAllData} style={{
          width: '100%', padding: '12px', backgroundColor: 'rgba(255,71,87,0.1)',
          border: '1px solid var(--red)', borderRadius: '10px',
          color: 'var(--red)', fontWeight: '700', cursor: 'pointer', fontSize: '14px',
        }}>🗑️ Clear All Data</button>
      </div>

      {/* Disclaimer */}
      <div style={{ backgroundColor: 'var(--card)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
        <p style={{ color: 'var(--muted)', fontSize: '12px', lineHeight: '1.6' }}>
          ⚠️ <strong>Disclaimer:</strong> InvestIQ is for educational purposes only. We are not SEBI registered investment advisors. Please consult a financial advisor before making investment decisions.
        </p>
        <p style={{ color: 'var(--muted)', fontSize: '11px', marginTop: '8px' }}>
          InvestIQ v1.0.0 • Made with ❤️ in India 🇮🇳
        </p>
      </div>
    </div>
  )
}