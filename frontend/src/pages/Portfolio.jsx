 
import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { getQuote, searchStocks } from '../api/stockApi'
import PortfolioPieChart from '../components/PortfolioPieChart'
import LoadingSkeleton from '../components/LoadingSkeleton'

export default function Portfolio() {
  const [holdings, setHoldings] = useState([])
  const [quotes, setQuotes] = useState({})
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [searchParams] = useSearchParams()
  const [form, setForm] = useState({ symbol: '', name: '', type: 'Stock', units: '', buyPrice: '', buyDate: '' })
  const [searchQ, setSearchQ] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const navigate = useNavigate()

  const loadHoldings = () => {
    const h = JSON.parse(localStorage.getItem('portfolio') || '[]')
    setHoldings(h)
    return h
  }

  const fetchQuotes = async (h) => {
    if (h.length === 0) { setLoading(false); return }
    try {
      const results = await Promise.all(h.map(holding => getQuote(holding.symbol)))
      const q = {}
      results.forEach(r => { q[r.data.symbol] = r.data })
      setQuotes(q)
    } catch {}
    setLoading(false)
  }

  useEffect(() => {
    const h = loadHoldings()
    fetchQuotes(h)
    const addSymbol = searchParams.get('add')
    if (addSymbol) {
      setForm(f => ({ ...f, symbol: addSymbol }))
      setShowModal(true)
    }
  }, [])

  useEffect(() => {
    if (!searchQ.trim()) { setSearchResults([]); return }
    const timer = setTimeout(() => {
      searchStocks(searchQ).then(r => setSearchResults(r.data)).catch(() => {})
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQ])

  const saveHolding = () => {
    if (!form.symbol || !form.units || !form.buyPrice) return alert('Please fill all fields!')
    const h = JSON.parse(localStorage.getItem('portfolio') || '[]')
    const newHolding = {
      id: Date.now(),
      symbol: form.symbol,
      name: form.name || form.symbol,
      type: form.type,
      units: parseFloat(form.units),
      buyPrice: parseFloat(form.buyPrice),
      buyDate: form.buyDate || new Date().toISOString().split('T')[0],
    }
    const updated = [...h, newHolding]
    localStorage.setItem('portfolio', JSON.stringify(updated))
    setHoldings(updated)
    fetchQuotes(updated)
    setShowModal(false)
    setForm({ symbol: '', name: '', type: 'Stock', units: '', buyPrice: '', buyDate: '' })
    setSearchQ('')
  }

  const removeHolding = (id) => {
    const updated = holdings.filter(h => h.id !== id)
    localStorage.setItem('portfolio', JSON.stringify(updated))
    setHoldings(updated)
  }

  const fmt = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 2 }).format(n)

  const totalInvested = holdings.reduce((sum, h) => sum + h.units * h.buyPrice, 0)
  const currentValue = holdings.reduce((sum, h) => sum + h.units * (quotes[h.symbol]?.price || h.buyPrice), 0)
  const pnl = currentValue - totalInvested
  const pnlPct = totalInvested > 0 ? (pnl / totalInvested) * 100 : 0

  const holdingDays = (buyDate) => {
    const days = Math.floor((new Date() - new Date(buyDate)) / (1000 * 60 * 60 * 24))
    return days < 30 ? `${days}d` : days < 365 ? `${Math.floor(days/30)}mo` : `${(days/365).toFixed(1)}y`
  }

  return (
    <div style={{ padding: '16px', maxWidth: '900px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1 style={{ fontSize: '22px', fontWeight: '700' }}>💼 Portfolio</h1>
        <button onClick={() => setShowModal(true)} style={{
          backgroundColor: 'var(--green)', color: '#000',
          border: 'none', borderRadius: '10px',
          padding: '10px 20px', fontWeight: '700', cursor: 'pointer',
        }}>+ Add Holding</button>
      </div>

      {/* Summary Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: '12px', marginBottom: '24px' }}>
        {[
          { label: 'Total Invested', value: `₹${fmt(totalInvested)}`, color: 'var(--text)' },
          { label: 'Current Value', value: `₹${fmt(currentValue)}`, color: 'var(--text)' },
          { label: 'P&L', value: `${pnl >= 0 ? '+' : ''}₹${fmt(pnl)}`, color: pnl >= 0 ? 'var(--green)' : 'var(--red)' },
          { label: 'Return', value: `${pnlPct >= 0 ? '+' : ''}${pnlPct.toFixed(2)}%`, color: pnlPct >= 0 ? 'var(--green)' : 'var(--red)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ backgroundColor: 'var(--card)', borderRadius: '12px', padding: '16px' }}>
            <div style={{ color: 'var(--muted)', fontSize: '12px' }}>{label}</div>
            <div style={{ color, fontWeight: '700', fontSize: '18px', marginTop: '4px' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Pie Chart */}
      {holdings.length > 0 && (
        <div style={{ backgroundColor: 'var(--card)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: '700', marginBottom: '12px' }}>Allocation</h2>
          <PortfolioPieChart holdings={holdings} />
        </div>
      )}

      {/* Holdings List */}
      {holdings.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 24px', color: 'var(--muted)' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>💼</div>
          <p style={{ fontSize: '16px', marginBottom: '8px' }}>No holdings yet</p>
          <p style={{ fontSize: '13px' }}>Click "+ Add Holding" to start tracking</p>
        </div>
      ) : loading ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {holdings.map(h => <LoadingSkeleton key={h.id} height="80px" />)}
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {holdings.map(h => {
            const livePrice = quotes[h.symbol]?.price || h.buyPrice
            const invested = h.units * h.buyPrice
            const current = h.units * livePrice
            const gain = current - invested
            const gainPct = (gain / invested) * 100
            return (
              <div key={h.id} style={{
                backgroundColor: 'var(--card)', borderRadius: '12px',
                padding: '16px', border: '1px solid var(--muted)',
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div onClick={() => navigate(`/stock/${h.symbol}`)} style={{ cursor: 'pointer' }}>
                    <div style={{ fontWeight: '700', fontSize: '15px' }}>{h.symbol.replace('.NS','').replace('.BO','')}</div>
                    <div style={{ color: 'var(--muted)', fontSize: '12px' }}>{h.name} • {h.type} • {holdingDays(h.buyDate)}</div>
                  </div>
                  <button onClick={() => removeHolding(h.id)} style={{
                    background: 'none', border: 'none', color: 'var(--muted)',
                    cursor: 'pointer', fontSize: '18px',
                  }}>×</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginTop: '12px' }}>
                  <div>
                    <div style={{ color: 'var(--muted)', fontSize: '11px' }}>Units</div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>{h.units}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--muted)', fontSize: '11px' }}>Avg Buy</div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>₹{fmt(h.buyPrice)}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--muted)', fontSize: '11px' }}>Live Price</div>
                    <div style={{ fontWeight: '600', fontSize: '14px' }}>₹{fmt(livePrice)}</div>
                  </div>
                  <div>
                    <div style={{ color: 'var(--muted)', fontSize: '11px' }}>P&L</div>
                    <div style={{ fontWeight: '600', fontSize: '14px', color: gain >= 0 ? 'var(--green)' : 'var(--red)' }}>
                      {gain >= 0 ? '+' : ''}₹{fmt(gain)} ({gainPct.toFixed(2)}%)
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* Add Holding Modal */}
      {showModal && (
        <div onClick={() => setShowModal(false)} style={{
          position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
          display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '24px',
        }}>
          <div onClick={e => e.stopPropagation()} style={{
            backgroundColor: 'var(--card)', borderRadius: '16px', padding: '24px',
            maxWidth: '440px', width: '100%',
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '16px' }}>Add Holding</h3>

            {/* Stock Search */}
            <div style={{ position: 'relative', marginBottom: '12px' }}>
              <input
                placeholder="Search stock..."
                value={searchQ}
                onChange={e => setSearchQ(e.target.value)}
                style={{
                  width: '100%', padding: '10px 12px',
                  backgroundColor: 'var(--bg)', border: '1px solid var(--muted)',
                  borderRadius: '8px', color: 'var(--text)', fontSize: '14px', outline: 'none',
                }}
              />
              {searchResults.length > 0 && (
                <div style={{
                  position: 'absolute', top: '100%', left: 0, right: 0,
                  backgroundColor: 'var(--card)', border: '1px solid var(--muted)',
                  borderRadius: '8px', zIndex: 10, marginTop: '4px',
                }}>
                  {searchResults.map(s => (
                    <div key={s.symbol} onClick={() => {
                      setForm(f => ({ ...f, symbol: s.symbol, name: s.name }))
                      setSearchQ(s.name)
                      setSearchResults([])
                    }} style={{ padding: '10px 12px', cursor: 'pointer', fontSize: '13px' }}
                      onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg)'}
                      onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                    >
                      <span style={{ fontWeight: '600' }}>{s.symbol}</span>
                      <span style={{ color: 'var(--muted)', marginLeft: '8px' }}>{s.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {form.symbol && <div style={{ color: 'var(--green)', fontSize: '13px', marginBottom: '12px' }}>Selected: {form.symbol}</div>}

            {[
              { label: 'Type', key: 'type', type: 'select', options: ['Stock', 'ETF', 'Mutual Fund'] },
              { label: 'Units', key: 'units', type: 'number', placeholder: 'e.g. 10' },
              { label: 'Buy Price (₹)', key: 'buyPrice', type: 'number', placeholder: 'e.g. 3500' },
              { label: 'Buy Date', key: 'buyDate', type: 'date' },
            ].map(({ label, key, type, placeholder, options }) => (
              <div key={key} style={{ marginBottom: '12px' }}>
                <label style={{ fontSize: '13px', color: 'var(--muted)', display: 'block', marginBottom: '4px' }}>{label}</label>
                {type === 'select' ? (
                  <select value={form[key]} onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))} style={{
                    width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg)',
                    border: '1px solid var(--muted)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px',
                  }}>
                    {options.map(o => <option key={o}>{o}</option>)}
                  </select>
                ) : (
                  <input type={type} placeholder={placeholder} value={form[key]}
                    onChange={e => setForm(f => ({ ...f, [key]: e.target.value }))}
                    style={{
                      width: '100%', padding: '10px 12px', backgroundColor: 'var(--bg)',
                      border: '1px solid var(--muted)', borderRadius: '8px', color: 'var(--text)', fontSize: '14px', outline: 'none',
                    }}
                  />
                )}
              </div>
            ))}

            <div style={{ display: 'flex', gap: '12px', marginTop: '16px' }}>
              <button onClick={() => setShowModal(false)} style={{
                flex: 1, padding: '12px', backgroundColor: 'var(--bg)',
                border: '1px solid var(--muted)', borderRadius: '10px',
                color: 'var(--text)', cursor: 'pointer', fontWeight: '600',
              }}>Cancel</button>
              <button onClick={saveHolding} style={{
                flex: 1, padding: '12px', backgroundColor: 'var(--green)',
                border: 'none', borderRadius: '10px',
                color: '#000', cursor: 'pointer', fontWeight: '700',
              }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}