 import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts'

const COLORS = ['#00D084', '#FF4757', '#FFB800', '#00B4D8', '#9B5DE5', '#F15BB5']

export default function PortfolioPieChart({ holdings }) {
  if (!holdings || holdings.length === 0) return null

  const data = holdings.map((h) => ({
    name: h.symbol.replace('.NS', '').replace('.BO', ''),
    value: h.units * h.buyPrice,
  }))

  return (
    <ResponsiveContainer width="100%" height={300}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={100}
          paddingAngle={4}
          dataKey="value"
        >
          {data.map((_, index) => (
            <Cell key={index} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip
          contentStyle={{
            backgroundColor: '#161B22',
            border: '1px solid #30363D',
            borderRadius: '8px',
            color: '#E6EDF3',
          }}
          formatter={(value) => [`₹${value.toLocaleString('en-IN')}`, 'Value']}
        />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  )
}
