 
import { useState } from 'react'
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, LineChart, Line, Legend } from 'recharts'

function SIPCalculator() {
  const [amount, setAmount] = useState(5000)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(10)

  const months = years * 12
  const r = rate / 100 / 12
  const maturity = amount * ((Math.pow(1 + r, months) - 1) / r) * (1 + r)
  const invested = amount * months

  const data = Array.from({ length: years }, (_, i) => {
    const m = (i + 1) * 12
    const val = amount * ((Math.pow(1 + r, m) - 1) / r) * (1 + r)
    return { year: `Year ${i + 1}`, value: Math.round(val), invested: amount * m }
  })

  const fmt = (n) => new Intl.NumberFormat('en-IN').format(Math.round(n))

  return (
    <div>
      {[
        { label: `Monthly SIP: ₹${fmt(amount)}`, value: amount, setter: setAmount, min: 500, max: 100000, step: 500 },
        { label: `Expected Return: ${rate}% p.a.`, value: rate, setter: setRate, min: 1, max: 30, step: 0.5 },
        { label: `Duration: ${years} years`, value: years, setter: setYears, min: 1, max: 40, step: 1 },
      ].map(({ label, value, setter, min, max, step }) => (
        <div key={label} style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>{label}</div>
          <input type="range" min={min} max={max} step={step} value={value}
            onChange={e => setter(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--green)' }} />
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Invested', value: `₹${fmt(invested)}` },
          { label: 'Returns', value: `₹${fmt(maturity - invested)}`, color: 'var(--green)' },
          { label: 'Maturity', value: `₹${fmt(maturity)}`, color: 'var(--green)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{label}</div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: color || 'var(--text)', marginTop: '4px' }}>{value}</div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <XAxis dataKey="year" tick={{ fill: '#8B949E', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#8B949E', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
          <Tooltip formatter={v => `₹${new Intl.NumberFormat('en-IN').format(v)}`} contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: '8px', color: '#E6EDF3' }} />
          <Area type="monotone" dataKey="value" stroke="#00D084" fill="rgba(0,208,132,0.2)" name="Maturity Value" />
          <Area type="monotone" dataKey="invested" stroke="#8B949E" fill="rgba(139,148,158,0.1)" name="Invested" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function LumpsumCalculator() {
  const [amount, setAmount] = useState(100000)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(10)

  const maturity = amount * Math.pow(1 + rate / 100, years)
  const fmt = (n) => new Intl.NumberFormat('en-IN').format(Math.round(n))

  const data = Array.from({ length: years }, (_, i) => ({
    year: `Year ${i + 1}`,
    value: Math.round(amount * Math.pow(1 + rate / 100, i + 1)),
  }))

  return (
    <div>
      {[
        { label: `Investment: ₹${fmt(amount)}`, value: amount, setter: setAmount, min: 10000, max: 10000000, step: 10000 },
        { label: `Expected Return: ${rate}% p.a.`, value: rate, setter: setRate, min: 1, max: 30, step: 0.5 },
        { label: `Duration: ${years} years`, value: years, setter: setYears, min: 1, max: 40, step: 1 },
      ].map(({ label, value, setter, min, max, step }) => (
        <div key={label} style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>{label}</div>
          <input type="range" min={min} max={max} step={step} value={value}
            onChange={e => setter(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--green)' }} />
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        {[
          { label: 'Invested', value: `₹${fmt(amount)}` },
          { label: 'Returns', value: `₹${fmt(maturity - amount)}`, color: 'var(--green)' },
          { label: 'Maturity', value: `₹${fmt(maturity)}`, color: 'var(--green)' },
        ].map(({ label, value, color }) => (
          <div key={label} style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
            <div style={{ fontSize: '11px', color: 'var(--muted)' }}>{label}</div>
            <div style={{ fontWeight: '700', fontSize: '14px', color: color || 'var(--text)', marginTop: '4px' }}>{value}</div>
          </div>
        ))}
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data}>
          <XAxis dataKey="year" tick={{ fill: '#8B949E', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#8B949E', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
          <Tooltip formatter={v => `₹${new Intl.NumberFormat('en-IN').format(v)}`} contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: '8px', color: '#E6EDF3' }} />
          <Area type="monotone" dataKey="value" stroke="#00D084" fill="rgba(0,208,132,0.2)" name="Maturity Value" />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  )
}

function GoalPlanner() {
  const [goal, setGoal] = useState(1000000)
  const [rate, setRate] = useState(12)
  const [years, setYears] = useState(10)

  const months = years * 12
  const r = rate / 100 / 12
  const requiredSIP = goal * r / ((Math.pow(1 + r, months) - 1) * (1 + r))
  const fmt = (n) => new Intl.NumberFormat('en-IN').format(Math.round(n))

  return (
    <div>
      {[
        { label: `Target Amount: ₹${fmt(goal)}`, value: goal, setter: setGoal, min: 100000, max: 50000000, step: 100000 },
        { label: `Expected Return: ${rate}% p.a.`, value: rate, setter: setRate, min: 1, max: 30, step: 0.5 },
        { label: `Duration: ${years} years`, value: years, setter: setYears, min: 1, max: 40, step: 1 },
      ].map(({ label, value, setter, min, max, step }) => (
        <div key={label} style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>{label}</div>
          <input type="range" min={min} max={max} step={step} value={value}
            onChange={e => setter(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--green)' }} />
        </div>
      ))}
      <div style={{ backgroundColor: 'var(--bg)', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
        <div style={{ color: 'var(--muted)', fontSize: '13px' }}>Required Monthly SIP</div>
        <div style={{ fontSize: '32px', fontWeight: '700', color: 'var(--green)', marginTop: '8px' }}>₹{fmt(requiredSIP)}</div>
        <div style={{ color: 'var(--muted)', fontSize: '12px', marginTop: '8px' }}>to reach ₹{fmt(goal)} in {years} years</div>
      </div>
    </div>
  )
}

function FDvsSIP() {
  const [amount, setAmount] = useState(5000)
  const [years, setYears] = useState(10)

  const months = years * 12
  const sipRate = 12 / 100 / 12
  const fdRate = 6.5 / 100 / 12
  const sipValue = amount * ((Math.pow(1 + sipRate, months) - 1) / sipRate) * (1 + sipRate)
  const fdValue = amount * ((Math.pow(1 + fdRate, months) - 1) / fdRate) * (1 + fdRate)
  const fmt = (n) => new Intl.NumberFormat('en-IN').format(Math.round(n))

  const data = Array.from({ length: years }, (_, i) => {
    const m = (i + 1) * 12
    return {
      year: `Yr ${i + 1}`,
      SIP: Math.round(amount * ((Math.pow(1 + sipRate, m) - 1) / sipRate) * (1 + sipRate)),
      FD: Math.round(amount * ((Math.pow(1 + fdRate, m) - 1) / fdRate) * (1 + fdRate)),
    }
  })

  return (
    <div>
      {[
        { label: `Monthly Amount: ₹${fmt(amount)}`, value: amount, setter: setAmount, min: 500, max: 100000, step: 500 },
        { label: `Duration: ${years} years`, value: years, setter: setYears, min: 1, max: 30, step: 1 },
      ].map(({ label, value, setter, min, max, step }) => (
        <div key={label} style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>{label}</div>
          <input type="range" min={min} max={max} step={step} value={value}
            onChange={e => setter(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--green)' }} />
        </div>
      ))}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>SIP @ 12%</div>
          <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--green)', marginTop: '4px' }}>₹{fmt(sipValue)}</div>
        </div>
        <div style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>FD @ 6.5%</div>
          <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--red)', marginTop: '4px' }}>₹{fmt(fdValue)}</div>
        </div>
      </div>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart data={data}>
          <XAxis dataKey="year" tick={{ fill: '#8B949E', fontSize: 10 }} tickLine={false} axisLine={false} />
          <YAxis tick={{ fill: '#8B949E', fontSize: 10 }} tickLine={false} axisLine={false} tickFormatter={v => `₹${(v/1000).toFixed(0)}K`} />
          <Tooltip formatter={v => `₹${new Intl.NumberFormat('en-IN').format(v)}`} contentStyle={{ backgroundColor: '#161B22', border: '1px solid #30363D', borderRadius: '8px', color: '#E6EDF3' }} />
          <Legend />
          <Line type="monotone" dataKey="SIP" stroke="#00D084" strokeWidth={2} dot={false} />
          <Line type="monotone" dataKey="FD" stroke="#FF4757" strokeWidth={2} dot={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

function ELSSCalculator() {
  const [amount, setAmount] = useState(5000)
  const [years, setYears] = useState(3)
  const [slab, setSlab] = useState(30)

  const annual = amount * 12
  const maxDeduction = Math.min(annual * years, 150000)
  const taxSaved = maxDeduction * slab / 100
  const fmt = (n) => new Intl.NumberFormat('en-IN').format(Math.round(n))

  return (
    <div>
      {[
        { label: `Monthly SIP: ₹${fmt(amount)}`, value: amount, setter: setAmount, min: 500, max: 12500, step: 500 },
        { label: `Duration: ${years} years`, value: years, setter: setYears, min: 1, max: 20, step: 1 },
      ].map(({ label, value, setter, min, max, step }) => (
        <div key={label} style={{ marginBottom: '16px' }}>
          <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>{label}</div>
          <input type="range" min={min} max={max} step={step} value={value}
            onChange={e => setter(Number(e.target.value))}
            style={{ width: '100%', accentColor: 'var(--green)' }} />
        </div>
      ))}
      <div style={{ marginBottom: '16px' }}>
        <div style={{ fontSize: '13px', color: 'var(--muted)', marginBottom: '6px' }}>Tax Slab</div>
        <div style={{ display: 'flex', gap: '8px' }}>
          {[10, 20, 30].map(s => (
            <button key={s} onClick={() => setSlab(s)} style={{
              flex: 1, padding: '8px', borderRadius: '8px', border: 'none', cursor: 'pointer',
              backgroundColor: slab === s ? 'var(--green)' : 'var(--bg)',
              color: slab === s ? '#000' : 'var(--text)', fontWeight: '600', fontSize: '13px',
            }}>{s}%</button>
          ))}
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
        <div style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>80C Deduction</div>
          <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--text)', marginTop: '4px' }}>₹{fmt(maxDeduction)}</div>
        </div>
        <div style={{ backgroundColor: 'var(--bg)', borderRadius: '8px', padding: '12px', textAlign: 'center' }}>
          <div style={{ fontSize: '11px', color: 'var(--muted)' }}>Tax Saved</div>
          <div style={{ fontWeight: '700', fontSize: '16px', color: 'var(--green)', marginTop: '4px' }}>₹{fmt(taxSaved)}</div>
        </div>
      </div>
    </div>
  )
}

const calculators = [
  { title: '📅 SIP Calculator', component: SIPCalculator },
  { title: '💰 Lumpsum Calculator', component: LumpsumCalculator },
  { title: '🎯 Goal Planner', component: GoalPlanner },
  { title: '⚔️ FD vs SIP', component: FDvsSIP },
  { title: '🏦 ELSS Tax Saver', component: ELSSCalculator },
]

export default function Calculators() {
  const [open, setOpen] = useState(0)

  return (
    <div style={{ padding: '16px', maxWidth: '800px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '20px' }}>🧮 Calculators</h1>
      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {calculators.map(({ title, component: Comp }, i) => (
          <div key={i} style={{ backgroundColor: 'var(--card)', borderRadius: '12px', overflow: 'hidden', border: '1px solid var(--muted)' }}>
            <div onClick={() => setOpen(open === i ? -1 : i)} style={{
              padding: '16px 20px', cursor: 'pointer',
              display: 'flex', justifyContent: 'space-between', alignItems: 'center',
            }}>
              <span style={{ fontWeight: '700', fontSize: '15px' }}>{title}</span>
              <span style={{ color: 'var(--muted)', fontSize: '18px' }}>{open === i ? '▲' : '▼'}</span>
            </div>
            {open === i && (
              <div style={{ padding: '0 20px 20px' }}>
                <Comp />
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  )
}