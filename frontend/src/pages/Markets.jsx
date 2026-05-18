import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getTopMovers, getQuote, searchStocks } from '../api/stockApi'
import { useUser } from '../context/UserContext'
import MarketTickerBar from '../components/MarketTickerBar'
import StockCard from '../components/StockCard'
import LoadingSkeleton from '../components/LoadingSkeleton'

const learnContent = {
  beginner: [
    { title: '📦 What is a Stock?', content: 'A stock represents ownership in a company. When you buy a stock, you become a part-owner of that company and can benefit from its growth.' },
    { title: '💰 What is a Mutual Fund?', content: 'A mutual fund pools money from many investors to buy a diversified portfolio of stocks or bonds, managed by a professional fund manager.' },
    { title: '📅 What is SIP?', content: 'SIP (Systematic Investment Plan) lets you invest a fixed amount regularly (monthly) in mutual funds, helping you build wealth through rupee cost averaging.' },
    { title: '🏦 What is ETF?', content: 'An ETF (Exchange Traded Fund) is a basket of securities that trades on a stock exchange like a single stock. Nifty BeES is a popular ETF in India.' },
    { title: '📊 What is Nifty 50?', content: 'Nifty 50 is an index of the top 50 companies listed on NSE by market capitalization. It represents the Indian economy.' },
  ],
  intermediate_beginner: [
    { title: '📦 What is a Stock?', content: 'A stock represents ownership in a company. When you buy a stock, you become a part-owner of that company and can benefit from its growth.' },
    { title: '💰 What is a Mutual Fund?', content: 'A mutual fund pools money from many investors to buy a diversified portfolio of stocks or bonds, managed by a professional fund manager.' },
    { title: '📅 What is SIP?', content: 'SIP (Systematic Investment Plan) lets you invest a fixed amount regularly (monthly) in mutual funds, helping you build wealth through rupee cost averaging.' },
    { title: '🏦 What is ETF?', content: 'An ETF (Exchange Traded Fund) is a basket of securities that trades on a stock exchange like a single stock. Nifty BeES is a popular ETF in India.' },
    { title: '📈 What is Nifty 50?', content: 'Nifty 50 is an index of the top 50 companies listed on NSE by market capitalization. It represents the overall health of the Indian economy.' },
  ],
  intermediate: [
    { title: '📐 How to read P/E Ratio', content: 'P/E ratio = Price / Earnings per share. A high P/E means investors expect high growth. Compare P/E with industry peers for better context.' },
    { title: '🏢 Large vs Mid Cap', content: 'Large cap companies are stable and less risky. Mid cap companies offer higher growth potential but with more volatility.' },
    { title: '💸 Growth vs Dividend', content: 'Growth stocks reinvest profits for expansion. Dividend stocks pay regular income. Choose based on your investment goal.' },
  ],
  experienced: [
    { title: '📉 Technical Analysis Basics', content: 'Technical analysis uses price charts and indicators like RSI, MACD, and moving averages to predict future price movements.' },
    { title: '🌍 Diversification', content: 'Diversification spreads your investment across sectors, asset classes, and geographies to reduce risk.' },
    { title: '🌐 International Funds', content: 'International funds invest in foreign markets like US helping you benefit from global growth and hedge currency risk.' },
  ],
}

const recommendedPicks = {
  beginner: ['NIFTYBEES.NS', 'TCS.NS', 'HDFCBANK.NS'],
  intermediate_beginner: ['NIFTYBEES.NS', 'TCS.NS', 'HDFCBANK.NS'],
  intermediate: ['INFY.NS', 'BAJFINANCE.NS', 'AXISBANK.NS'],
  experienced: ['ADANIENT.NS', 'SUNPHARMA.NS', 'TITAN.NS'],
}

