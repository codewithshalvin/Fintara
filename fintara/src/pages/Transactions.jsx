import { useState, useMemo } from 'react'
import { LineChart, Line, ResponsiveContainer } from 'recharts'
import {
  INITIAL_TRANSACTIONS,
  CAT_COLORS,
  CATEGORIES,
  SPARKLINE_DATA,
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
  income:     (s=14) => <Icon size={s} d="M5 10l7-7m0 0l7 7m-7-7v18" strokeWidth={2} />,
  expense:    (s=14) => <Icon size={s} d="M19 14l-7 7m0 0l-7-7m7 7V3" strokeWidth={2} />,
  search:     (s=16) => <Icon size={s} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />,
  download:   (s=16) => <Icon size={s} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />,
  grid:       (s=16) => <Icon size={s} d={['M3 3h7v7H3zm11 0h7v7h-7zM3 14h7v7H3zm11 0h7v7h-7z']} strokeWidth={1.5} />,
  list:       (s=16) => <Icon size={s} d="M4 6h16M4 10h16M4 14h16M4 18h16" />,
  close:      (s=16) => <Icon size={s} d="M6 18L18 6M6 6l12 12" />,
  delete:     (s=14) => <Icon size={s} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />,
  addTx:      (s=16) => <Icon size={s} d="M12 4v16m8-8H4" />,
  inbox:      (s=40) => <Icon size={s} d="M22 12h-6l-2 3h-4l-2-3H2m20 0a10 10 0 11-20 0m20 0V6a2 2 0 00-2-2H4a2 2 0 00-2 2v6" />,
  chevLeft:   (s=16) => <Icon size={s} d="M15 18l-6-6 6-6" />,
  chevRight:  (s=16) => <Icon size={s} d="M9 18l6-6-6-6" />,
  briefcase:  (s=16) => <Icon size={s} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  cart:       (s=16) => <Icon size={s} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-1.4 5M17 13l1.4 5M9 20a1 1 0 100-2 1 1 0 000 2zm8 0a1 1 0 100-2 1 1 0 000 2z" />,
  car:        (s=16) => <Icon size={s} d="M8 10h8M5 16l1-6h12l1 6M5 16H3m14 0h2M6 19a1 1 0 100-2 1 1 0 000 2zm12 0a1 1 0 100-2 1 1 0 000 2zM7 10l1-4h8l1 4" />,
  laptop:     (s=16) => <Icon size={s} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />,
  coffee:     (s=16) => <Icon size={s} d={['M18 8h1a4 4 0 010 8h-1','M2 8h16v9a4 4 0 01-4 4H6a4 4 0 01-4-4V8z','M6 1v3m4-3v3m4-3v3']} />,
  package:    (s=16) => <Icon size={s} d={['M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z','M3.27 6.96L12 12.01l8.73-5.05','M12 22.08V12']} />,
  dumbbell:   (s=16) => <Icon size={s} d="M3 12h3m12 0h3M6 8v8m3-10v12m6-12v12m3-8v8" strokeWidth={2} />,
  music:      (s=16) => <Icon size={s} d={['M9 18V5l12-2v13','M9 18a3 3 0 11-6 0 3 3 0 016 0zm12-2a3 3 0 11-6 0 3 3 0 016 0z']} />,
  zap:        (s=16) => <Icon size={s} d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />,
  pizza:      (s=16) => <Icon size={s} d="M12 22C6.477 22 2 17.523 2 12c5 0 10 5 10 10zm0 0c0-5.523 4.477-10 10-10 0 5.523-4.477 10-10 10zm0 0V2" />,
  home:       (s=16) => <Icon size={s} d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />,
  rocket:     (s=16) => <Icon size={s} d="M12 2C9 2 4 9 4 13a8 8 0 008 8c4 0 8-4 8-8 0-4-3-11-8-11zM8 17l-2 3m8-3l2 3M9 11a3 3 0 106 0" />,
  pill:       (s=16) => <Icon size={s} d="M10.5 6H6a3 3 0 000 6h4.5m3 0H18a3 3 0 000-6h-4.5M10.5 6v6m3-6v6" />,
  plane:      (s=16) => <Icon size={s} d="M21 16.5L12 13l-9 3.5 9-14.5 9 14.5zM12 13v9" />,
  shield:     (s=16) => <Icon size={s} d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />,
  creditCard: (s=16) => <Icon size={s} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />,
  dividend:   (s=16) => <Icon size={s} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4v16" />,
  film:       (s=16) => <Icon size={s} d={['M7 4v16M17 4v16M3 8h4m10 0h4M3 16h4m10 0h4M4 20h16a1 1 0 001-1V5a1 1 0 00-1-1H4a1 1 0 00-1 1v14a1 1 0 001 1z']} />,
  ticket:     (s=16) => <Icon size={s} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />,
  zerodha:    (s=16) => <Icon size={s} d="M3 3h18M3 21l9-18 9 18M9 15h6" />,
  lock:       (s=14) => <Icon size={s} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />,
  filter:     (s=14) => <Icon size={s} d="M3 4h18M7 8h10M11 12h2M11 16h2" />,
  x:          (s=14) => <Icon size={s} d="M6 18L18 6M6 6l12 12" />,
}

const MERCHANT_ICONS = {
  'Netflix':          Icons.film,
  'Salary Deposit':   Icons.briefcase,
  'BigBasket':        Icons.cart,
  'Ola':              Icons.car,
  'Freelance Pay':    Icons.laptop,
  'Café Coffee Day':  Icons.coffee,
  'Flipkart':         Icons.package,
  'Cult.fit':         Icons.dumbbell,
  'Dividend':         Icons.dividend,
  'Spotify':          Icons.music,
  'BESCOM Bill':      Icons.zap,
  'Swiggy':           Icons.pizza,
  'Rent':             Icons.home,
  'Side Project':     Icons.rocket,
  'Apollo Pharmacy':  Icons.pill,
  'Zomato':           Icons.pizza,
  'MakeMyTrip':       Icons.plane,
  'LIC Premium':      Icons.shield,
  'Zerodha Gains':    Icons.zerodha,
  'BookMyShow':       Icons.ticket,
  'Amazon':           Icons.package,
}

