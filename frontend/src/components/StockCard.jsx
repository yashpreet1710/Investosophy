import { useNavigate } from 'react-router-dom'

export default function StockCard({ symbol, name, price, change_pct }) {
  const navigate = useNavigate()
  const isPositive = (change_pct || 0) >= 0

  if (!symbol) return null

  return (
    <div onClick={() => navigate(`/stock/${symbol}`)} style={{
      backgroundColor: 'var(--card)',
      borderRadius: '12px',
      padding: '16px',
      cursor: 'pointer',
      border: '1px solid var(--muted)',
      transition: 'transform 0.2s',
    }}
      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div style={{ fontWeight: '700', fontSize: '14px' }}>
            {symbol.replace('.NS', '').replace('.BO', '')}
          </div>
          <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '2px' }}>{name || symbol}</div>
        </div>
        <div style={{
          backgroundColor: isPositive ? 'rgba(0,208,132,0.15)' : 'rgba(255,71,87,0.15)',
          color: isPositive ? 'var(--green)' : 'var(--red)',
          padding: '4px 8px',
          borderRadius: '6px',
          fontSize: '12px',
          fontWeight: '600',
        }}>
          {isPositive ? '▲' : '▼'} {Math.abs(change_pct || 0)}%
        </div>
      </div>
      <div style={{ marginTop: '12px', fontSize: '20px', fontWeight: '700' }}>
        ₹{price?.toLocaleString('en-IN') || '...'}
      </div>
    </div>
  )
}