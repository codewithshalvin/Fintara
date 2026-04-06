import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { useTheme } from '../context/ThemeContext.jsx'
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, PieChart, Pie, Cell,
} from 'recharts'

import Transactions from './Transactions'
import Insights from './insights.jsx'

import {
  INITIAL_TRANSACTIONS,
  CREDIT_CARDS as INITIAL_CREDIT_CARDS,
  BALANCE_TREND,
  CAT_COLORS,
  SPENDING_COLORS,
  INR,
  INR_SHORT,
} from '../shared/constants'

// ── ICONS ──────────────────────────────────────────────
const Icon = ({ d, size = 16, stroke = 'currentColor', fill = 'none', strokeWidth = 1.5, viewBox = '0 0 24 24', style = {} }) => (
  <svg width={size} height={size} viewBox={viewBox} fill={fill} stroke={stroke} strokeWidth={strokeWidth} strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, ...style }}>
    {Array.isArray(d) ? d.map((p, i) => <path key={i} d={p} />) : <path d={d} />}
  </svg>
)

const Icons = {
  overview:     (s=16) => <Icon size={s} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
  transactions: (s=16) => <Icon size={s} d={['M7 16V4m0 0L3 8m4-4l4 4','M17 8v12m0 0l4-4m-4 4l-4-4']} />,
  insights:     (s=16) => <Icon size={s} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />,
  signout:      (s=16) => <Icon size={s} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />,
  addTx:        (s=16) => <Icon size={s} d="M12 4v16m8-8H4" />,
  addCard:      (s=16) => <Icon size={s} d={['M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z','M12 8v4m-2-2h4']} />,
  sun:          (s=16) => <Icon size={s} d="M12 3v1m0 16v1M4.22 4.22l.71.71m12.73 12.73l.71.71M3 12h1m16 0h1M4.22 19.78l.71-.71M18.36 5.64l.71-.71M12 5a7 7 0 100 14A7 7 0 0012 5z" />,
  moon:         (s=16) => <Icon size={s} d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" />,
  wallet:       (s=20) => <Icon size={s} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
  arrowUp:      (s=20) => <Icon size={s} d="M5 10l7-7m0 0l7 7m-7-7v18" />,
  arrowDown:    (s=20) => <Icon size={s} d="M19 14l-7 7m0 0l-7-7m7 7V3" />,
  piggyBank:    (s=20) => <Icon size={s} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />,
  diamond:      (s=16) => <Icon size={s} d="M12 2l10 9-10 11L2 11z" />,
  admin:        (s=14) => <Icon size={s} d="M13 10V3L4 14h7v7l9-11h-7z" />,
  viewer:       (s=14) => <Icon size={s} d={['M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z','M12 9a3 3 0 100 6 3 3 0 000-6z']} />,
  creditCard:   (s=16) => <Icon size={s} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
  delete:       (s=14) => <Icon size={s} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
  lock:         (s=14) => <Icon size={s} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
}

// ── CARD NETWORK PRESETS ───────────────────────────────
const CARD_GRADIENTS = [
  { label: 'Ocean Teal',    bg: 'linear-gradient(135deg,#1a5c4a 0%,#0d7a6b 100%)', color: '#0d7a6b' },
  { label: 'Midnight',      bg: 'linear-gradient(135deg,#2c2c2c 0%,#444 100%)',     color: '#888' },
  { label: 'Royal Gold',    bg: 'linear-gradient(135deg,#b8952a 0%,#d4a93a 100%)', color: '#b8952a' },
  { label: 'Indigo',        bg: 'linear-gradient(135deg,#3730a3 0%,#6366f1 100%)', color: '#6366f1' },
  { label: 'Rose',          bg: 'linear-gradient(135deg,#9f1239 0%,#e11d48 100%)', color: '#e11d48' },
  { label: 'Slate Blue',    bg: 'linear-gradient(135deg,#1e3a5f 0%,#2563eb 100%)', color: '#2563eb' },
]