const getMerchantIcon = (merchant, size = 16) => {
  const fn = MERCHANT_ICONS[merchant] || Icons.creditCard
  return fn(size)
}

// ── CREDIT CARD VISUAL ─────────────────────────────────
function CreditCardVisual({ card, offsetIndex, isSelected, onClick, isFiltered }) {
  const offsets = [
    { tx: 0,   ty: 0,   scale: 1,    opacity: 1,    zIndex: 10 },
    { tx: 48,  ty: -14, scale: 0.9,  opacity: 0.85, zIndex: 5  },
    { tx: 84,  ty: -24, scale: 0.82, opacity: 0.65, zIndex: 2  },
  ]
  const pos = offsets[offsetIndex] || { tx: 108, ty: -32, scale: 0.75, opacity: 0.3, zIndex: 0 }

  const NetworkEl = () => {
    if (card.network === 'visa') return (
      <svg width="32" height="10" viewBox="0 0 750 260" fill="none">
        <path d="M278.2 175.3L300 86.9h35.9l-21.8 88.4zm156.7-85.7c-7.1-2.6-18.3-5.4-32.2-5.4-35.5 0-60.5 17.7-60.7 43.1-.2 18.7 17.8 29.2 31.4 35.4 13.9 6.4 18.6 10.5 18.5 16.2-.1 8.7-11.1 12.7-21.4 12.7-14.3 0-21.9-2-33.6-7l-4.6-2.1-5 29c8.3 3.6 23.7 6.8 39.6 7 37.3 0 61.5-17.4 61.8-44.4.1-14.8-9.4-26-30-35.2-12.5-6-20.1-10-20.1-16.1.1-5.5 6.5-11.3 20.6-11.3 11.8-.2 20.3 2.4 27 5l3.2 1.5zm91.2-3.2h-27.7c-8.6 0-15 2.3-18.7 10.8l-53.2 119.8h37.6l7.5-19.5h45.9l4.4 19.5h33.2zm-44.2 82.6l14-35.5 3.1-7.9 2.2 9 7.2 34.4zm-321-82.6l-35.2 60.3-3.8-18.3c-6.5-20.8-26.9-43.4-49.6-54.7l32.2 114.9 37.9 0 56.4-102.2h-38z" fill="rgba(255,255,255,0.92)" />
      </svg>
    )
    if (card.network === 'mc') return (
      <div style={{ display: 'flex' }}>
        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#eb001b', marginRight: -5, zIndex: 1 }} />
        <div style={{ width: 16, height: 16, borderRadius: '50%', background: '#f79e1b', opacity: 0.9 }} />
      </div>
    )
    return <span style={{ fontSize: 9, color: 'rgba(255,255,255,0.9)', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>{card.network}</span>
  }

  return (
    <div
      onClick={onClick}
      style={{
        position: 'absolute', width: 220, height: 126, borderRadius: 14,
        background: card.bg,
        border: isSelected
          ? (isFiltered ? '2px solid rgba(255,255,255,0.7)' : '1.5px solid rgba(255,255,255,0.4)')
          : '1px solid rgba(255,255,255,0.15)',
        transform: `translateX(${pos.tx}px) translateY(${pos.ty}px) scale(${pos.scale})`,
        opacity: pos.opacity, zIndex: pos.zIndex,
        cursor: isSelected ? 'default' : 'pointer',
        transition: 'transform 0.38s cubic-bezier(0.22,1,0.36,1), opacity 0.3s ease, border 0.2s',
        overflow: 'hidden', transformOrigin: 'left center',
        boxShadow: isSelected && isFiltered ? `0 0 0 3px ${card.color || '#fff'}44` : 'none',
      }}
    >
      {isFiltered && isSelected && (
        <div style={{ position: 'absolute', top: 8, right: 10, zIndex: 20, background: 'rgba(255,255,255,0.25)', borderRadius: 20, padding: '2px 8px', fontSize: 8, color: '#fff', fontWeight: 700, letterSpacing: '0.06em', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.3)' }}>
          FILTERING
        </div>
      )}
      <div style={{ position: 'absolute', inset: 0, borderRadius: 14, background: 'linear-gradient(135deg,rgba(255,255,255,0.12) 0%,transparent 55%)', pointerEvents: 'none' }} />
      <div style={{ position: 'relative', zIndex: 2, padding: '12px 14px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>{card.bank}</div>
          <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.55)', marginTop: 1 }}>{card.type}</div>
        </div>
        <div>
          <div style={{ width: 24, height: 18, borderRadius: 3, background: 'rgba(220,190,80,0.88)', display: 'grid', gridTemplateColumns: '1fr 1fr', gridTemplateRows: '1fr 1fr 1fr', gap: 1.5, padding: '2px 3px', marginBottom: 5 }}>
            {[...Array(6)].map((_, i) => <div key={i} style={{ background: 'rgba(160,120,0,0.5)', borderRadius: 1, gridColumn: (i === 0 || i === 4) ? '1/-1' : undefined }} />)}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.82)', letterSpacing: '0.16em', fontVariantNumeric: 'tabular-nums' }}>{card.number}</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
          <div>
            <div style={{ fontSize: 8, color: 'rgba(255,255,255,0.65)', textTransform: 'uppercase', letterSpacing: '0.07em' }}>{card.holder}</div>
            <div style={{ fontSize: 7, color: 'rgba(255,255,255,0.45)', marginTop: 1 }}>EXP {card.expiry}</div>
          </div>
          <NetworkEl />
        </div>
      </div>
    </div>
  )
}

// ── CARD STACK SWITCHER ────────────────────────────────
function CardStackSwitcher({ selectedCardId, onSelectCard, creditCards, filteredCardId, onToggleCardFilter }) {
  const selectedIndex = creditCards.findIndex(c => c.id === selectedCardId)
  const handlePrev = () => { if (selectedIndex > 0) onSelectCard(creditCards[selectedIndex - 1].id) }
  const handleNext = () => { if (selectedIndex < creditCards.length - 1) onSelectCard(creditCards[selectedIndex + 1].id) }

  const displayOrder = creditCards
    .map((card, i) => ({ card, offset: i - selectedIndex, isSelected: i === selectedIndex }))
    .filter(({ offset }) => offset >= 0)
    .sort((a, b) => a.offset - b.offset)

  const selectedCard = creditCards.find(c => c.id === selectedCardId)
  const isCurrentFiltered = filteredCardId === selectedCardId

  return (
    <div>
      <div style={{ position: 'relative', height: 136, marginBottom: '0.6rem' }}>
        {displayOrder.map(({ card, offset, isSelected }) => (
          <CreditCardVisual
            key={card.id}
            card={card}
            offsetIndex={offset}
            isSelected={isSelected}
            isFiltered={isCurrentFiltered && isSelected}
            onClick={() => !isSelected ? onSelectCard(card.id) : onToggleCardFilter(card.id)}
          />
        ))}
      </div>

      {/* Card filter hint */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>card {selectedIndex + 1} of {creditCards.length}</span>
          <div style={{ display: 'flex', gap: 3 }}>
            {creditCards.map((c, i) => (
              <div key={c.id} onClick={() => onSelectCard(c.id)}
                style={{ height: 4, borderRadius: 2, width: i === selectedIndex ? 14 : 4, background: i === selectedIndex ? 'var(--text-secondary)' : 'var(--border)', cursor: 'pointer', transition: 'all 0.2s' }} />
            ))}
          </div>
          <div style={{ display: 'flex', gap: 3 }}>
            {[{ fn: handlePrev, icon: Icons.chevLeft(11), disabled: selectedIndex === 0 },
              { fn: handleNext, icon: Icons.chevRight(11), disabled: selectedIndex === creditCards.length - 1 }
            ].map(({ fn, icon, disabled }, i) => (
              <button key={i} onClick={fn} disabled={disabled}
                style={{ width: 20, height: 20, borderRadius: '50%', border: '1px solid var(--border)', background: 'var(--bg-card)', color: disabled ? 'var(--border)' : 'var(--text-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: disabled ? 'default' : 'pointer', transition: 'all 0.15s' }}>
                {icon}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Click-to-filter button */}
      {selectedCard && (
        <button
          onClick={() => onToggleCardFilter(selectedCardId)}
          style={{
            width: '100%', padding: '0.45rem 0.75rem', borderRadius: 10, cursor: 'pointer', fontSize: '0.72rem', fontFamily: 'inherit',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, transition: 'all 0.2s',
            background: isCurrentFiltered ? (selectedCard.color || '#6366f1') + '20' : 'var(--bg-secondary)',
            border: isCurrentFiltered ? `1px solid ${selectedCard.color || '#6366f1'}60` : '1px solid var(--border)',
            color: isCurrentFiltered ? (selectedCard.color || '#6366f1') : 'var(--text-muted)',
            fontWeight: isCurrentFiltered ? 600 : 400,
          }}
        >
          {Icons.filter(12)}
          {isCurrentFiltered
            ? `Showing ${selectedCard.bank} transactions`
            : `Filter by ${selectedCard.bank}`}
          {isCurrentFiltered && (
            <span style={{ marginLeft: 4, display: 'flex', alignItems: 'center', opacity: 0.7 }}>{Icons.x(11)}</span>
          )}
        </button>
      )}
    </div>
  )
}

// ── TRANSACTION DETAIL MODAL ───────────────────────────
function TxDetailModal({ tx, allTransactions, onClose, isAdmin, onDelete }) {
  const color = CAT_COLORS[tx.category] || '#888'
  const merchantHistory = allTransactions.filter(t => t.merchant === tx.merchant).sort((a, b) => a.date > b.date ? 1 : -1)
  const catTransactions = allTransactions.filter(t => t.category === tx.category && t.id !== tx.id).slice(0, 5)
  const totalSpentMerchant = merchantHistory.reduce((s, t) => s + Math.abs(t.amount), 0)
  const avgPerVisit = totalSpentMerchant / merchantHistory.length
  const monthlySpend = merchantHistory.reduce((acc, t) => { const m = t.date.slice(0, 7); acc[m] = (acc[m] || 0) + Math.abs(t.amount); return acc }, {})
  const monthlyArr = Object.entries(monthlySpend).map(([month, val]) => ({ month: month.slice(5), val }))
  const maxMonthly = Math.max(...monthlyArr.map(m => m.val), 1)
  const handleDelete = () => { onDelete(tx.id); onClose() }

  return (
    <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'flex-end', backdropFilter: 'blur(3px)' }}>
      <style>{`@keyframes slideIn{from{transform:translateX(100%);opacity:0}to{transform:translateX(0);opacity:1}} .hist-row:hover{background:var(--bg-secondary)!important;border-radius:8px} .detail-panel::-webkit-scrollbar{width:4px} .detail-panel::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}`}</style>
      <div className="detail-panel" onClick={e => e.stopPropagation()} style={{ width: 400, height: '100vh', background: 'var(--bg-card)', borderLeft: '1px solid var(--border)', overflowY: 'auto', display: 'flex', flexDirection: 'column', animation: 'slideIn 0.25s cubic-bezier(0.22,1,0.36,1)' }}>

        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', position: 'sticky', top: 0, background: 'var(--bg-card)', zIndex: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ width: 42, height: 42, borderRadius: 11, background: color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>{getMerchantIcon(tx.merchant, 20)}</div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{tx.merchant}</div>
              <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 2 }}>{tx.category}</div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', padding: '4px 8px', borderRadius: 8, display: 'flex', alignItems: 'center' }}>{Icons.close(16)}</button>
        </div>

        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)', background: color + '08' }}>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Transaction amount</div>
          <div style={{ fontSize: '1.8rem', fontWeight: 700, color: tx.type === 'income' ? '#4CAF50' : '#F44336' }}>{tx.type === 'income' ? '+' : '−'}{INR(tx.amount)}</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: '0.65rem' }}>
            {[{ label: tx.date }, { label: tx.type === 'income' ? 'Income' : 'Expense', color: tx.type === 'income' ? '#4CAF50' : '#F44336', bg: tx.type === 'income' ? '#4CAF5018' : '#F4433618' }, { label: tx.category, color, bg: color + '18' }].map((pill, i) => (
              <span key={i} style={{ fontSize: '0.7rem', padding: '3px 9px', borderRadius: 20, background: pill.bg || 'var(--bg-secondary)', color: pill.color || 'var(--text-secondary)', border: pill.bg ? 'none' : '1px solid var(--border)' }}>{pill.label}</span>
            ))}
          </div>
          {isAdmin && (
            <button onClick={handleDelete} style={{ marginTop: '0.8rem', padding: '0.4rem 1rem', borderRadius: 10, border: '1px solid #F44336', background: 'transparent', color: '#F44336', cursor: 'pointer', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: 6 }}
              onMouseEnter={e => { e.currentTarget.style.background = '#F44336'; e.currentTarget.style.color = '#fff' }}
              onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#F44336' }}>
              {Icons.delete(14)} Delete this transaction
            </button>
          )}
        </div>

        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>Merchant summary</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
            {[{ label: 'Total visits', value: merchantHistory.length }, { label: 'Total spent', value: INR_SHORT(totalSpentMerchant) }, { label: 'Avg per visit', value: INR_SHORT(avgPerVisit) }].map(s => (
              <div key={s.label} style={{ background: 'var(--bg-secondary)', borderRadius: 9, padding: '0.6rem 0.7rem', border: '1px solid var(--border)' }}>
                <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)', marginBottom: 3 }}>{s.label}</div>
                <div style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        {monthlyArr.length > 1 && (
          <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.8rem' }}>Monthly spend — {tx.merchant}</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 6, height: 80 }}>
              {monthlyArr.map((m, i) => {
                const h = Math.round((m.val / maxMonthly) * 56)
                const isCurrent = tx.date.slice(5, 7) === m.month
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, height: '100%', justifyContent: 'flex-end' }}>
                    <div style={{ fontSize: '0.55rem', color: 'var(--text-muted)', marginBottom: 2 }}>{INR_SHORT(m.val)}</div>
                    <div style={{ width: '100%', height: Math.max(h, 4), borderRadius: '3px 3px 0 0', background: isCurrent ? color : color + '44' }} />
                    <div style={{ fontSize: '0.58rem', color: isCurrent ? color : 'var(--text-muted)', fontWeight: isCurrent ? 700 : 400 }}>{m.month}</div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        <div style={{ padding: '1rem 1.25rem', borderBottom: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>All transactions with {tx.merchant} ({merchantHistory.length})</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {[...merchantHistory].reverse().map(t => {
              const isCurrent = t.id === tx.id
              return (
                <div key={t.id} className="hist-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.5rem', background: isCurrent ? color + '12' : 'transparent', border: isCurrent ? `1px solid ${color}35` : '1px solid transparent', borderRadius: 7 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <div style={{ width: 26, height: 26, borderRadius: 7, background: isCurrent ? color + '25' : 'var(--bg-secondary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: isCurrent ? color : 'var(--text-muted)', flexShrink: 0 }}>{getMerchantIcon(t.merchant, 12)}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)', fontWeight: isCurrent ? 600 : 400 }}>
                      {t.date}
                      {isCurrent && <span style={{ marginLeft: 5, fontSize: '0.58rem', color, fontWeight: 700, background: color + '15', padding: '1px 5px', borderRadius: 9 }}>current</span>}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 600, color: t.type === 'income' ? '#4CAF50' : '#F44336' }}>{t.type === 'income' ? '+' : '−'}{INR(t.amount)}</div>
                </div>
              )
            })}
          </div>
        </div>

        {catTransactions.length > 0 && (
          <div style={{ padding: '1rem 1.25rem' }}>
            <div style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.65rem' }}>Other {tx.category} transactions</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 5 }}>
              {catTransactions.map(t => (
                <div key={t.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0.55rem', borderRadius: 7, border: '1px solid var(--border)', background: 'var(--bg-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
                    <span style={{ color: CAT_COLORS[t.category] || '#888', display: 'flex' }}>{getMerchantIcon(t.merchant, 13)}</span>
                    <div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>{t.merchant}</div>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t.date}</div>
                    </div>
                  </div>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: t.type === 'income' ? '#4CAF50' : '#F44336' }}>{t.type === 'income' ? '+' : '−'}{INR(t.amount)}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ── ADD TRANSACTION MODAL ──────────────────────────────
function AddTransactionModal({ onClose, onAdd, creditCards }) {
  const [form, setForm] = useState({
    merchant: '', category: 'Food & Drink', type: 'expense',
    amount: '', date: new Date().toISOString().split('T')[0],
    cardId: creditCards[0]?.id || 'visa',
  })
  const handle = e => setForm({ ...form, [e.target.name]: e.target.value })
  const submit = (e) => {
    e.preventDefault()
    if (!form.merchant || !form.amount) return
    const amt = parseFloat(form.amount)
    onAdd({ id: Date.now(), date: form.date, merchant: form.merchant, category: form.category, type: form.type, cardId: form.cardId, amount: form.type === 'income' ? amt : -Math.abs(amt) })
    onClose()
  }
  const selectedCard = creditCards.find(c => c.id === form.cardId)

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal" onClick={e => e.stopPropagation()} style={{ maxWidth: 440 }}>
        <h2 className="modal-title">Add Transaction</h2>
        {selectedCard && (
          <div style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: 10, padding: '9px 12px', borderRadius: 11, background: selectedCard.bg, border: '1px solid rgba(255,255,255,0.15)' }}>
            <div style={{ width: 28, height: 18, borderRadius: 3, background: 'rgba(220,190,80,0.88)', flexShrink: 0 }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'rgba(255,255,255,0.95)' }}>{selectedCard.bank} · {selectedCard.type}</div>
              <div style={{ fontSize: 9, color: 'rgba(255,255,255,0.6)', marginTop: 1 }}>{selectedCard.number}</div>
            </div>
            <span style={{ fontSize: 9, fontWeight: 600, color: 'rgba(255,255,255,0.8)', textTransform: 'uppercase' }}>{selectedCard.network}</span>
          </div>
        )}
        <form onSubmit={submit}>
          <div className="form-group">
            <label className="form-label">Merchant / Description</label>
            <input className="form-input" name="merchant" placeholder="e.g. Swiggy" value={form.merchant} onChange={handle} required />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Amount (₹)</label>
              <input className="form-input" name="amount" type="number" placeholder="0.00" min="0" step="0.01" value={form.amount} onChange={handle} required />
            </div>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input className="form-input" name="date" type="date" value={form.date} onChange={handle} />
            </div>
          </div>
          <div className="form-row">
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-input filter-select" name="category" value={form.category} onChange={handle} style={{ width: '100%' }}>
                {['Groceries','Food & Drink','Entertainment','Transport','Shopping','Health','Utilities','Housing','Travel','Insurance','Other'].map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Type</label>
              <select className="form-input filter-select" name="type" value={form.type} onChange={handle} style={{ width: '100%' }}>
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
            </div>
          </div>
          <div className="form-group">
            <label className="form-label">Charge to card</label>
            <select className="form-input filter-select" name="cardId" value={form.cardId} onChange={handle} style={{ width: '100%' }}>
              {creditCards.map(c => <option key={c.id} value={c.id}>{c.bank} — {c.type} ({c.number.slice(-4)})</option>)}
            </select>
          </div>
          <div className="modal-actions">
            <button type="button" className="btn-cancel" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-submit">Add Transaction</button>
          </div>
        </form>
      </div>
    </div>
  )
}

// ── TRANSACTION CARD ───────────────────────────────────
function TxCard({ tx, isAdmin, onDelete, onClick, creditCards }) {
  const color = CAT_COLORS[tx.category] || '#888'
  const barWidth = Math.min(100, (Math.abs(tx.amount) / 150000) * 100).toFixed(0)
  const cardInfo = creditCards.find(c => c.id === tx.cardId)

  return (
    <div
      onClick={() => onClick(tx)}
      style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 13, padding: '0.85rem', display: 'flex', flexDirection: 'column', gap: 8, transition: 'border-color 0.2s, transform 0.15s, box-shadow 0.2s', cursor: 'pointer' }}
      onMouseEnter={e => { e.currentTarget.style.borderColor = color; e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = `0 6px 20px ${color}22` }}
      onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = 'none' }}
    >
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 9, minWidth: 0, flex: 1 }}>
          <div style={{ width: 34, height: 34, borderRadius: 9, background: color + '18', display: 'flex', alignItems: 'center', justifyContent: 'center', color, flexShrink: 0 }}>{getMerchantIcon(tx.merchant, 15)}</div>
          <div style={{ minWidth: 0 }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-primary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.merchant}</div>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 1 }}>{tx.date}</div>
          </div>
        </div>
        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: tx.type === 'income' ? '#4CAF50' : '#F44336', flexShrink: 0, marginLeft: 8 }}>{tx.type === 'income' ? '+' : '−'}{INR(tx.amount)}</div>
      </div>
      <div style={{ height: 2.5, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
        <div style={{ height: '100%', width: barWidth + '%', background: color, borderRadius: 2 }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexWrap: 'wrap' }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
          <span style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', background: 'var(--bg-secondary)', padding: '2px 6px', borderRadius: 18, border: '1px solid var(--border)' }}>{tx.category}</span>
          {cardInfo && <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: 18, background: cardInfo.color + '15', color: cardInfo.color, border: `1px solid ${cardInfo.color}30` }}>{cardInfo.bank}</span>}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <span style={{ fontSize: '0.6rem', padding: '2px 6px', borderRadius: 18, fontWeight: 600, background: tx.type === 'income' ? '#4CAF5018' : '#F4433618', color: tx.type === 'income' ? '#4CAF50' : '#F44336', display: 'flex', alignItems: 'center', gap: 2 }}>
            {tx.type === 'income' ? Icons.income(8) : Icons.expense(8)}{tx.type}
          </span>
          {isAdmin && (
            <button onClick={e => { e.stopPropagation(); onDelete(tx.id) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#F44336', padding: '2px 4px', borderRadius: 5, opacity: 0.7, display: 'flex', alignItems: 'center', gap: 2, fontSize: '0.68rem' }}
              onMouseEnter={e => e.currentTarget.style.opacity = 1} onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
              {Icons.delete(10)} Del
            </button>
          )}
        </div>
      </div>
      <div style={{ fontSize: '0.58rem', color: 'var(--text-muted)', textAlign: 'center', opacity: 0.5, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 3 }}>
        Click to view history
        <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6m4-3h6v6m-11 5L21 3"/></svg>
      </div>
    </div>
  )
}

// ── LEFT PANEL SUB-COMPONENTS ──────────────────────────
function IncomeHeroCard({ totalIncome }) {
  return (
    <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '0.85rem 1rem 0.4rem', marginBottom: '0.55rem', overflow: 'hidden', position: 'relative' }}>
      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginBottom: 2 }}>Income</div>
      <div style={{ fontSize: '1.35rem', fontWeight: 700, color: '#4CAF50' }}>+{INR_SHORT(totalIncome)}</div>
      <div style={{ marginTop: 2, marginLeft: -6, marginRight: -6 }}>
        <ResponsiveContainer width="100%" height={44}>
          <LineChart data={SPARKLINE_DATA} margin={{ top: 3, right: 0, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="sparkGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#4CAF50" stopOpacity={0.4} />
                <stop offset="100%" stopColor="#4CAF50" stopOpacity={1} />
              </linearGradient>
            </defs>
            <Line type="monotone" dataKey="v" stroke="url(#sparkGrad)" strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  )
}

