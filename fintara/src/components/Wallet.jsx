import { useState } from 'react'

export default function Wallet({ coinDropped = false }) {
  return (
    <div className="wallet-container">
      <h3 className="wallet-title">Your Smart Wallet</h3>
      <div className={`wallet ${coinDropped ? 'coin-dropped' : ''}`}>
        {coinDropped && (
          <div className="coin-drop-indicator">◆</div>
        )}

        <div className="wallet-header">
          <div className="wallet-chip">
            <div /><div /><div /><div />
          </div>
          <span className="wallet-network">FINTARA NET</span>
        </div>

        <div>
          <p className="wallet-balance-label">Total Balance</p>
          <p className="wallet-balance">
            {coinDropped ? '$24,891.42' : '$24,350.00'}
          </p>
          <p className="wallet-balance-change">
            {coinDropped ? '▲ +$541.42 coin received!' : '▲ +2.4% this month'}
          </p>
        </div>

        <div className="wallet-divider" />

        <p className="wallet-address">
          0x4f8B...3a2C · 1FtAra...9bX2 · fintara.wallet
        </p>

        <div className="wallet-actions">
          <button className="wallet-btn send">↑ Send</button>
          <button className="wallet-btn receive">↓ Receive</button>
          <button className="wallet-btn" style={{ flex: 0.6 }}>⇄ Swap</button>
        </div>
      </div>
    </div>
  )
}
