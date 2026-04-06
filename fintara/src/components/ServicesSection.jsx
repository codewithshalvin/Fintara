import { useRef, useState, useCallback, useImperativeHandle, forwardRef, useEffect } from 'react'
import {
  BarChart2, TrendingUp, CreditCard, Zap, Filter, Download,
  ShieldCheck, ArrowUpRight, ArrowDownLeft, RefreshCw,
  Wifi, ChevronLeft, ChevronRight, PieChart,
} from 'lucide-react'

const css = `
  @keyframes ss-up    { from{opacity:0;transform:translateY(32px)} to{opacity:1;transform:translateY(0)} }
  @keyframes ss-left  { from{opacity:0;transform:translateX(-36px)} to{opacity:1;transform:translateX(0)} }
  @keyframes ss-right { from{opacity:0;transform:translateX(36px)}  to{opacity:1;transform:translateX(0)} }
  @keyframes ss-float {
    0%,100% { transform:translateY(0px) }
    50%     { transform:translateY(-8px) }
  }
  @keyframes ss-glow-bump {
    0%   { transform:scale(1) }
    30%  { transform:scale(1.03) }
    65%  { transform:scale(.98) }
    100% { transform:scale(1) }
  }
  @keyframes ss-count {
    from { opacity:0; transform:translateY(5px) }
    to   { opacity:1; transform:translateY(0) }
  }
  @keyframes ss-line {
    from { stroke-dashoffset:700 }
    to   { stroke-dashoffset:0 }
  }
  @keyframes ss-shimmer {
    0%   { background-position:200% center }
    100% { background-position:-200% center }
  }
  @keyframes ss-card-in {
    from { opacity:0; transform:translateX(50px) scale(.97) }
    to   { opacity:1; transform:translateX(0) scale(1) }
  }
  @keyframes ss-dot-pulse {
    0%,100% { opacity:.35 } 50% { opacity:1 }
  }
  @keyframes ss-ticker {
    from { transform:translateX(0) }
    to   { transform:translateX(-50%) }
  }

  .ss-section {
    position:relative;
    overflow:hidden;
    background:var(--bg-primary);
    font-family:var(--font-body);
    padding:0 0 5rem;
    transition:background var(--transition), color var(--transition);
  }
  .ss-section::before {
    content:'';
    position:absolute;inset:0;pointer-events:none;
    background-image:
      linear-gradient(var(--grid-line) 1px, transparent 1px),
      linear-gradient(90deg, var(--grid-line) 1px, transparent 1px);
    background-size:55px 55px;
  }

  .ss-topline {
    height:1px;
    background:linear-gradient(90deg, transparent, var(--accent), transparent);
  }

  .ss-blob {
    position:absolute;border-radius:50%;
    filter:blur(100px);pointer-events:none;
  }
  .ss-blob-1 {
    width:500px;height:500px;top:-110px;left:-80px;
    background:radial-gradient(circle, var(--coin-glow), transparent 70%);
    opacity:.55;
  }
  .ss-blob-2 {
    width:460px;height:460px;bottom:-110px;right:-80px;
    background:radial-gradient(circle, var(--particle, rgba(200,146,42,.12)), transparent 70%);
    opacity:.5;
  }

  .ss-wrap {
    position:relative;z-index:2;
    max-width:1200px;margin:0 auto;
    padding:5rem 4rem 0;
  }

  .ss-hdr { text-align:center;margin-bottom:4rem;opacity:0; }
  .ss-hdr.in { animation:ss-up .6s ease both; }

  .ss-eyebrow {
    display:inline-flex;align-items:center;gap:6px;
    padding:.35rem 1rem;
    border:1px solid var(--border);border-radius:100px;
    background:var(--bg-glass);
    font-size:.73rem;font-weight:600;letter-spacing:.13em;text-transform:uppercase;
    color:var(--accent);margin-bottom:1.4rem;
  }
  .ss-eyebrow-dot {
    width:5px;height:5px;border-radius:50%;
    background:var(--accent);box-shadow:0 0 5px var(--accent);
    animation:ss-dot-pulse 2s ease-in-out infinite;
  }

  .ss-h1 {
    font-family:var(--font-display);
    font-size:clamp(2.2rem,4vw,3.4rem);
    font-weight:800;line-height:1.1;letter-spacing:-.03em;
    color:var(--text-primary);margin-bottom:.9rem;
  }
  .ss-h1 em {
    font-style:normal;
    background:linear-gradient(120deg,var(--accent),var(--accent-bright),var(--accent));
    background-size:200% auto;
    -webkit-background-clip:text;-webkit-text-fill-color:transparent;
    background-clip:text;
    animation:ss-shimmer 4s linear infinite;
  }
  .ss-sub {
    color:var(--text-secondary);font-size:1rem;font-weight:300;
    max-width:480px;margin:0 auto;line-height:1.75;
  }

  /* ── 2-col layout ── */
  .ss-main {
    display:grid;
    grid-template-columns:330px 1fr;
    gap:28px;align-items:start;
  }

  /* ── WALLET ── */
  .ss-wallet-col { position:sticky;top:2rem;opacity:0; }
  .ss-wallet-col.in { animation:ss-left .6s ease .1s both; }

  .ss-wallet-lbl {
    font-size:.7rem;letter-spacing:.14em;text-transform:uppercase;
    color:var(--accent);font-weight:600;margin-bottom:10px;
    display:flex;align-items:center;gap:7px;
  }
  .ss-wallet-lbl::after {
    content:'';flex:1;height:1px;
    background:linear-gradient(90deg,var(--border),transparent);
  }

  .ss-wallet {
    background:var(--bg-card);
    border:1px solid var(--border);
    border-radius:24px;
    padding:1.8rem 1.6rem;
    position:relative;overflow:hidden;
    box-shadow:var(--shadow);
    transition:border-color .4s, box-shadow .4s;
  }
  .ss-wallet:not(.glow) { animation:ss-float 5s ease-in-out infinite; }
  .ss-wallet.glow {
    border-color:var(--accent);
    box-shadow:var(--shadow), 0 0 40px var(--coin-glow);
    animation:ss-glow-bump .6s ease;
  }
  .ss-wallet::before {
    content:'';position:absolute;top:0;left:0;right:0;height:3px;
    background:linear-gradient(90deg,var(--accent),var(--accent-bright),var(--accent));
    border-radius:24px 24px 0 0;
  }
  .ss-wallet::after {
    content:'';position:absolute;top:0;right:0;
    width:140px;height:140px;
    background:radial-gradient(circle at top right,var(--bg-glass),transparent 70%);
    pointer-events:none;
  }

  .sw-splash { position:absolute;top:50%;left:50%;pointer-events:none;z-index:10; }
  .sw-ring {
    position:absolute;border-radius:50%;
    border:1.5px solid var(--accent);opacity:0;
    transform:translate(-50%,-50%) scale(0);transition:none;
  }

  .sw-row { display:flex;align-items:center;justify-content:space-between;margin-bottom:1.3rem; }
  .sw-chip {
    width:42px;height:30px;border-radius:6px;
    background:linear-gradient(135deg,var(--accent),var(--accent-bright));
    box-shadow:0 3px 10px var(--coin-glow);
    display:grid;grid-template-columns:1fr 1fr;gap:3px;padding:4px;
  }
  .sw-chip div { background:rgba(0,0,0,.2);border-radius:2px; }
  .sw-net {
    display:flex;align-items:center;gap:5px;
    font-size:.7rem;font-weight:700;letter-spacing:.1em;text-transform:uppercase;
    color:var(--text-muted);
  }
  .sw-live-dot {
    width:6px;height:6px;border-radius:50%;
    background:#4CAF50;box-shadow:0 0 5px #4CAF50;
  }
  .sw-lbl {
    font-size:.7rem;text-transform:uppercase;letter-spacing:.1em;
    color:var(--text-muted);margin-bottom:.3rem;
  }
  .sw-amt {
    font-family:var(--font-display);
    font-size:2.2rem;font-weight:800;line-height:1;
    color:var(--text-primary);margin-bottom:.35rem;
    transition:color .4s;
  }
  .sw-amt.hi { color:var(--accent-bright); animation:ss-count .4s ease; }
  .sw-trend { font-size:.8rem;color:#4CAF50;font-weight:500;margin-bottom:1.1rem; }
  .sw-chart { height:56px;margin-bottom:1.1rem; }
  .sw-path { stroke-dasharray:700;stroke-dashoffset:700; }
  .sw-path.draw { animation:ss-line 1.6s ease .4s forwards; }
  .sw-div { height:1px;background:var(--border);margin:.75rem 0 .9rem; }
  .sw-addr {
    font-size:.67rem;color:var(--text-muted);
    font-family:'Courier New',monospace;
    margin-bottom:.9rem;word-break:break-all;letter-spacing:.03em;
  }
  .sw-btns { display:flex;gap:.5rem; }
  .sw-btn {
    flex:1;padding:.6rem 0;border-radius:10px;
    border:1px solid var(--border);background:transparent;
    color:var(--text-secondary);
    font-family:var(--font-body);font-size:.76rem;font-weight:500;
    cursor:pointer;letter-spacing:.03em;
    display:flex;align-items:center;justify-content:center;gap:4px;
    transition:all var(--transition);
  }
  .sw-btn:hover {
    background:var(--accent);color:var(--bg-primary);
    border-color:var(--accent);transform:translateY(-2px);
    box-shadow:0 6px 18px var(--coin-glow);
  }
  .sw-btn.recv:hover {
    background:var(--accent-2);color:#fff;border-color:var(--accent-2);
    box-shadow:none;
  }

  .sw-stats {
    display:grid;grid-template-columns:1fr 1fr;
    gap:9px;margin-top:10px;
  }
  .sw-stat {
    background:var(--bg-card);border:1px solid var(--border);
    border-radius:13px;padding:.75rem .9rem;
    transition:border-color var(--transition);
  }
  .sw-stat:hover { border-color:var(--accent); }
  .sw-stat-lbl {
    font-size:.64rem;text-transform:uppercase;letter-spacing:.1em;
    color:var(--text-muted);margin-bottom:.25rem;
  }
  .sw-stat-val {
    font-family:var(--font-display);font-size:1rem;font-weight:700;
    color:var(--text-primary);
  }
  .sw-stat-val.up   { color:#4CAF50; }
  .sw-stat-val.acc  { color:var(--accent-bright); }

  /* ── CAROUSEL ── */
  .ss-carousel { display:flex;flex-direction:column;gap:18px;opacity:0; }
  .ss-carousel.in { animation:ss-right .6s ease .15s both; }

  .ss-ctrl { display:flex;align-items:center;justify-content:space-between; }
  .ss-ctrl-title {
    font-family:var(--font-display);
    font-size:.95rem;font-weight:700;color:var(--text-primary);
  }
  .ss-ctrl-btns { display:flex;gap:7px; }
  .ss-ctrl-btn {
    width:34px;height:34px;border-radius:10px;
    background:var(--bg-card);border:1px solid var(--border);
    color:var(--text-secondary);cursor:pointer;
    display:flex;align-items:center;justify-content:center;
    transition:all var(--transition);
  }
  .ss-ctrl-btn:hover { background:var(--accent);border-color:var(--accent);color:var(--bg-primary); }

  .ss-card-wrap { overflow:hidden;border-radius:20px;min-height:210px; }
  .ss-scard {
    background:var(--bg-card);border:1px solid var(--border);
    border-radius:20px;padding:1.8rem 1.9rem;
    position:relative;overflow:hidden;cursor:pointer;
    transition:border-color var(--transition), transform .3s, box-shadow .3s;
  }
  .ss-scard::before {
    content:'';position:absolute;inset:0;border-radius:20px;
    background:var(--bg-glass);opacity:0;transition:opacity .35s;
  }
  .ss-scard:hover { border-color:var(--accent);transform:translateY(-3px);box-shadow:var(--shadow), 0 0 24px var(--coin-glow); }
  .ss-scard:hover::before { opacity:1; }
  .ss-scard-glow {
    position:absolute;top:0;right:0;width:110px;height:110px;
    border-radius:0 20px 0 0;
    background:radial-gradient(circle at top right, var(--coin-glow), transparent 70%);
    pointer-events:none;
  }
  .ss-card-num {
    font-family:var(--font-display);
    font-size:.68rem;font-weight:800;letter-spacing:.18em;text-transform:uppercase;
    color:var(--accent);margin-bottom:1rem;opacity:.7;
  }
  .ss-icon-box {
    width:50px;height:50px;border-radius:14px;
    background:var(--bg-glass);border:1px solid var(--border);
    display:flex;align-items:center;justify-content:center;
    color:var(--accent);margin-bottom:1.1rem;
    transition:all var(--transition);
  }
  .ss-scard:hover .ss-icon-box {
    background:var(--accent);color:var(--bg-primary);
    box-shadow:0 6px 20px var(--coin-glow);
  }
  .ss-card-title {
    font-family:var(--font-display);
    font-size:1.3rem;font-weight:700;letter-spacing:-.02em;
    color:var(--text-primary);margin-bottom:.55rem;
  }
  .ss-card-desc {
    font-size:.86rem;color:var(--text-secondary);line-height:1.7;
    font-weight:300;max-width:340px;
  }
  .ss-card-badge {
    display:inline-flex;align-items:center;gap:5px;
    margin-top:1.1rem;
    background:var(--bg-glass);border:1px solid var(--border);
    border-radius:8px;padding:.28rem .7rem;
    font-size:.71rem;font-weight:600;color:var(--accent);letter-spacing:.06em;
    transition:border-color var(--transition);
  }
  .ss-scard:hover .ss-card-badge { border-color:var(--accent); }
  .ss-slide-in { animation:ss-card-in .42s cubic-bezier(.22,.68,0,1.15) both; }

  .ss-dots { display:flex;align-items:center;justify-content:center;gap:6px;margin-top:12px; }
  .ss-dot {
    width:6px;height:6px;border-radius:50%;
    background:var(--border);transition:all .3s;cursor:pointer;
  }
  .ss-dot.active {
    width:20px;border-radius:4px;
    background:var(--accent);box-shadow:0 0 7px var(--coin-glow);
  }

  .ss-mini-row { display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-top:4px; }
  .ss-mini {
    background:var(--bg-card);border:1px solid var(--border);
    border-radius:14px;padding:1.1rem 1.2rem;
    cursor:pointer;transition:all var(--transition);
    position:relative;overflow:hidden;opacity:0;
  }
  .ss-mini.in { animation:ss-up .5s ease both; }
  .ss-mini:hover { border-color:var(--accent);transform:translateY(-2px); }
  .ss-mini::after {
    content:'';position:absolute;top:0;left:0;right:0;height:1px;
    background:linear-gradient(90deg,transparent,var(--accent-bright),transparent);
    opacity:0;transition:opacity .3s;
  }
  .ss-mini:hover::after { opacity:1; }
  .ss-mini-icon { color:var(--accent-bright);margin-bottom:.6rem; }
  .ss-mini-title {
    font-family:var(--font-display);font-size:.88rem;font-weight:700;
    color:var(--text-primary);margin-bottom:.25rem;
  }
  .ss-mini-desc { font-size:.76rem;color:var(--text-secondary);line-height:1.55; }

  /* ── TICKER ── */
  .ss-ticker-shell {
    overflow:hidden;padding:.85rem 0;
    border-top:1px solid var(--border);border-bottom:1px solid var(--border);
    margin-top:4.5rem;position:relative;z-index:2;
    background:var(--bg-card);
  }
  .ss-ticker {
    display:flex;gap:2.8rem;white-space:nowrap;
    animation:ss-ticker 26s linear infinite;
    width:max-content;
  }
  .ss-ticker-item {
    display:flex;align-items:center;gap:.55rem;
    font-size:.78rem;font-weight:600;
    color:var(--text-muted);letter-spacing:.04em;
  }
  .ss-ticker-item .sym { color:var(--text-primary); }
  .ss-ticker-item .up  { color:#4CAF50; }
  .ss-ticker-item .dn  { color:#F44336; }

  /* ── FLYING COIN ── */
  .ss-coin {
    position:fixed;width:56px;height:56px;border-radius:50%;
    background:conic-gradient(from 0deg,#8B6914,#D4A830,#F5CC50,#D4A830,#A07820,#F0C040,#C8922A,#F5CC50,#8B6914);
    border:2px solid var(--accent);
    box-shadow:0 0 28px var(--coin-glow);
    display:flex;align-items:center;justify-content:center;
    font-family:var(--font-display);font-size:1.15rem;font-weight:800;
    color:rgba(255,255,255,.95);text-shadow:0 1px 3px rgba(0,0,0,.5);
    pointer-events:none;z-index:9999;transition:none;
  }

  /* ═══════════════════════════════
     RESPONSIVE BREAKPOINTS
     ═══════════════════════════════ */

  /* ── tablet: 960px ── */
  @media (max-width: 960px) {
    .ss-wrap {
      padding: 4rem 2rem 0;
    }

    /* stack wallet above carousel */
    .ss-main {
      grid-template-columns: 1fr;
    }

    /* wallet: unstick, limit width */
    .ss-wallet-col {
      position: static;
      max-width: 480px;
      margin: 0 auto;
      width: 100%;
    }

    .ss-mini-row {
      grid-template-columns: 1fr 1fr;
    }
  }

  /* ── large mobile: 700px ── */
  @media (max-width: 700px) {
    .ss-wrap { padding: 3.5rem 1.5rem 0; }

    .ss-h1 { font-size: clamp(1.8rem, 7vw, 2.6rem); }

    /* wallet full-width */
    .ss-wallet-col { max-width: 100%; }

    /* wallet amount slightly smaller */
    .sw-amt { font-size: 1.8rem; }

    /* collapse the 3 action buttons to 2 rows */
    .sw-btns { flex-wrap: wrap; }
    .sw-btn { min-width: calc(50% - .25rem); }
  }

  /* ── small mobile: 480px ── */
  @media (max-width: 480px) {
    .ss-wrap { padding: 3rem 1rem 0; }

    /* header */
    .ss-eyebrow { font-size: .65rem; }
    .ss-sub { font-size: .9rem; }

    /* wallet */
    .ss-wallet { padding: 1.4rem 1.2rem; border-radius: 18px; }
    .sw-amt { font-size: 1.6rem; }
    .sw-btns { flex-direction: column; }
    .sw-btn { width: 100%; }

    /* stats: 2-col stays fine */

    /* carousel card */
    .ss-scard { padding: 1.4rem 1.2rem; border-radius: 16px; }
    .ss-card-title { font-size: 1.1rem; }
    .ss-card-desc { font-size: .82rem; }

    /* mini cards: stack to single column */
    .ss-mini-row { grid-template-columns: 1fr; }

    /* ticker: slightly smaller */
    .ss-ticker-item { font-size: .72rem; }
    .ss-ticker-shell { padding: .65rem 0; }

    /* reduce bottom padding */
    .ss-section { padding-bottom: 3rem; }
  }

  /* ── tiny mobile: 360px ── */
  @media (max-width: 360px) {
    .ss-wrap { padding: 2.5rem .75rem 0; }
    .ss-wallet { padding: 1.2rem 1rem; }
    .sw-stats { grid-template-columns: 1fr 1fr; gap: 6px; }
    .sw-stat { padding: .6rem .7rem; }
    .sw-stat-val { font-size: .9rem; }
  }
`

