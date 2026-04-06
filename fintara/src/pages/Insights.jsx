import { useMemo } from 'react'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts'
import {
  INITIAL_TRANSACTIONS,
  BALANCE_TREND,
  CAT_COLORS,
  SPENDING_COLORS,
  INR,
  INR_SHORT,
} from '../shared/constants'

// ── ICON HELPER ────────────────────────────────────────
const Icon = ({ d, size = 24, stroke = 'currentColor', fill = 'none', strokeWidth = 1.5, viewBox = '0 0 24 24' }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0 }}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
)

const Icons = {
  fire:      (s=24) => <Icon size={s} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" fill="currentColor" stroke="none" />,
  trendUp:   (s=24) => <Icon size={s} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />,
  lightbulb: (s=24) => <Icon size={s} d={['M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3M6.343 6.343l-.707-.707M12 21a6 6 0 01-6-6c0-2.12 1.024-3.998 2.606-5.188A6 6 0 0118 15a6 6 0 01-6 6z']} />,
  trophy:    (s=24) => <Icon size={s} d={['M8 21h8m-4-4v4','M5 3h14M5 3a2 2 0 000 4h14a2 2 0 000-4M5 7c0 5.523 3.134 8 7 8s7-2.477 7-8']} />,
  arrowUp:   (s=10) => <Icon size={s} d="M5 10l7-7m0 0l7 7m-7-7v18" strokeWidth={2} />,
  arrowDown: (s=10) => <Icon size={s} d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeWidth={2} />,
}

// ── CUSTOM TOOLTIP ─────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 12, padding: '0.75rem 1rem', fontSize: '0.8rem', boxShadow: 'var(--shadow)' }}>
        <p style={{ fontWeight: 700, marginBottom: 4, color: 'var(--text-primary)' }}>{label}</p>
        {payload.map(p => <p key={p.name} style={{ color: p.color }}>{p.name}: {INR_SHORT(p.value)}</p>)}
      </div>
    )
  }
  return null
}