function StatsRow({ totalIncome, totExpense, savings }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 5, marginBottom: '0.55rem' }}>
      {[
        { label: 'Income',   value: INR_SHORT(totalIncome),  color: 'var(--text-primary)' },
        { label: 'Expenses', value: INR_SHORT(totExpense),   color: 'var(--text-primary)' },
        { label: 'Net',      value: INR_SHORT(savings),      color: savings >= 0 ? '#4CAF50' : '#F44336' },
      ].map(s => (
        <div key={s.label} style={{ background: 'var(--bg-secondary)', borderRadius: 9, padding: '6px 8px', border: '1px solid var(--border)' }}>
          <div style={{ fontSize: '0.6rem', color: 'var(--text-muted)', marginBottom: 2 }}>{s.label}</div>
          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: s.color }}>{s.value}</div>
        </div>
      ))}
    </div>
  )
}

function LatestIncomeRow({ transactions, cardId, creditCards }) {
  const cardTx = transactions.filter(t => t.cardId === cardId)
  const latestInc = cardTx.find(t => t.type === 'income')
  const card = creditCards.find(c => c.id === cardId)
  if (!latestInc || !card) return null
  return (
    <div style={{ background: 'var(--bg-secondary)', borderRadius: 11, padding: '9px 11px', display: 'flex', alignItems: 'center', gap: 9, border: '1px solid var(--border)', marginBottom: '0.55rem' }}>
      <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#E1F5EE', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#1D9E75', flexShrink: 0 }}>
        {getMerchantIcon(latestInc.merchant, 15)}
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#4CAF50' }}>+{INR(latestInc.amount)}</div>
        <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{latestInc.merchant}</div>
      </div>
      <div style={{ fontSize: '0.6rem', padding: '2px 7px', borderRadius: 18, background: card.color + '18', color: card.color, border: `1px solid ${card.color}35`, fontWeight: 600, flexShrink: 0 }}>
        {card.bank}
      </div>
    </div>
  )
}