const SERVICES = [
  {
    Icon: BarChart2,
    label: 'OVERVIEW',
    title: 'Live Balance Overview',
    desc: 'See your total balance, income, expenses and net savings at a glance — with a 6-month trend chart and spending breakdown donut, updated in real time.',
    badge: '6-month trend chart',
  },
  {
    Icon: CreditCard,
    label: 'CARDS',
    title: 'Multi-Card Dashboard',
    desc: 'Manage Fintara Visa, HDFC Mastercard and Amex Gold in one place. Swipe through the card stack to see per-card income, expenses and net balance instantly.',
    badge: '3 cards, 1 view',
  },
  {
    Icon: Filter,
    label: 'TRANSACTIONS',
    title: 'Smart Transaction Search',
    desc: 'Filter by category, type, amount range and date. Sort by newest, highest or merchant A–Z. Switch between card grid and table view — then export to CSV in one click.',
    badge: 'CSV export ready',
  },
  {
    Icon: TrendingUp,
    label: 'INSIGHTS',
    title: 'AI Spend Insights',
    desc: 'Know your savings rate, top spending category, average daily spend and income growth versus last month — all auto-calculated from your real transaction history.',
    badge: 'Savings rate tracker',
  },
  {
    Icon: PieChart,
    label: 'ANALYTICS',
    title: 'Category Breakdown',
    desc: 'Visual bar charts show monthly income vs expenses side-by-side. Horizontal progress bars rank every spending category — Housing, Groceries, Health and more — by share.',
    badge: 'Month-by-month view',
  },
  {
    Icon: Download,
    label: 'EXPORT',
    title: 'One-Click CSV Export',
    desc: 'Download any filtered view of your transactions as a clean CSV — date, merchant, category, type, amount and card — ready for Excel, Google Sheets or your accountant.',
    badge: 'Filter-aware export',
  },
]