// ── INSIGHTS PAGE (default export) ────────────────────
export default function Insights({ transactions }) {
  const txList = transactions || INITIAL_TRANSACTIONS

  const totalIncome  = txList.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totExpense   = Math.abs(txList.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0))
  const savings      = totalIncome - totExpense
  const savingsRate  = totalIncome > 0 ? ((savings / totalIncome) * 100).toFixed(1) : 0

  const spendingByCategory = useMemo(() => {
    const map = {}
    txList.filter(t => t.type === 'expense').forEach(t => { map[t.category] = (map[t.category] || 0) + Math.abs(t.amount) })
    return Object.entries(map).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) })).sort((a, b) => b.value - a.value)
  }, [txList])

  const topCategory = spendingByCategory[0]
  const maxCatVal   = spendingByCategory[0]?.value || 1

  const monthlyMap = useMemo(() => {
    const map = {}
    txList.forEach(t => {
      const m = t.date.slice(0, 7)
      if (!map[m]) map[m] = { income: 0, expense: 0 }
      if (t.type === 'income') map[m].income += t.amount
      else map[m].expense += Math.abs(t.amount)
    })
    return Object.entries(map).sort((a, b) => a[0] > b[0] ? 1 : -1)
  }, [txList])

  const maxMonthVal = Math.max(...monthlyMap.map(([, v]) => Math.max(v.income, v.expense)), 1)

  const insightCards = [
    {
      icon: Icons.fire,
      title: 'Highest Spending Category',
      value: topCategory?.name || 'N/A',
      detail: `You spent ${INR(topCategory?.value || 0)} on ${topCategory?.name} this period.`,
    },
    {
      icon: Icons.trendUp,
      title: 'Savings Rate',
      value: `${savingsRate}%`,
      detail: `You saved ${INR(savings)} of ${INR(totalIncome)}.${parseFloat(savingsRate) > 20 ? ' Great job!' : ' Aim for 20%+.'}`,
    },
    {
      icon: Icons.lightbulb,
      title: 'Avg. Daily Spend',
      value: INR_SHORT(totExpense / 30),
      detail: 'Track daily to spot unusual spikes early.',
    },
    {
      icon: Icons.trophy,
      title: 'Income vs. Last Month',
      value: '+12.8%',
      detail: 'Freelance earnings contributed most this month.',
      valueColor: '#4CAF50',
    },
  ]

  return (
    <>
      {/* ── INSIGHT CARDS ── */}
      <div className="insights-grid">
        {insightCards.map(card => (
          <div className="insight-card" key={card.title}>
            <div className="insight-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-secondary)' }}>{card.icon(24)}</div>
            <p className="insight-title">{card.title}</p>
            <p className="insight-value" style={card.valueColor ? { color: card.valueColor } : {}}>{card.value}</p>
            <p className="insight-detail">{card.detail}</p>
          </div>
        ))}
      </div>

      {/* ── BALANCE TREND CHART ── */}
      <div className="chart-card" style={{ marginBottom: '1.2rem' }}>
        <div className="chart-header">
          <div>
            <div className="chart-title">Balance Trend</div>
            <div className="chart-sub">6-month income vs expenses</div>
          </div>
          <div className="chart-legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--accent)' }} /> Income</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: '#F44336' }} /> Expenses</div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart data={BALANCE_TREND}>
            <defs>
              <linearGradient id="incGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="expGrad2" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#F44336" stopOpacity={0.2} />
                <stop offset="95%" stopColor="#F44336" stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
            <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => INR_SHORT(v)} />
            <Tooltip content={<CustomTooltip />} />
            <Area type="monotone" dataKey="income"   name="Income"   stroke="var(--accent)" fill="url(#incGrad2)" strokeWidth={2} dot={false} />
            <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#F44336"        fill="url(#expGrad2)" strokeWidth={2} dot={false} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* ── MONTHLY INCOME VS EXPENSES BAR CHART ── */}
      <div className="chart-card" style={{ marginBottom: '1.2rem' }}>
        <div className="chart-header">
          <div><div className="chart-title">Monthly Income vs Expenses</div><div className="chart-sub">Month-by-month</div></div>
          <div className="chart-legend">
            <div className="legend-item"><div className="legend-dot" style={{ background: '#4CAF50' }} /> Income</div>
            <div className="legend-item"><div className="legend-dot" style={{ background: '#F44336' }} /> Expenses</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '0.8rem', height: '160px', padding: '0 0.5rem' }}>
          {monthlyMap.map(([month, vals]) => {
            const incH = Math.round((vals.income / maxMonthVal) * 130)
            const expH = Math.round((vals.expense / maxMonthVal) * 130)
            return (
              <div key={month} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, height: '100%', justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
                  <div title={`Income: ${INR(vals.income)}`} style={{ width: 14, height: incH, background: '#4CAF50', borderRadius: '3px 3px 0 0' }} />
                  <div title={`Expenses: ${INR(vals.expense)}`} style={{ width: 14, height: expH, background: '#F44336', borderRadius: '3px 3px 0 0' }} />
                </div>
                <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>{month.slice(5)}</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── SPENDING BY CATEGORY ── */}
      <div className="chart-card">
        <div className="chart-header"><div><div className="chart-title">Spending by Category</div><div className="chart-sub">Current period breakdown</div></div></div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
          {spendingByCategory.map((item, i) => (
            <div key={item.name}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.3rem', alignItems: 'center' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                  <span style={{ width: 8, height: 8, borderRadius: '50%', background: CAT_COLORS[item.name] || SPENDING_COLORS[i % SPENDING_COLORS.length], display: 'inline-block' }} />{item.name}
                </span>
                <span style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                  {INR(item.value)}{' '}
                  <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.75rem' }}>({((item.value / totExpense) * 100).toFixed(1)}%)</span>
                </span>
              </div>
              <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
                <div style={{ height: '100%', width: `${((item.value / maxCatVal) * 100).toFixed(1)}%`, background: CAT_COLORS[item.name] || SPENDING_COLORS[i % SPENDING_COLORS.length], borderRadius: 3, transition: 'width 0.8s ease' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SAVINGS SUMMARY ROW ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem', marginTop: '1.2rem' }}>
        {[
          { label: 'Total Income',   value: INR_SHORT(totalIncome), change: '+12.1%', dir: 'up',   color: '#4CAF50' },
          { label: 'Total Expenses', value: INR_SHORT(totExpense),  change: '+5.3%',  dir: 'down', color: '#F44336' },
          { label: 'Net Savings',    value: INR_SHORT(savings),     change: '+18.7%', dir: 'up',   color: savings >= 0 ? '#4CAF50' : '#F44336' },
        ].map(s => (
          <div key={s.label} className="summary-card">
            <p className="card-label">{s.label}</p>
            <p className="card-value" style={{ color: s.color }}>{s.value}</p>
            <p className={`card-change ${s.dir}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {s.dir === 'up' ? Icons.arrowUp(10) : Icons.arrowDown(10)} {s.change} this month
            </p>
          </div>
        ))}
      </div>
    </>
  )
}