// ── CARD FILTER BANNER ─────────────────────────────────
function CardFilterBanner({ card, count, onClear }) {
  if (!card) return null
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 8, padding: '0.5rem 0.8rem', borderRadius: 9, marginBottom: '0.65rem',
      background: card.color + '12', border: `1px solid ${card.color}35`,
    }}>
      <div style={{ width: 8, height: 8, borderRadius: '50%', background: card.color, flexShrink: 0 }} />
      <span style={{ flex: 1, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
        Showing <strong style={{ color: card.color }}>{count}</strong> transactions from <strong style={{ color: 'var(--text-primary)' }}>{card.bank} {card.type}</strong>
      </span>
      <button
        onClick={onClear}
        style={{ display: 'flex', alignItems: 'center', gap: 3, padding: '2px 8px', borderRadius: 14, border: `1px solid ${card.color}50`, background: card.color + '18', color: card.color, cursor: 'pointer', fontSize: '0.65rem', fontWeight: 600, fontFamily: 'inherit' }}
      >
        {Icons.x(10)} Clear
      </button>
    </div>
  )
}

// ── TRANSACTIONS PAGE ──────────────────────────────────
export default function Transactions({ isAdmin, transactions, setTransactions, creditCards: creditCardsProp }) {
  const [search, setSearch]           = useState('')
  const [filterCat, setFilterCat]     = useState('All')
  const [filterType, setFilterType]   = useState('All')
  const [filterAmt, setFilterAmt]     = useState('All')
  const [sortOption, setSortOption]   = useState('date-desc')
  const [txView, setTxView]           = useState('cards')
  const [showModal, setShowModal]     = useState(false)
  const [selectedTx, setSelectedTx]   = useState(null)
  const [selectedCardId, setSelectedCardId] = useState(null)
  // NEW: card filter for transactions panel
  const [filteredCardId, setFilteredCardId] = useState(null)

  const txList      = transactions || INITIAL_TRANSACTIONS
  const setTxList   = setTransactions || (() => {})
  const creditCards = creditCardsProp || []

  const activeCardId = selectedCardId || creditCards[0]?.id

  const totalIncome = txList.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const totExpense  = Math.abs(txList.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0))
  const savings     = totalIncome - totExpense

  const cardIncome  = txList.filter(t => t.cardId === activeCardId && t.type === 'income').reduce((s, t) => s + t.amount, 0)
  const cardExpense = Math.abs(txList.filter(t => t.cardId === activeCardId && t.type === 'expense').reduce((s, t) => s + t.amount, 0))
  const cardNet     = cardIncome - cardExpense

  // Toggle card filter: clicking active card's filter button toggles it
  const handleToggleCardFilter = (cardId) => {
    setFilteredCardId(prev => prev === cardId ? null : cardId)
  }

  const filteredTx = useMemo(() => {
    let tx = [...txList]
    // Card filter (from clicking card)
    if (filteredCardId) tx = tx.filter(t => t.cardId === filteredCardId)
    // Other filters
    if (search) tx = tx.filter(t => t.merchant.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))
    if (filterCat !== 'All')  tx = tx.filter(t => t.category === filterCat)
    if (filterType !== 'All') tx = tx.filter(t => t.type === filterType)
    if (filterAmt !== 'All') {
      const abs = t => Math.abs(t.amount)
      if (filterAmt === '0-500')        tx = tx.filter(t => abs(t) <= 500)
      if (filterAmt === '500-2000')     tx = tx.filter(t => abs(t) > 500 && abs(t) <= 2000)
      if (filterAmt === '2000-10000')   tx = tx.filter(t => abs(t) > 2000 && abs(t) <= 10000)
      if (filterAmt === '10000-100000') tx = tx.filter(t => abs(t) > 10000 && abs(t) <= 100000)
      if (filterAmt === '100000+')      tx = tx.filter(t => abs(t) > 100000)
    }
    const [sf, sd] = sortOption.split('-')
    tx.sort((a, b) => {
      let va, vb
      if (sf === 'date')        { va = a.date; vb = b.date }
      else if (sf === 'amount') { va = Math.abs(a.amount); vb = Math.abs(b.amount) }
      else                      { va = a.merchant.toLowerCase(); vb = b.merchant.toLowerCase() }
      if (va < vb) return sd === 'asc' ? -1 : 1
      if (va > vb) return sd === 'asc' ? 1 : -1
      return 0
    })
    return tx
  }, [txList, search, filterCat, filterType, filterAmt, sortOption, filteredCardId])

  const addTransaction    = (tx) => setTxList(prev => [tx, ...prev])
  const deleteTransaction = (id) => setTxList(prev => prev.filter(t => t.id !== id))

  const exportCSV = () => {
    const rows = [['Date','Merchant','Category','Type','Amount (INR)','Card'], ...filteredTx.map(t => [t.date, t.merchant, t.category, t.type, Math.abs(t.amount), t.cardId])]
    const csv = rows.map(r => r.join(',')).join('\n')
    const a = document.createElement('a'); a.href = 'data:text/csv,' + encodeURIComponent(csv); a.download = 'fintara_transactions.csv'; a.click()
  }

  const filteredCard = filteredCardId ? creditCards.find(c => c.id === filteredCardId) : null

  return (
    <>
      <style>{`
        @media (max-width: 1100px) {
          .tx-page-grid { grid-template-columns: 240px 1fr !important; }
          .tx-card-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 860px) {
          .tx-page-grid { grid-template-columns: 1fr !important; }
          .tx-left-panel { position: static !important; }
          .tx-card-grid { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 560px) {
          .tx-card-grid { grid-template-columns: 1fr !important; }
          .tx-filter-bar { flex-direction: column !important; }
        }
      `}</style>

      <div className="tx-page-grid" style={{ display: 'grid', gridTemplateColumns: '256px 1fr', gap: '1rem', alignItems: 'start' }}>

        {/* ── LEFT PANEL ── */}
        <div className="tx-left-panel" style={{ position: 'sticky', top: 0 }}>
          <IncomeHeroCard totalIncome={cardIncome || totalIncome} />
          <StatsRow totalIncome={cardIncome || totalIncome} totExpense={cardExpense || totExpense} savings={cardNet || savings} />

          {/* Card stack */}
          <div style={{ background: 'var(--bg-card)', border: '1px solid var(--border)', borderRadius: 14, padding: '0.9rem', marginBottom: '0.55rem' }}>
            {creditCards.length > 0
              ? (
                <CardStackSwitcher
                  selectedCardId={activeCardId}
                  onSelectCard={setSelectedCardId}
                  creditCards={creditCards}
                  filteredCardId={filteredCardId}
                  onToggleCardFilter={handleToggleCardFilter}
                />
              )
              : (
                <div style={{ textAlign: 'center', padding: '1.5rem 0', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  {isAdmin
                    ? <span>No cards yet. Use <strong>Add Card</strong> in the sidebar.</span>
                    : 'No cards linked.'}
                </div>
              )
            }
          </div>

          <LatestIncomeRow transactions={txList} cardId={activeCardId} creditCards={creditCards} />
          <StatsRow totalIncome={cardIncome} totExpense={cardExpense} savings={cardNet} />

          {!isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '9px 12px', borderRadius: 9, background: 'var(--bg-secondary)', border: '1px solid var(--border)', fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
              {Icons.lock(13)} Switch to Admin to add or delete transactions.
            </div>
          )}
        </div>

        {/* ── RIGHT PANEL ── */}
        <div style={{ minWidth: 0 }}>
          {/* Card filter banner */}
          <CardFilterBanner card={filteredCard} count={filteredTx.length} onClear={() => setFilteredCardId(null)} />

          {/* Filter bar */}
          <div className="tx-filter-bar" style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap', marginBottom: '0.65rem', alignItems: 'center' }}>
            <div className="search-box" style={{ flex: '1 1 160px', minWidth: 130 }}>
              <span style={{ color: 'var(--text-muted)', display: 'flex' }}>{Icons.search(13)}</span>
              <input placeholder="Search merchant or category…" value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="filter-select" value={filterCat} onChange={e => setFilterCat(e.target.value)}>{CATEGORIES.map(c => <option key={c}>{c}</option>)}</select>
            <select className="filter-select" value={filterType} onChange={e => setFilterType(e.target.value)}>
              <option value="All">All Types</option><option value="income">Income</option><option value="expense">Expense</option>
            </select>
            <select className="filter-select" value={filterAmt} onChange={e => setFilterAmt(e.target.value)}>
              <option value="All">Any Amount</option><option value="0-500">Under ₹500</option><option value="500-2000">₹500–₹2K</option>
              <option value="2000-10000">₹2K–₹10K</option><option value="10000-100000">₹10K–₹1L</option><option value="100000+">Above ₹1L</option>
            </select>
            <select className="filter-select" value={sortOption} onChange={e => setSortOption(e.target.value)}>
              <option value="date-desc">Newest First</option><option value="date-asc">Oldest First</option>
              <option value="amount-desc">Highest Amount</option><option value="amount-asc">Lowest Amount</option>
              <option value="merchant-asc">Merchant A–Z</option>
            </select>
          </div>

          {/* Toolbar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.65rem', flexWrap: 'wrap', gap: 6 }}>
            <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', margin: 0 }}>
              Showing {filteredTx.length} of {txList.length} transactions
              {filteredCardId && filteredCard && <span style={{ marginLeft: 6, color: filteredCard.color, fontWeight: 600 }}>· {filteredCard.bank}</span>}
              {txView === 'cards' && !filteredCardId && <span style={{ marginLeft: 5, opacity: 0.6 }}>— click card to filter</span>}
            </p>
            <div style={{ display: 'flex', gap: 5, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: 3 }}>
                {[{ v: 'cards', icon: Icons.grid(12), label: 'Cards' }, { v: 'table', icon: Icons.list(12), label: 'Table' }].map(({ v, icon, label }) => (
                  <button key={v} onClick={() => setTxView(v)} style={{ padding: '0.28rem 0.7rem', fontSize: '0.72rem', borderRadius: 7, border: '1px solid var(--border)', cursor: 'pointer', fontFamily: 'var(--font-body)', background: txView === v ? 'var(--text-primary)' : 'var(--bg-card)', color: txView === v ? 'var(--bg-card)' : 'var(--text-muted)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 4 }}>{icon} {label}</button>
                ))}
              </div>
              <button className="btn-ghost" style={{ fontSize: '0.72rem', padding: '0.28rem 0.8rem', display: 'flex', alignItems: 'center', gap: 4 }} onClick={exportCSV}>{Icons.download(12)} Export CSV</button>
              {isAdmin
                ? (
                  <button className="btn-primary" onClick={() => setShowModal(true)} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: '0.74rem', padding: '0.28rem 0.8rem' }}>
                    {Icons.addTx(13)} Add Transaction
                  </button>
                )
                : (
                  <button disabled title="Switch to Admin mode to add transactions"
                    style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '0.28rem 0.8rem', fontSize: '0.74rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-muted)', cursor: 'not-allowed', opacity: 0.55, fontFamily: 'var(--font-body)' }}>
                    {Icons.lock(12)} Add Transaction
                  </button>
                )
              }
            </div>
          </div>

          {/* Transaction list */}
          {filteredTx.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-icon" style={{ display: 'flex', justifyContent: 'center', color: 'var(--text-muted)' }}>{Icons.inbox(36)}</div>
              <p className="empty-state-text">No transactions match your filters.</p>
              {filteredCardId && (
                <button onClick={() => setFilteredCardId(null)} style={{ marginTop: 8, padding: '0.35rem 1rem', borderRadius: 8, border: '1px solid var(--border)', background: 'var(--bg-secondary)', color: 'var(--text-secondary)', cursor: 'pointer', fontSize: '0.76rem', fontFamily: 'inherit' }}>
                  Clear card filter
                </button>
              )}
            </div>
          ) : txView === 'cards' ? (
            <div className="tx-card-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, minmax(0, 1fr))', gap: '0.55rem' }}>
              {filteredTx.map(tx => <TxCard key={tx.id} tx={tx} isAdmin={isAdmin} onDelete={deleteTransaction} onClick={setSelectedTx} creditCards={creditCards} />)}
            </div>
          ) : (
            <div style={{ overflowX: 'auto' }}>
              <table className="tx-table" style={{ tableLayout: 'auto', width: '100%' }}>
                <thead><tr><th>Merchant</th><th>Category</th><th>Date</th><th>Card</th><th>Type</th><th style={{ textAlign: 'right' }}>Amount</th>{isAdmin && <th>Actions</th>}</tr></thead>
                <tbody>
                  {filteredTx.map(tx => {
                    const cardInfo = creditCards.find(c => c.id === tx.cardId)
                    return (
                      <tr key={tx.id} onClick={() => setSelectedTx(tx)} style={{ cursor: 'pointer' }}>
                        <td>
                          <div className="tx-merchant">
                            <div className="tx-avatar" style={{ color: CAT_COLORS[tx.category] || '#888', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{getMerchantIcon(tx.merchant, 14)}</div>
                            <div><div className="tx-merchant-name">{tx.merchant}</div><div className="tx-merchant-cat">{tx.category}</div></div>
                          </div>
                        </td>
                        <td><span style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}><span style={{ width: 7, height: 7, borderRadius: '50%', background: CAT_COLORS[tx.category] || '#888', display: 'inline-block' }} />{tx.category}</span></td>
                        <td style={{ whiteSpace: 'nowrap' }}>{tx.date}</td>
                        <td>{cardInfo && <span style={{ fontSize: '0.68rem', padding: '2px 7px', borderRadius: 18, background: cardInfo.color + '15', color: cardInfo.color, border: `1px solid ${cardInfo.color}30`, whiteSpace: 'nowrap' }}>{cardInfo.bank}</span>}</td>
                        <td><span className={`type-badge ${tx.type}`} style={{ display: 'inline-flex', alignItems: 'center', gap: 3 }}>{tx.type === 'income' ? Icons.income(9) : Icons.expense(9)}{tx.type}</span></td>
                        <td style={{ textAlign: 'right', whiteSpace: 'nowrap' }}><span className={`tx-amount ${tx.type}`}>{tx.type === 'income' ? '+' : '−'}{INR(tx.amount)}</span></td>
                        {isAdmin && <td><button className="edit-btn" onClick={e => { e.stopPropagation(); deleteTransaction(tx.id) }} style={{ color: '#F44336', display: 'inline-flex', alignItems: 'center', gap: 3 }}>{Icons.delete(12)} Delete</button></td>}
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {selectedTx && <TxDetailModal tx={selectedTx} allTransactions={txList} onClose={() => setSelectedTx(null)} isAdmin={isAdmin} onDelete={deleteTransaction} />}
        {showModal && isAdmin && <AddTransactionModal onClose={() => setShowModal(false)} onAdd={addTransaction} creditCards={creditCards} />}
      </div>
    </>
  )
}