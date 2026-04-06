import { useRef, useState } from 'react'

export default function Coin3D({ size = 280, onFlyAway, flying = false }) {
  const coinRef = useRef(null)
  const [hovered, setHovered] = useState(false)

  return (
    <div className="coin-scene" style={{ width: size, height: size }}>
      <div
        ref={coinRef}
        className={`coin-3d ${hovered ? 'fast' : ''} ${flying ? 'fly-away' : ''}`}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        {/* Rim glow */}
        <div className="coin-rim" />

        {/* Front face */}
        <div className="coin-face coin-front">
          <span className="coin-symbol">₹</span>
        </div>

        {/* Back face */}
        <div className="coin-face coin-back">
          <span className="coin-symbol" style={{ fontSize: '3rem', opacity: 0.8 }}>F</span>
        </div>
      </div>
    </div>
  )
}