const MINI = [
  {
    Icon: ShieldCheck,
    title: 'Admin & Viewer Roles',
    desc: 'Switch between Admin mode (add, delete transactions) and Viewer mode (read-only) right from the sidebar.',
  },
  {
    Icon: Zap,
    title: 'Merchant History Panel',
    desc: 'Click any transaction to open a slide-in panel with full merchant history, monthly spend bars and related transactions.',
  },
]

const TICKER = [
  ['BALANCE',    '₹20.2L',   '+2.4%',  true ],
  ['INCOME',     '₹5.99L',   '+12.1%', true ],
  ['EXPENSES',   '₹3.37L',   '+5.3%',  false],
  ['NET SAVINGS','₹2.62L',   '+18.7%', true ],
  ['SAVINGS RATE','43.7%',   '+4.2%',  true ],
  ['AVG DAILY',  '₹1,123',   '-0.8%',  false],
  ['INCOME MOM', '+12.8%',   'vs May', true ],
  ['TOP SPEND',  'Housing',  '₹2.99L', false],
]

const RINGS = [76, 128, 180]

const Inner = forwardRef(function Inner(_, ref) {
  const secRef   = useRef(null)
  const walRef   = useRef(null)
  const ringRefs = [useRef(null), useRef(null), useRef(null)]
  const running  = useRef(false)
  const timer    = useRef(null)

  const [vis,      setVis]      = useState(false)
  const [drawLine, setDrawLine] = useState(false)
  const [glow,     setGlow]     = useState(false)
  const [hi,       setHi]       = useState(false)
  const [amount,   setAmount]   = useState('₹20,14,350')
  const [trend,    setTrend]    = useState('▲ +2.4% this month')
  const [coinSt,   setCoinSt]   = useState({ display: 'none' })
  const [idx,      setIdx]      = useState(0)

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) {
        setVis(true)
        setTimeout(() => setDrawLine(true), 800)
        io.disconnect()
      }
    }, { threshold: 0.08 })
    if (secRef.current) io.observe(secRef.current)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    if (!vis) return
    timer.current = setInterval(() => {
      setIdx(i => (i + 1) % SERVICES.length)
    }, 3500)
    return () => clearInterval(timer.current)
  }, [vis])

  const goTo   = (n) => { clearInterval(timer.current); setIdx(n) }
  const goPrev = ()  => { clearInterval(timer.current); setIdx(i => (i - 1 + SERVICES.length) % SERVICES.length) }
  const goNext = ()  => { clearInterval(timer.current); setIdx(i => (i + 1) % SERVICES.length) }

  const triggerCoin = useCallback((sx, sy) => {
    if (running.current) return
    running.current = true
    const r = walRef.current?.getBoundingClientRect()
    if (!r) { running.current = false; return }
    const dx = r.left + r.width / 2 - 28
    const dy = r.top  + r.height / 2 - 28

    setCoinSt({ display: 'flex', left: sx - 28 + 'px', top: sy - 28 + 'px', opacity: 1, transform: 'scale(1)', transition: 'none' })

    requestAnimationFrame(() => requestAnimationFrame(() => {
      setCoinSt({
        display: 'flex', left: dx + 'px', top: dy + 'px', opacity: 1,
        transform: 'scale(.32) rotateY(720deg)',
        transition: [
          'left .85s cubic-bezier(.4,0,.2,1)',
          'top .85s cubic-bezier(.4,0,.2,1)',
          'transform .85s ease',
          'opacity .1s ease .78s',
        ].join(', '),
      })
      setTimeout(() => {
        setCoinSt(s => ({ ...s, opacity: 0 }))
        ringRefs.forEach((rr, i) => {
          if (!rr.current) return
          rr.current.style.transition = 'none'
          rr.current.style.transform  = 'translate(-50%,-50%) scale(0)'
          rr.current.style.opacity    = '0'
          setTimeout(() => {
            rr.current.style.transition = `transform ${.5 + i * .12}s ease-out, opacity ${.5 + i * .12}s ease-out`
            rr.current.style.transform  = 'translate(-50%,-50%) scale(1)'
            void rr.current.offsetWidth
            rr.current.style.opacity = '0.85'
            setTimeout(() => { if (rr.current) rr.current.style.opacity = '0' }, 75)
          }, 10 + i * 95)
        })
        setGlow(true); setHi(true)
        setAmount('₹20,17,063'); setTrend('▲ +2.6% this month')
        setTimeout(() => { setGlow(false); setHi(false); setCoinSt({ display: 'none' }); running.current = false }, 2400)
      }, 820)
    }))
  }, [])

  useImperativeHandle(ref, () => {
    const node = secRef.current
    if (node) node.triggerCoinDrop = triggerCoin
    return node
  }, [triggerCoin])

  const cur = SERVICES[idx]

  return (
    <>
      <style>{css}</style>

      <section
        className="ss-section services-section"
        ref={secRef}
        id="services"
        onClick={e => triggerCoin(e.clientX, e.clientY)}
      >
        <div className="ss-topline" />
        <div className="ss-blob ss-blob-1" />
        <div className="ss-blob ss-blob-2" />

        <div className="ss-wrap">
          <div className={`ss-hdr${vis ? ' in' : ''}`}>
            <div className="ss-eyebrow">
              <span className="ss-eyebrow-dot" />
              What's inside
            </div>
            <h2 className="ss-h1">
              Everything Your <em>Dashboard</em><br />Can Do For You
            </h2>
            <p className="ss-sub section-sub">
              Overview, transactions, insights — every feature of the Fintara dashboard, explained.
            </p>
          </div>

          <div className="ss-main">

            {/* WALLET — LEFT */}
            <div className={`ss-wallet-col${vis ? ' in' : ''}`}>
              <p className="ss-wallet-lbl">Your Dashboard Balance</p>

              <div ref={walRef} className={`ss-wallet${glow ? ' glow' : ''}`}>
                <div className="sw-splash">
                  {RINGS.map((sz, i) => (
                    <div key={i} ref={ringRefs[i]} className="sw-ring"
                      style={{ width: sz + 'px', height: sz + 'px', marginLeft: -sz / 2 + 'px', marginTop: -sz / 2 + 'px' }} />
                  ))}
                </div>

                <div className="sw-row">
                  <div className="sw-chip"><div /><div /><div /><div /></div>
                  <div className="sw-net">
                    <div className="sw-live-dot" />
                    <span>Fintara Dashboard</span>
                  </div>
                </div>

                <div className="sw-lbl">Total Balance</div>
                <div className={`sw-amt${hi ? ' hi' : ''}`}>{amount}</div>
                <div className="sw-trend">{trend}</div>

                <div className="sw-chart">
                  <svg width="100%" height="56" viewBox="0 0 300 56" preserveAspectRatio="none">
                    <defs>
                      <linearGradient id="swg-in" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="var(--accent)" stopOpacity=".25" />
                        <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      className={`sw-path${drawLine ? ' draw' : ''}`}
                      d="M0 52C20 50 35 46 55 42S80 36 105 31S130 24 155 19S180 14 205 10S230 7 255 5S275 3 300 2"
                      fill="none" stroke="var(--accent)" strokeWidth="2.5" strokeLinecap="round"
                    />
                    <path d="M0 52C20 50 35 46 55 42S80 36 105 31S130 24 155 19S180 14 205 10S230 7 255 5S275 3 300 2L300 56L0 56Z"
                      fill="url(#swg-in)" />
                  </svg>
                </div>

                <div className="sw-div" />
                <div className="sw-addr">Income: ₹5.99L · Expenses: ₹3.37L · Net: +₹2.62L</div>

                <div className="sw-btns">
                  <button className="sw-btn wallet-btn send" onClick={e => e.stopPropagation()}>
                    <ArrowUpRight size={12} strokeWidth={2} /> Overview
                  </button>
                  <button className="sw-btn recv wallet-btn receive" onClick={e => e.stopPropagation()}>
                    <ArrowDownLeft size={12} strokeWidth={2} /> Transactions
                  </button>
                  <button className="sw-btn" onClick={e => e.stopPropagation()}>
                    <RefreshCw size={11} strokeWidth={2} /> Insights
                  </button>
                </div>
              </div>

              <div className="sw-stats">
                <div className="sw-stat">
                  <div className="sw-stat-lbl">Savings Rate</div>
                  <div className="sw-stat-val up">43.7%</div>
                </div>
                <div className="sw-stat">
                  <div className="sw-stat-lbl">Top Category</div>
                  <div className="sw-stat-val acc">Housing</div>
                </div>
                <div className="sw-stat">
                  <div className="sw-stat-lbl">Avg. Daily Spend</div>
                  <div className="sw-stat-val up">₹1,123</div>
                </div>
                <div className="sw-stat">
                  <div className="sw-stat-lbl">Income MoM</div>
                  <div className="sw-stat-val acc">+12.8%</div>
                </div>
              </div>
            </div>

            {/* CAROUSEL — RIGHT */}
            <div
              className={`ss-carousel${vis ? ' in' : ''}`}
              onClick={e => e.stopPropagation()}
            >
              <div className="ss-ctrl">
                <div className="ss-ctrl-title">Dashboard Features</div>
                <div className="ss-ctrl-btns">
                  <button className="ss-ctrl-btn" onClick={goPrev}><ChevronLeft size={15} /></button>
                  <button className="ss-ctrl-btn" onClick={goNext}><ChevronRight size={15} /></button>
                </div>
              </div>

              <div className="ss-card-wrap">
                <div key={idx} className="ss-scard ss-slide-in">
                  <div className="ss-scard-glow" />
                  <div className="ss-card-num">
                    {String(idx + 1).padStart(2, '0')} / {String(SERVICES.length).padStart(2, '0')}
                  </div>
                  <div className="ss-icon-box">
                    <cur.Icon size={21} strokeWidth={1.6} />
                  </div>
                  <div className="ss-card-title">{cur.title}</div>
                  <div className="ss-card-desc">{cur.desc}</div>
                  <div className="ss-card-badge">
                    <Zap size={10} /> {cur.badge}
                  </div>
                </div>
              </div>

              <div className="ss-dots">
                {SERVICES.map((_, i) => (
                  <div key={i} className={`ss-dot${idx === i ? ' active' : ''}`} onClick={() => goTo(i)} />
                ))}
              </div>

              <div className="ss-mini-row">
                {MINI.map(({ Icon, title, desc }, i) => (
                  <div key={title} className={`ss-mini${vis ? ' in' : ''}`} style={{ animationDelay: `.${30 + i * 12}s` }}>
                    <div className="ss-mini-icon"><Icon size={17} strokeWidth={1.6} /></div>
                    <div className="ss-mini-title">{title}</div>
                    <div className="ss-mini-desc">{desc}</div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>

        {/* LIVE KPI TICKER */}
        <div className="ss-ticker-shell">
          <div className="ss-ticker">
            {[...TICKER, ...TICKER].map(([sym, price, ch, up], i) => (
              <div key={i} className="ss-ticker-item">
                <Wifi size={10} strokeWidth={2} />
                <span className="sym">{sym}</span>
                {price}
                <span className={up ? 'up' : 'dn'}>{ch}</span>
                {'·'}
              </div>
            ))}
          </div>
        </div>

      </section>

      <div className="ss-coin" style={coinSt}>₹</div>
    </>
  )
})

export default function ServicesSection({ servicesRef }) {
  return <Inner ref={servicesRef} />
}