// ── ADD CARD MODAL ─────────────────────────────────────
function AddCardModal({ onClose, onAdd }) {
  const [form, setForm] = useState({
    bank: '', type: '', number: '', holder: 'Alex Johnson',
    expiry: '', network: 'visa', gradientIdx: 0,
  })
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })

  const preview = CARD_GRADIENTS[form.gradientIdx]

  const submit = (e) => {
    e.preventDefault()
    if (!form.bank || !form.number || !form.expiry) return
    const last4 = form.number.replace(/\s/g, '').slice(-4)
    onAdd({
      id: `card_${Date.now()}`,
      bank: form.bank,
      type: form.type || form.network.toUpperCase(),
      number: `•••• •••• •••• ${last4}`,
      holder: form.holder,
      expiry: form.expiry,
      network: form.network,
      bg: preview.bg,
      color: preview.color,
    })
    onClose()
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 480 }}>
        <h2 className="modal-title">Add New Card</h2>

        {/* Live card preview */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{
            width: '100%', height: 148, borderRadius: 16,
            background: preview.bg,
            border: '1px solid rgba(255,255,255,0.2)',
            position: 'relative', overflow: 'hidden',
          }}>
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 55%)', pointerEvents: 'none' }} />
            <div style={{ padding: '16px 20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>{form.bank || 'Bank Name'}</div>
                <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.55)', marginTop: 2 }}>{form.type || 'Card Type'}</div>
              </div>
              <div>
                <div style={{ width: 28, height: 20, borderRadius: 4, background: 'rgba(220,190,80,0.88)', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap: 1.5, padding: '3px 4px', marginBottom: 6 }}>
                  {[...Array(6)].map((_, i) => <div key={i} style={{ background: 'rgba(160,120,0,0.5)', borderRadius: 1, gridColumn: (i === 0 || i === 4) ? '1/-1' : undefined }} />)}
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.82)', letterSpacing: '0.18em' }}>
                  {form.number ? `•••• •••• •••• ${form.number.replace(/\s/g,'').slice(-4) || '????'}` : '•••• •••• •••• ????'}
                </div>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{form.holder}</div>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>EXP {form.expiry || 'MM/YY'}</div>
                </div>
                <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.9)', fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>{form.network}</span>
              </div>
            </div>
          </div>
        </div>

        <form onSubmit={submit}>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Bank / Issuer *</label>
              <input className="form-input" name="bank" placeholder="e.g. HDFC Bank" value={form.bank} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Card Label</label>
              <input className="form-input" name="type" placeholder="e.g. Regalia Credit" value={form.type} onChange={handle} />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Card Number *</label>
              <input className="form-input" name="number" placeholder="Last 4 digits or full number" value={form.number} onChange={handle} maxLength={19} required />
            </div>
            <div className="form-group">
              <label className="form-label">Expiry *</label>
              <input className="form-input" name="expiry" placeholder="MM/YY" value={form.expiry} onChange={handle} maxLength={5} required />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Network</label>
              <select className="form-input filter-select" name="network" value={form.network} onChange={handle} style={{ width: '100%' }}>
                <option value="visa">Visa</option>
                <option value="mc">Mastercard</option>
                <option value="amex">Amex</option>
                <option value="rupay">RuPay</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Cardholder Name</label>
              <input className="form-input" name="holder" value={form.holder} onChange={handle} />
            </div>
          </div>

          {/* Color picker */}
          <div className="form-group">
            <label className="form-label">Card Theme</label>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 4 }}>
              {CARD_GRADIENTS.map((g, i) => (
                <div
                  key={i}
                  onClick={() => setForm({ ...form, gradientIdx: i })}
                  title={g.label}
                  style={{
                    width: 36, height: 22, borderRadius: 6,
                    background: g.bg, cursor: 'pointer',
                    border: form.gradientIdx === i ? '2.5px solid var(--text-primary)' : '2px solid transparent',
                    transition: 'border 0.15s',
                  }}
                />
              ))}
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Add Card</button>
          </div>
        </form>
      </div>
    </div>
  )
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

