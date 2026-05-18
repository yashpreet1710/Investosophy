 import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'

export default function StockChart({ data }) {
  if (!data || data.length === 0) return (
    <div style={{ color: 'var(--muted)', textAlign: 'center', padding: '40px' }}>
      No chart data available
    </div>
  )

  const isPositive = data[data.length - 1]?.close >= data[0]?.close
  const color = isPositive ? '#00D084' : '#FF4757'

  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data}>
        <defs>
          <linearGradient id="colorClose" x1="0" y1="0" x2="0" y2="1">
            <stop offset="5%" stopColor={color} stopOpacity={0.3} />
            <stop offset="95%" stopColor={color} stopOpacity={0} />
          </linearGradient>
        </defs>
        <XAxis
          dataKey="date"
          tick={{ fill: '#8B949E', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          interval="preserveStartEnd"
        />
        <YAxis
          tick={{ fill: '#8B949E', fontSize: 11 }}
          tickLine={false}
          axisLine={false}
          domain={['auto', 'auto']}
          tickFormatter={(v) => `₹${v.toLocaleString('en-IN')}`}
        />
        <Tooltip
          contentStyle={{
            backgroundColor: '#161B22',
            border: '1px solid #30363D',
            borderRadius: '8px',
            color: '#E6EDF3',
          }}
          formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Price']}
        />
        <Area
          type="monotone"
          dataKey="close"
          stroke={color}
          strokeWidth={2}
          fill="url(#colorClose)"
        />
      </AreaChart>
    </ResponsiveContainer>
  )
}