export default function Markets() {
  const { userLevel } = useUser()
  const navigate = useNavigate()
  const [movers, setMovers] = useState({ gainers: [], losers: [] })
  const [moversLoading, setMoversLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('gainers')
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [picks, setPicks] = useState([])
  const [picksLoading, setPicksLoading] = useState(true)
  const [selectedLearn, setSelectedLearn] = useState(null)

  useEffect(() => {
    getTopMovers()
      .then(r => { setMovers(r.data); setMoversLoading(false) })
      .catch(() => setMoversLoading(false))
  }, [])

  useEffect(() => {
    const level = userLevel || 'beginner'
    const symbols = recommendedPicks[level] || recommendedPicks.beginner
    Promise.all(symbols.map(s => getQuote(s)))
      .then(results => {
        setPicks(results.map(r => r.data).filter(d => d && !d.error))
        setPicksLoading(false)
      })
      .catch(() => setPicksLoading(false))
  }, [userLevel])

  useEffect(() => {
    if (!searchQuery.trim()) { setSearchResults([]); return }
    const timer = setTimeout(() => {
      searchStocks(searchQuery).then(r => setSearchResults(r.data)).catch(() => setSearchResults([]))
    }, 500)
    return () => clearTimeout(timer)
  }, [searchQuery])

  const learn = learnContent[userLevel] || learnContent.beginner

  const renderMovers = () => {
    const list = movers[activeTab] || []
    return list
      .filter(stock => stock && stock.symbol)
      .map((stock, i) => (
        <StockCard
          key={`${stock.symbol}-${i}`}
          symbol={stock.symbol}
          name={stock.symbol.replace('.NS', '').replace('.BO', '')}
          price={stock.price}
          change_pct={stock.change_pct}
        />
      ))
  }

  return (
    <div style={{ padding: '0 0 24px 0' }}>
      <MarketTickerBar />
      <div style={{ padding: '16px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* Search */}
        <div style={{ position: 'relative', marginBottom: '24px' }}>
          <input
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="🔍 Search stocks... (e.g. TCS, Reliance)"
            style={{
              width: '100%', padding: '12px 16px',
              backgroundColor: 'var(--card)', border: '1px solid var(--muted)',
              borderRadius: '12px', color: 'var(--text)', fontSize: '15px', outline: 'none',
            }}
          />
          {searchResults.length > 0 && (
            <div style={{
              position: 'absolute', top: '100%', left: 0, right: 0,
              backgroundColor: 'var(--card)', border: '1px solid var(--muted)',
              borderRadius: '12px', zIndex: 50, marginTop: '4px', overflow: 'hidden',
            }}>
              {searchResults.map((stock, i) => (
                <div key={`search-${stock.symbol}-${i}`}
                  onClick={() => { navigate(`/stock/${stock.symbol}`); setSearchQuery(''); setSearchResults([]) }}
                  style={{ padding: '12px 16px', cursor: 'pointer', borderBottom: '1px solid var(--muted)' }}
                  onMouseEnter={e => e.currentTarget.style.backgroundColor = 'var(--bg)'}
                  onMouseLeave={e => e.currentTarget.style.backgroundColor = 'transparent'}
                >
                  <span style={{ fontWeight: '600' }}>{stock.symbol}</span>
                  <span style={{ color: 'var(--muted)', marginLeft: '8px', fontSize: '13px' }}>{stock.name}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Movers */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>🔥 Top Movers</h2>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
            {['gainers', 'losers'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} style={{
                padding: '8px 20px', borderRadius: '20px', border: 'none', cursor: 'pointer',
                backgroundColor: activeTab === tab ? 'var(--green)' : 'var(--card)',
                color: activeTab === tab ? '#000' : 'var(--text)',
                fontWeight: '600', fontSize: '13px',
              }}>
                {tab === 'gainers' ? '📈 Gainers' : '📉 Losers'}
              </button>
            ))}
          </div>
          {moversLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {[1,2,3,4,5].map(i => <LoadingSkeleton key={i} height="100px" />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {renderMovers()}
            </div>
          )}
        </div>

        {/* Learn Section */}
        <div style={{ marginBottom: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>🎓 Learn</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
            {learn.map((item, i) => (
              <div key={`learn-${i}`} onClick={() => setSelectedLearn(item)} style={{
                backgroundColor: 'var(--card)', borderRadius: '12px', padding: '16px',
                cursor: 'pointer', border: '1px solid var(--muted)',
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--green)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--muted)'}
              >
                <div style={{ fontWeight: '600', fontSize: '14px' }}>{item.title}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Learn Modal */}
        {selectedLearn && (
          <div onClick={() => setSelectedLearn(null)} style={{
            position: 'fixed', inset: 0, backgroundColor: 'rgba(0,0,0,0.7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200, padding: '24px',
          }}>
            <div onClick={e => e.stopPropagation()} style={{
              backgroundColor: 'var(--card)', borderRadius: '16px', padding: '24px', maxWidth: '480px', width: '100%',
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', marginBottom: '12px' }}>{selectedLearn.title}</h3>
              <p style={{ color: 'var(--muted)', lineHeight: '1.7' }}>{selectedLearn.content}</p>
              <button onClick={() => setSelectedLearn(null)} style={{
                marginTop: '20px', padding: '10px 24px', backgroundColor: 'var(--green)',
                color: '#000', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '600',
              }}>Got it!</button>
            </div>
          </div>
        )}

        {/* Recommended Picks */}
        <div>
          <h2 style={{ fontSize: '18px', fontWeight: '700', marginBottom: '12px' }}>⭐ Recommended for You</h2>
          {picksLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {[1,2,3].map(i => <LoadingSkeleton key={i} height="100px" />)}
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
              {picks.map((stock, i) => (
                <StockCard
                  key={`pick-${stock.symbol || i}`}
                  symbol={stock.symbol}
                  name={stock.name}
                  price={stock.price}
                  change_pct={stock.change_pct}
                />
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}