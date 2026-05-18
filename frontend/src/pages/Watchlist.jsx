 import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getQuote } from '../api/stockApi'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function Watchlist() {
  const [watchlist, setWatchlist] = useState([])
  const [quotes, setQuotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [sortBy, setSortBy] = useState('default')
  const navigate = useNavigate()

  const loadWatchlist = () => {
    const wl = JSON.parse(localStorage.getItem('watchlist') || '[]')
    setWatchlist(wl)
    return wl
  }

  const fetchQuotes = async (symbols) => {
    if (symbols.length === 0) { setLoading(false); return }
    try {
      const results = await Promise.all(symbols.map(s => getQuote(s)))
      const q = {}
      results.forEach(r => { q[r.data.symbol] = r.data })
      setQuotes(q)
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    const wl = loadWatchlist()
    fetchQuotes(wl)
    const interval = setInterval(() => fetchQuotes(wl), 60000)
    return () => clearInterval(interval)
  }, [])

  const removeFromWatchlist = (symbol) => {
    const wl = JSON.parse(localStorage.getItem('watchlist') || '[]')
    const updated = wl.filter(s => s !== symbol)
    localStorage.setItem('watchlist', JSON.stringify(updated))
    setWatchlist(updated)
  }

  const getSorted = () => {
    const list = [...watchlist]
    if (sortBy === 'change') return list.sort((a, b) => (quotes[b]?.change_pct || 0) - (quotes[a]?.change_pct || 0))
    if (sortBy === 'alpha') return list.sort()
    return list
  }

  return (
    <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>⭐ Watchlist</h1>
        <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
          backgroundColor: 'var(--card)', color: 'var(--text)',
          border: '1px solid var(--muted)', borderRadius: '8px',
          padding: '6px 12px', fontSize: '13px', cursor: 'pointer',
        }}>
          <option value="default">Date Added</option>
          <option value="change">By Change%</option>
          <option value="alpha">Alphabetical</option>
        </select>
      </div>

      {watchlist.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>Your watchlist is empty</p>
          <p style={{ fontSize: '13px' }}>Go to a stock page and click "Add to Watchlist"</p>
          <button onClick={() => navigate('/markets')} style={{
            marginTop: '20px', padding: '10px 24px',
            backgroundColor: 'var(--green)', color: '#000',
            border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
          }}>Browse Markets</button>
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {watchlist.map(s => <LoadingSkeleton key={s} height="80px" />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {getSorted().map(symbol => {
            const q = quotes[symbol]
            const isPositive = (q?.change_pct || 0) >= 0
            return (
              <div key={symbol} style={{
                backgroundColor: 'var(--card)', borderRadius: '12px',
                padding: '16px', border: '1px solid var(--muted)',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
              }}>
                <div onClick={() => navigate(`/stock/${symbol}`)} style={{ cursor: 'pointer', flex: 1 }}>
                  <div style={{ fontWeight: '700', fontSize: '15px' }}>{symbol.replace('.NS', '').replace('.BO', '')}</div>
                  <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '2px' }}>{q?.name || symbol}</div>
                </div>
                <div style={{ textAlign: 'right', marginRight: '16px' }}>
                  <div style={{ fontWeight: '700', fontSize: '16px' }}>₹{q?.price?.toLocaleString('en-IN')}</div>
                  <div style={{ fontSize: '13px', color: isPositive ? 'var(--green)' : 'var(--red)', fontWeight: '600' }}>
                    {isPositive ? '▲' : '▼'} {Math.abs(q?.change_pct || 0)}%
                  </div>
                </div>
                <button onClick={() => removeFromWatchlist(symbol)} style={{
                  background: 'none', border: '1px solid var(--red)',
                  color: 'var(--red)', borderRadius: '8px',
                  padding: '6px 12px', cursor: 'pointer', fontSize: '12px',
                }}>Remove</button>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
