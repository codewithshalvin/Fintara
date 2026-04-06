import { useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../components/Navbar.jsx'
import Coin3D from '../components/Coin3D.jsx'
import ServicesSection from '../components/ServicesSection.jsx'

/* ─── illustration styles only ───────────────────── */
const illCSS = `
  @keyframes illFloat1    { 0%,100%{transform:translateY(0px)}  50%{transform:translateY(-8px)}  }
  @keyframes illFloat2    { 0%,100%{transform:translateY(0px)}  50%{transform:translateY(-5px)}  }
  @keyframes illFloat3    { 0%,100%{transform:translateY(0px)}  50%{transform:translateY(-11px)} }
  @keyframes illBarGrow   { from{transform:scaleY(0)} to{transform:scaleY(1)} }
  @keyframes illLineDraw  { from{stroke-dashoffset:300} to{stroke-dashoffset:0} }
  @keyframes illPieSpin   { from{transform:rotate(0deg)} to{transform:rotate(360deg)} }
  @keyframes illRupee     {
    0%   { opacity:.6; transform:translateY(0)   scale(1); }
    50%  { opacity:1;  transform:translateY(-18px) scale(1.15); }
    100% { opacity:0;  transform:translateY(-36px) scale(.6); }
  }

  /* illustration wrapper — sits inside the existing coin-wrapper */
  .ill-layer {
    position: absolute;
    inset: -80px;
    pointer-events: none;
    z-index: 1;
  }

  /* floating card base */
  .ill-card {
    position: absolute;
    background: var(--bg-card);
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 10px 14px;
    box-shadow: 0 4px 20px rgba(0,0,0,.12);
  }
  .ill-card-lbl {
    font-size: 8px; font-weight: 600; letter-spacing: .12em;
    text-transform: uppercase; color: var(--text-muted);
    font-family: var(--font-body);
    margin-bottom: 4px;
  }
  .ill-card-val {
    font-size: 16px; font-weight: 800;
    color: var(--accent-bright);
    font-family: var(--font-display);
    line-height: 1;
  }

  .ill-returns  { top: 8%;    left: -2%;  animation: illFloat1 3.4s ease-in-out infinite; }
  .ill-portfolio{ bottom: 10%;left: 0%;   animation: illFloat2 4s   ease-in-out infinite .4s; }
  .ill-market   { bottom: 4%; right: 2%;  animation: illFloat3 3.8s ease-in-out infinite .8s; }
  .ill-donut    { top: 2%;    right: -2%; animation: illFloat1 4.5s ease-in-out infinite .2s; }

  .ill-bars {
    display: flex; align-items: flex-end; gap: 3px;
    height: 44px; padding-top: 4px;
  }
  .ill-bar {
    width: 10px; border-radius: 2px 2px 0 0;
    transform-origin: bottom;
    animation: illBarGrow .8s ease both;
  }

  .ill-spark { display: block; }
  .ill-spark-path { stroke-dasharray:200; stroke-dashoffset:200; animation:illLineDraw 1.2s ease .6s forwards; }

  .ill-pie-group { animation: illPieSpin 14s linear infinite; transform-origin: 38px 38px; }

  .ill-coin {
    position: absolute;
    border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-family: var(--font-display); font-weight: 800;
    color: rgba(255,255,255,.9);
    background: radial-gradient(circle at 35% 30%, #F5CC50, #C8922A 50%, #6B4512);
    border: 1.5px solid #D4A830;
    box-shadow: 0 2px 8px rgba(200,146,42,.5);
  }

  .ill-glow {
    position: absolute;
    width: 340px; height: 280px;
    top: 50%; left: 50%;
    transform: translate(-50%,-50%);
    background: radial-gradient(ellipse, var(--coin-glow) 0%, transparent 68%);
    opacity: .5;
    border-radius: 50%;
  }

  .ill-trend-arrow { stroke-dasharray:260; stroke-dashoffset:260; animation:illLineDraw 1.4s ease .3s forwards; }

  .ill-rsym {
    position: absolute;
    font-family: var(--font-display); font-weight: 800;
    color: var(--accent-bright);
    pointer-events: none;
    animation: illRupee 2.8s ease-in-out infinite;
  }
`

/* ─── bar heights for portfolio card ─────────────── */
const BARS = [
  { h:28, color:'var(--accent)',        delay:'.15s', op:'0.5' },
  { h:42, color:'var(--accent)',        delay:'.25s', op:'1'   },
  { h:34, color:'var(--accent)',        delay:'.35s', op:'0.7' },
  { h:50, color:'var(--accent-bright)', delay:'.45s', op:'1'   },
  { h:58, color:'var(--accent-bright)', delay:'.55s', op:'1'   },
  { h:64, color:'var(--accent-bright)', delay:'.65s', op:'0.8' },
]

/* ─── financial illustration ─────────────────────── */
function FinanceIllustration() {
  return (
    <>
      <div className="ill-glow" />

      {/* scattered small coins */}
      <div className="ill-coin" style={{width:28,height:28,top:'18%',left:'4%',  fontSize:13,animation:'illFloat2 3.2s ease-in-out infinite'}}>₹</div>
      <div className="ill-coin" style={{width:22,height:22,top:'72%',left:'6%',  fontSize:10,animation:'illFloat3 4.1s ease-in-out infinite .7s'}}>₹</div>
      <div className="ill-coin" style={{width:18,height:18,top:'62%',right:'4%', fontSize:8, animation:'illFloat1 3.7s ease-in-out infinite 1.1s'}}>₹</div>
      <div className="ill-coin" style={{width:14,height:14,top:'22%',right:'8%', fontSize:7, animation:'illFloat2 3s   ease-in-out infinite .3s'}}>₹</div>

      {/* floating ₹ symbols */}
      <span className="ill-rsym" style={{fontSize:'1.1rem',left:'12%', top:'55%',animationDelay:'0s'}}>₹</span>
      <span className="ill-rsym" style={{fontSize:'.85rem',right:'10%',top:'65%',animationDelay:'1.1s'}}>₹</span>

      {/* upward trend arrow SVG */}
      <svg style={{position:'absolute',inset:0,width:'100%',height:'100%',pointerEvents:'none',zIndex:0}} viewBox="0 0 480 480" fill="none">
        <defs>
          <linearGradient id="arrowG" x1="0" y1="1" x2="1" y2="0">
            <stop offset="0%"   stopColor="var(--accent)"       stopOpacity=".2"/>
            <stop offset="100%" stopColor="var(--accent-bright)" stopOpacity=".45"/>
          </linearGradient>
          <linearGradient id="areaG" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="var(--accent-bright)" stopOpacity=".18"/>
            <stop offset="100%" stopColor="var(--accent-bright)" stopOpacity="0"/>
          </linearGradient>
        </defs>
        <path d="M60 420 L120 370 L175 385 L230 330 L285 295 L340 240 L390 170 L390 420 Z" fill="url(#areaG)"/>
        <path className="ill-trend-arrow"
          d="M60 420 L120 370 L175 385 L230 330 L285 295 L340 240 L390 170"
          stroke="url(#arrowG)" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
        <polygon points="390,170 378,186 402,186" fill="var(--accent-bright)" opacity=".4"/>
      </svg>

      {/* RETURNS card */}
      <div className="ill-card ill-returns">
        <div className="ill-card-lbl">Returns</div>
        <div className="ill-card-val">+24.8%</div>
        <svg width="60" height="22" className="ill-spark">
          <path className="ill-spark-path"
            d="M2 18 L12 14 L22 16 L32 10 L42 6 L52 3 L58 1"
            stroke="var(--accent-bright)" strokeWidth="1.8" fill="none"
            strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </div>

      {/* PORTFOLIO card */}
      <div className="ill-card ill-portfolio">
        <div className="ill-card-lbl">Portfolio</div>
        <div className="ill-bars">
          {BARS.map((b,i)=>(
            <div key={i} className="ill-bar"
              style={{height:b.h+'px',background:b.color,opacity:b.op,animationDelay:b.delay}}/>
          ))}
        </div>
      </div>

      {/* MARKET TREND card */}
      <div className="ill-card ill-market" style={{width:110}}>
        <div className="ill-card-lbl">Market Trend</div>
        <svg width="90" height="34">
          <path className="ill-spark-path"
            d="M2 30 L18 22 L32 26 L48 16 L64 10 L80 5 L88 2"
            stroke="#22c55e" strokeWidth="2" fill="none"
            strokeLinecap="round" strokeLinejoin="round"
            style={{animationDelay:'.4s'}}/>
          {[18,48,80].map((x,i) => {
            const ys = [22,16,5]
            return <circle key={i} cx={x} cy={ys[i]} r="3" fill="#22c55e" stroke="var(--bg-card)" strokeWidth="1.2"/>
          })}
        </svg>
      </div>

      {/* DONUT card */}
      <div className="ill-card ill-donut" style={{padding:'10px 12px'}}>
        <div className="ill-card-lbl" style={{marginBottom:6}}>Allocation</div>
        <svg width="76" height="76" viewBox="0 0 76 76">
          <g className="ill-pie-group">
            <path d="M38 38 L38 4 A34 34 0 1 1 8 53 Z"  fill="var(--accent-bright)" opacity=".85"/>
            <path d="M38 38 L8 53 A34 34 0 0 1 25 8 Z"  fill="var(--accent)"        opacity=".75"/>
            <path d="M38 38 L25 8 A34 34 0 0 1 38 4 Z"  fill="var(--text-muted)"    opacity=".45"/>
          </g>
          <circle cx="38" cy="38" r="18" fill="var(--bg-card)"/>
          <text x="38" y="42" textAnchor="middle" fontSize="9"
            fill="var(--text-primary)" fontFamily="var(--font-display)" fontWeight="700">62%</text>
        </svg>
      </div>
    </>
  )
}

/* ─── floating particles ──────────────────────────── */
function Particles() {
  return (
    <div className="particles">
      {Array.from({ length: 20 }).map((_, i) => (
        <div key={i} className="particle" style={{
          left:`${Math.random()*100}%`,
          animationDuration:`${6+Math.random()*10}s`,
          animationDelay:`${Math.random()*8}s`,
          width:`${2+Math.random()*4}px`,
          height:`${2+Math.random()*4}px`,
        }}/>
      ))}
    </div>
  )
}

/* ─── main ────────────────────────────────────────── */
export default function LandingPage() {
  const servicesRef = useRef(null)
  const coinWrapRef = useRef(null)

  const [coinFlying,  setCoinFlying]  = useState(false)
  const [coinVisible, setCoinVisible] = useState(true)

  const handleServicesClick = () => {
    if (coinFlying) return
    let startX = window.innerWidth  / 2
    let startY = window.innerHeight / 2
    if (coinWrapRef.current) {
      const r = coinWrapRef.current.getBoundingClientRect()
      startX = r.left + r.width  / 2
      startY = r.top  + r.height / 2
    }
    setCoinFlying(true)
    setTimeout(() => {
      servicesRef.current?.scrollIntoView({ behavior:'smooth' })
      setCoinVisible(false)
      setTimeout(() => {
        if (servicesRef.current?.triggerCoinDrop)
          servicesRef.current.triggerCoinDrop(startX, startY)
      }, 400)
    }, 900)
    setTimeout(() => { setCoinFlying(false); setCoinVisible(true) }, 5000)
  }

  return (
    <div>
      <style>{illCSS}</style>
      <Navbar onServicesClick={handleServicesClick} />

      {/* ── HERO ──────────────────────────────────── */}
      <section className="hero">
        <div className="hero-bg" />
        <Particles />

        <div className="hero-content">
          <div className="hero-eyebrow">Your finances, finally in focus.</div>

          <h1 className="hero-title">
            Smart Control<br />
            Over <em>Millions</em> of<br />
            Transactions
          </h1>

          <p className="hero-sub">
            Fintara tracks every rupee across all your cards — expenses, income, and savings — in one clean dashboard. Know where your money goes before it's gone.
          </p>

          <div className="hero-cta">
            <Link to="/signup">
              <button className="btn-hero primary">Get Started</button>
            </Link>
            <button className="btn-hero outline" onClick={handleServicesClick}>
              Our Services →
            </button>
          </div>

          <div className="hero-stats">
            <div className="stat-item">
              <div className="stat-num">12M+</div>
              <div className="stat-label">Satisfied Users</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">₹35,000Cr</div>
              <div className="stat-label">Assets Managed</div>
            </div>
            <div className="stat-item">
              <div className="stat-num">99.9%</div>
              <div className="stat-label">Uptime SLA</div>
            </div>
          </div>
        </div>

        {/* coin-wrapper with illustration behind */}
        {coinVisible && (
          <div className="coin-wrapper" ref={coinWrapRef}
            style={{position:'absolute', overflow:'visible'}}>

            <div className="ill-layer">
              <FinanceIllustration />
            </div>

            <div style={{position:'relative', zIndex:2, display:'flex', alignItems:'center', justifyContent:'center', width:'100%', height:'100%'}}>
              <div className="coin-ring" />
              <div className="coin-ring" style={{animationDelay:'1s'}}/>
              <Coin3D size={280} flying={coinFlying} />
            </div>
          </div>
        )}
      </section>

      {/* ── SERVICES ──────────────────────────────── */}
      <ServicesSection servicesRef={servicesRef} />

      {/* ── FOOTER ────────────────────────────────── */}
      <footer className="footer">
        <p className="footer-text">© 2025 Fintara Inc. All rights reserved.</p>
        <ul className="footer-links">
          <li><a href="#">Privacy</a></li>
          <li><a href="#">Terms</a></li>
          <li><a href="#">Security</a></li>
          <li><a href="#">Status</a></li>
        </ul>
      </footer>
    </div>
  )
}