// ── OVERVIEW SECTION ───────────────────────────────────
function OverviewSection({ transactions, creditCards, isAdmin, onNavigate }) {
  const totalBalance = 2024000
  const totalIncome  = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totExpense   = Math.abs(transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0))
  const savings      = totalIncome - totExpense

  const spendingByCategory = (() => {
    const map = {}
    transactions.filter(t => t.type === 'expense').forEach(t => { map[t.category] = (map[t.category] || 0) + Math.abs(t.amount) })
    return Object.entries(map).map(([name, value]) => ({ name, value: parseFloat(value.toFixed(2)) })).sort((a, b) => b.value - a.value)
  })()

  const summaryCards = [
    { label: 'Total Balance',  value: INR_SHORT(totalBalance), change: '+2.4%',  dir: 'up',   icon: Icons.wallet },
    { label: 'Total Income',   value: INR_SHORT(totalIncome),  change: '+12.1%', dir: 'up',   icon: Icons.arrowUp },
    { label: 'Total Expenses', value: INR_SHORT(totExpense),   change: '+5.3%',  dir: 'down', icon: Icons.arrowDown },
    { label: 'Net Savings',    value: INR_SHORT(savings),      change: '+18.7%', dir: 'up',   icon: Icons.piggyBank },
  ]

  return (
    <>
      <div className="cards-grid">
        {summaryCards.map(card => (
          <div className="summary-card" key={card.label}>
            <div className="card-icon" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{card.icon(20)}</div>
            <p className="card-label">{card.label}</p>
            <p className="card-value">{card.value}</p>
            <p className={`card-change ${card.dir}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {card.dir === 'up' ? Icons.arrowUp(10) : Icons.arrowDown(10)} {card.change} this month
            </p>
          </div>
        ))}
      </div>

      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-header">
            <div><div className="chart-title">Balance Trend</div><div className="chart-sub">6-month overview</div></div>
            <div className="chart-legend">
              <div className="legend-item"><div className="legend-dot" style={{ background: 'var(--accent)' }} /> Income</div>
              <div className="legend-item"><div className="legend-dot" style={{ background: '#F44336' }} /> Expenses</div>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={BALANCE_TREND}>
              <defs>
                <linearGradient id="incGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} /><stop offset="95%" stopColor="var(--accent)" stopOpacity={0} /></linearGradient>
                <linearGradient id="expGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#F44336" stopOpacity={0.2} /><stop offset="95%" stopColor="#F44336" stopOpacity={0} /></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
              <XAxis dataKey="month" tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 11 }} axisLine={false} tickLine={false} tickFormatter={v => INR_SHORT(v)} />
              <Tooltip content={<CustomTooltip />} />
              <Area type="monotone" dataKey="income"   name="Income"   stroke="var(--accent)" fill="url(#incGrad)" strokeWidth={2} dot={false} />
              <Area type="monotone" dataKey="expenses" name="Expenses" stroke="#F44336"        fill="url(#expGrad)" strokeWidth={2} dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-header"><div><div className="chart-title">Spending Breakdown</div><div className="chart-sub">By category</div></div></div>
          <div className="donut-wrap">
            <ResponsiveContainer width="100%" height={160}>
              <PieChart>
                <Pie data={spendingByCategory} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" strokeWidth={0}>
                  {spendingByCategory.map((_, i) => <Cell key={i} fill={SPENDING_COLORS[i % SPENDING_COLORS.length]} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <div className="donut-legend">
              {spendingByCategory.slice(0, 5).map((item, i) => (
                <div className="donut-legend-row" key={item.name}>
                  <div className="donut-legend-left"><div className="legend-dot" style={{ background: SPENDING_COLORS[i % SPENDING_COLORS.length] }} />{item.name}</div>
                  <span className="donut-legend-val">{INR_SHORT(item.value)}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* My Cards strip (read-only overview) */}
      <div className="tx-card" style={{ marginBottom: '1.25rem' }}>
        <div className="tx-toolbar">
          <span className="tx-toolbar-title">My Cards</span>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{creditCards.length} card{creditCards.length !== 1 ? 's' : ''} linked</span>
        </div>
        <div style={{ display: 'flex', gap: 14, overflowX: 'auto', paddingBottom: 6 }}>
          {creditCards.map(card => (
            <div key={card.id} style={{ flexShrink: 0, width: 220, height: 128, borderRadius: 14, background: card.bg, position: 'relative', overflow: 'hidden', border: '1px solid rgba(255,255,255,0.15)' }}>
              <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(135deg,rgba(255,255,255,0.1) 0%,transparent 55%)', pointerEvents: 'none' }} />
              <div style={{ padding: '14px 16px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', position: 'relative', zIndex: 2 }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>{card.bank}</div>
                  <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.5)', marginTop: 1 }}>{card.type}</div>
                </div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.78)', letterSpacing: '0.16em' }}>{card.number}</div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                  <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>EXP {card.expiry}</div>
                  <span style={{ fontSize: 10, fontWeight: 600, color: 'rgba(255,255,255,0.85)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>{card.network}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="tx-card">
        <div className="tx-toolbar">
          <span className="tx-toolbar-title">Recent Transactions</span>
          <button className="btn-ghost" style={{ fontSize: '0.8rem', padding: '0.4rem 1rem' }} onClick={() => onNavigate('/transactions')}>View All →</button>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 10 }}>
          {transactions.slice(0, 6).map(tx => {
            const color = CAT_COLORS[tx.category] || '#888'
            const cardInfo = creditCards.find(c => c.id === tx.cardId)
            return (
              <div key={tx.id} style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '1rem', display: 'flex', flexDirection: 'column', gap: 10 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <div style={{ width: 38, height: 38, borderRadius: 10, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>{Icons.creditCard(17)}</div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>{tx.merchant}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{tx.date}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.95rem', fontWeight: 700, color: tx.type === 'income' ? '#4CAF50' : '#F44336' }}>{tx.type === 'income' ? '+' : '−'}{INR(tx.amount)}</div>
                </div>
                <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: '0.68rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '2px 7px', borderRadius: 20, border: '1px solid var(--border)' }}>{tx.category}</span>
                  {cardInfo && <span style={{ fontSize: '0.62rem', padding: '2px 7px', borderRadius: 20, background: cardInfo.color + '15', color: cardInfo.color, border: `1px solid ${cardInfo.color}30` }}>{cardInfo.bank}</span>}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </>
  )
}

// ── DASHBOARD SHELL ────────────────────────────────────
export default function Dashboard({ user, onLogout, activePage }) {
  const navigate   = useNavigate()
  const location   = useLocation()
  const { theme, toggleTheme } = useTheme()

  const [role, setRole]               = useState(user?.role || 'viewer')
  const [transactions, setTransactions] = useState(INITIAL_TRANSACTIONS)
  const [creditCards, setCreditCards]   = useState(INITIAL_CREDIT_CARDS)
  const [showAddCard, setShowAddCard]   = useState(false)

  const isAdmin = role === 'admin'

  const currentPath   = location.pathname.replace('/', '') || 'dashboard'
  const activeSection = activePage || (currentPath === 'dashboard' ? 'overview' : currentPath)
  const pageTitles    = { overview: 'Overview', transactions: 'Transactions', insights: 'Insights' }

  const navItems = [
    { id: 'overview',     path: '/dashboard',    icon: Icons.overview,     label: 'Overview' },
    { id: 'transactions', path: '/transactions', icon: Icons.transactions, label: 'Transactions' },
    { id: 'insights',     path: '/insights',     icon: Icons.insights,     label: 'Insights' },
  ]

  const addCard = (card) => setCreditCards(prev => [...prev, card])
  const handleLogout = () => { if (onLogout) onLogout(); navigate('/') }
  const initials = user?.name?.split(' ').map(n => n[0]).join('') || 'U'

  return (
    <div className="dashboard-layout">

      {/* ── SIDEBAR ── */}
      <aside className="d-sidebar">
        <div className="d-sidebar-logo" style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
           Fintara
        </div>

        <nav className="d-nav">
          {navItems.map(item => (
            <button key={item.id} className={`d-nav-item ${activeSection === item.id ? 'active' : ''}`} onClick={() => navigate(item.path)}>
              <span className="d-nav-icon">{item.icon(16)}</span>{item.label}
            </button>
          ))}
        </nav>

        {/* Role switcher */}
        <div style={{ padding: '1rem 0', borderTop: '1px solid var(--border)', borderBottom: '1px solid var(--border)', marginBottom: '1rem' }}>
          <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Role</p>
          <select value={role} onChange={e => setRole(e.target.value)} className="filter-select" style={{ width: '100%', borderRadius: 10 }}>
            <option value="viewer">Viewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        {/* Admin quick-actions in sidebar */}
        {isAdmin && (
          <div style={{ marginBottom: '1rem' }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: '0.5rem', paddingLeft: '0.5rem' }}>Admin actions</p>
            <button
              onClick={() => setShowAddCard(true)}
              style={{ width: '100%', padding: '0.55rem 0.75rem', borderRadius: 10, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.8rem', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', gap: 7, transition: 'all 0.2s' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
            >
              {Icons.addCard(14)} Add New Card
            </button>
          </div>
        )}

        <div className="d-sidebar-footer">
          <div className="d-user">
            <div className="d-avatar">{initials}</div>
            <div>
              <div className="d-user-name">{user?.name || 'User'}</div>
              <div className="d-user-role" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                {isAdmin ? <>{Icons.admin(12)} Admin</> : <>{Icons.viewer(12)} Viewer</>}
              </div>
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{ width: '100%', marginTop: '0.75rem', padding: '0.65rem', borderRadius: 12, border: '1px solid var(--border)', background: 'transparent', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.85rem', transition: 'all 0.3s', fontFamily: 'var(--font-body)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6 }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#F44336'; e.currentTarget.style.color = '#F44336' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-muted)' }}>
            {Icons.signout(15)} Sign Out
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main className="d-main">
        <div className="d-topbar">
          <div>
            <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 4 }}>
              {new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
            <h1 className="d-page-title">{pageTitles[activeSection] || 'Overview'}</h1>
          </div>

          <div className="d-topbar-right">
            {/* Role pill */}
            <span className={`role-pill ${isAdmin ? 'admin' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
              {isAdmin ? <>{Icons.admin(12)} Admin Mode</> : <>{Icons.viewer(12)} Viewer Mode</>}
            </span>

            {/* Theme toggle */}
            <button className="theme-toggle" onClick={toggleTheme} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              {theme === 'dark' ? Icons.sun(16) : Icons.moon(16)}
            </button>

            {/* ── ADMIN-ONLY TOPBAR BUTTONS ── */}
            {isAdmin && (
              <>
                <button
                  onClick={() => setShowAddCard(true)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: '0.5rem 1rem', borderRadius: 10, fontSize: '0.82rem',
                    border: '1px solid var(--border)', background: 'var(--bg-secondary)',
                    color: 'var(--text-secondary)', cursor: 'pointer',
                    fontFamily: 'var(--font-body)', transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--accent)'; e.currentTarget.style.color = 'var(--accent)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.color = 'var(--text-secondary)' }}
                >
                  {Icons.addCard(14)} Add Card
                </button>
              </>
            )}

            {/* Viewer-mode lock hint */}
            {!isAdmin && (
              <span style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.75rem', color: 'var(--text-muted)', opacity: 0.7 }}>
                {Icons.lock(14)} Switch to Admin to edit
              </span>
            )}
          </div>
        </div>

        {/* ── PAGE CONTENT ── */}
        {activeSection === 'overview' && (
          <OverviewSection
            transactions={transactions}
            creditCards={creditCards}
            isAdmin={isAdmin}
            onNavigate={navigate}
          />
        )}

        {activeSection === 'transactions' && (
          <Transactions
            isAdmin={isAdmin}
            transactions={transactions}
            setTransactions={setTransactions}
            creditCards={creditCards}
          />
        )}

        {activeSection === 'insights' && (
          <Insights transactions={transactions} />
        )}
      </main>

      {/* ── ADD CARD MODAL (admin only) ── */}
      {showAddCard && isAdmin && (
        <AddCardModal
          onClose={() => setShowAddCard(false)}
          onAdd={addCard}
        />
      )}
    </div>
  )
}