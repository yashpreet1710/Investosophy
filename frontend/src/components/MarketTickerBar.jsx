 import { useEffect, useState } from 'react'
import { getMarketOverview } from '../api/stockApi'

function isMarketOpen() {
  const now = new Date()
  const ist = new Date(now.toLocaleString('en-US', { timeZone: 'Asia/Kolkata' }))
  const hours = ist.getHours()
  const minutes = ist.getMinutes()
  const day = ist.getDay()
  if (day === 0 || day === 6) return false
  const start = hours * 60 + minutes >= 9 * 60 + 15
  const end = hours * 60 + minutes <= 15 * 60 + 30
  return start && end
}

export default function MarketTickerBar() {
  const [data, setData] = useState([])
  const [loading, setLoading] = useState(true)
  const marketOpen = isMarketOpen()

  const fetchData = async () => {
    try {
      const res = await getMarketOverview()
      setData(res.data)
    } catch {
      setData([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
    const interval = setInterval(fetchData, 60000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div style={{
      backgroundColor: 'var(--card)',
      padding: '10px 16px',
      display: 'flex',
      gap: '24px',
      alignItems: 'center',
      flexWrap: 'wrap',
      borderBottom: '1px solid var(--muted)',
    }}>
      {!marketOpen && (
        <span style={{ color: 'var(--red)', fontSize: '13px', fontWeight: '600' }}>
          🔴 Market Closed
        </span>
      )}
      {loading ? (
        <span style={{ color: 'var(--muted)', fontSize: '13px' }}>Loading...</span>
      ) : (
        data.map((item) => (
          <div key={item.symbol} style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <span style={{ fontWeight: '600', fontSize: '13px' }}>{item.name}</span>
            <span style={{ fontSize: '13px' }}>
              {item.price.toLocaleString('en-IN')}
            </span>
            <span style={{
              fontSize: '12px',
              color: item.change_pct >= 0 ? 'var(--green)' : 'var(--red)',
              fontWeight: '600',
            }}>
              {item.change_pct >= 0 ? '▲' : '▼'} {Math.abs(item.change_pct)}%
            </span>
          </div>
        ))
      )}
    </div>
  )
}
