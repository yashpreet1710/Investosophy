 
import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { getQuote, getHistory, getNews } from '../api/stockApi'
import StockChart from '../components/StockChart'
import LoadingSkeleton from '../components/LoadingSkeleton'

const periods = ['1d', '1wk', '1mo', '3mo', '1y', '5y']
const periodLabels = { '1d': '1D', '1wk': '1W', '1mo': '1M', '3mo': '3M', '1y': '1Y', '5y': '5Y' }

export default function StockDetail() {
  const { symbol } = useParams()
  const navigate = useNavigate()
  const [quote, setQuote] = useState(null)
  const [history, setHistory] = useState([])
  const [news, setNews] = useState([])
  const [period, setPeriod] = useState('1mo')
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState('')

  const fetchQuote = async () => {
    try {
      const res = await getQuote(symbol)
      setQuote(res.data)
      setLastUpdated(new Date().toLocaleTimeString('en-IN'))
    } catch {}
  }

  useEffect(() => {
    setLoading(true)
    Promise.all([
      getQuote(symbol),
      getHistory(symbol, period),
      getNews(symbol),
    ]).then(([q, h, n]) => {
      setQuote(q.data)
      setHistory(h.data)
      setNews(n.data)
      setLastUpdated(new Date().toLocaleTimeString('en-IN'))
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [symbol, period])

  useEffect(() => {
    const interval = setInterval(fetchQuote, 60000)
    return () => clearInterval(interval)
  }, [symbol])

  const addToWatchlist = () => {
    const wl = JSON.parse(localStorage.getItem('watchlist') || '[]')
    if (!wl.includes(symbol)) {
      localStorage.setItem('watchlist', JSON.stringify([...wl, symbol]))
      alert(`${symbol} added to watchlist!`)
    } else {
      alert('Already in watchlist!')
    }
  }

  const addToPortfolio = () => {
    navigate(`/portfolio?add=${symbol}`)
  }

  if (loading) return (
    <div style={{ padding: '24px', maxWidth: '800px', margin: '0 auto' }}>
      <LoadingSkeleton height="40px" width="200px" />
      <div style={{ marginTop: '16px' }}><LoadingSkeleton height="300px" /></div>
    </div>
  )

  if (!quote || quote.error) return (
    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--muted)' }}>
      Could not load stock data. <button onClick={() => navigate(-1)} style={{ color: 'var(--green)', background: 'none', border: 'none', cursor: 'pointer' }}>Go back</button>
    </div>
  )

  const isPositive = quote.change >= 0

  return (
    <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
      {/* Header */}
      <button onClick={() => navigate(-1)} style={{ background: 'none', border: 'none', color: 'var(--muted)', cursor: 'pointer', marginBottom: '16px', fontSize: '14px' }}>
        ← Back
      </button>

      <div style={{ marginBottom: '24px' }}>
        <h1 style={{ fontSize: '24px', fontWeight: '700' }}>{quote.name}</h1>
        <div style={{ color: 'var(--muted)', fontSize: '13px' }}>{symbol} • Last updated: {lastUpdated}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '8px' }}>
          <span style={{ fontSize: '36px', fontWeight: '700' }}>₹{quote.price?.toLocaleString('en-IN')}</span>
          <span style={{
            fontSize: '16px', fontWeight: '600',
            color: isPositive ? 'var(--green)' : 'var(--red)',
          }}>
            {isPositive ? '▲' : '▼'} ₹{Math.abs(quote.change)} ({Math.abs(quote.change_pct)}%)
          </span>
        </div>
      </div>

      {/* Period Selector */}
      <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
        {periods.map(p => (
          <button key={p} onClick={() => setPeriod(p)} style={{
            padding: '6px 14px',
            borderRadius: '20px',
            border: 'none',
            cursor: 'pointer',
            backgroundColor: period === p ? 'var(--green)' : 'var(--card)',
            color: period === p ? '#000' : 'var(--text)',
            fontWeight: '600',
            fontSize: '13px',
          }}>
            {periodLabels[p]}
          </button>
        ))}
      </div>

      {/* Chart */}
      <div style={{ backgroundColor: 'var(--card)', borderRadius: '12px', padding: '16px', marginBottom: '24px' }}>
        <StockChart data={history} />
      </div>

      {/* Stats */}
      <div style={{
        backgroundColor: 'var(--card)', borderRadius: '12px', padding: '16px', marginBottom: '24px',
        display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '16px',
      }}>
        {[
          { label: 'Day High', value: `₹${quote.high?.toLocaleString('en-IN')}` },
          { label: 'Day Low', value: `₹${quote.low?.toLocaleString('en-IN')}` },
          { label: '52W High', value: `₹${quote.week52_high?.toLocaleString('en-IN')}` },
          { label: '52W Low', value: `₹${quote.week52_low?.toLocaleString('en-IN')}` },
          { label: 'Volume', value: quote.volume?.toLocaleString('en-IN') },
          { label: 'Market Cap', value: quote.market_cap ? `₹${(quote.market_cap / 1e9).toFixed(2)}B` : 'N/A' },
          { label: 'P/E Ratio', value: quote.pe_ratio?.toFixed(2) || 'N/A' },
          { label: 'EPS', value: quote.eps ? `₹${quote.eps}` : 'N/A' },
          { label: 'Dividend Yield', value: quote.dividend_yield ? `${(quote.dividend_yield * 100).toFixed(2)}%` : 'N/A' },
        ].map(({ label, value }) => (
          <div key={label}>
            <div style={{ color: 'var(--muted)', fontSize: '12px' }}>{label}</div>
            <div style={{ fontWeight: '600', fontSize: '15px', marginTop: '2px' }}>{value}</div>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
        <button onClick={addToWatchlist} style={{
          flex: 1, padding: '12px', backgroundColor: 'var(--card)',
          border: '1px solid var(--green)', borderRadius: '12px',
          color: 'var(--green)', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
        }}>★ Add to Watchlist</button>
        <button onClick={addToPortfolio} style={{
          flex: 1, padding: '12px', backgroundColor: 'var(--green)',
          border: 'none', borderRadius: '12px',
          color: '#000', fontWeight: '600', cursor: 'pointer', fontSize: '14px',
        }}>+ Add to Portfolio</button>
      </div>

      {/* News */}
      {news.length > 0 && (
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>📰 Latest News</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {news.map((item, i) => (
              <a key={i} href={item.url} target="_blank" rel="noreferrer" style={{
                backgroundColor: 'var(--card)', borderRadius: '12px', padding: '16px',
                textDecoration: 'none', color: 'var(--text)', border: '1px solid var(--muted)',
                display: 'block',
              }}>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>{item.title}</div>
                <div style={{ color: 'var(--muted)', fontSize: '12px' }}>{item.publisher}</div>
              </a>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}