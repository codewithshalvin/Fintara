# ◆ Fintara — Fintech Finance Dashboard

A production-quality fintech web application built with **React + Vite**, featuring animated UI, role-based access, and full financial dashboard functionality.

---

## 🚀 Quick Start

```bash
# 1. Install dependencies
npm install

# 2. Start dev server
npm run dev

# 3. Open in browser
http://localhost:5173
```

---

## 📁 Project Structure

```
src/
├── context/
│   └── ThemeContext.jsx      # Global dark/light theme state
├── pages/
│   ├── LandingPage.jsx       # Landing page with coin animation
│   ├── SignIn.jsx            # Login page
│   ├── SignUp.jsx            # Registration page
│   └── Dashboard.jsx        # Main dashboard (Overview, Transactions, Insights)
├── components/
│   ├── Navbar.jsx            # Responsive top navigation
│   ├── Coin3D.jsx            # CSS 3D rotating coin
│   └── Wallet.jsx            # Wallet card with drop animation
├── App.jsx                   # Router + auth state
├── main.jsx                  # Entry point
└── index.css                 # Global styles + CSS variables
```

---

## 🎨 Design System

### Theme Colors
| Token | Dark Mode | Light Mode |
|-------|-----------|------------|
| `--bg-primary` | `#1A1108` warm black | `#FFF5F4` warm white |
| `--accent` | `#C8922A` amber gold | `#61B430` green |
| `--accent-bright` | `#F0B840` bright gold | `#1A8B9D` teal |
| `--text-primary` | `#F5E6C8` cream | `#111111` |

**Dark theme** → inspired by image 2 palette (warm blacks, dark navy, amber gold)  
**Light theme** → inspired by image 1 palette (#FFF5F4, #61D430, #1A8B9D, #000)

### Typography
- **Display font:** `Syne` (headings, logo, bold numbers)
- **Body font:** `Outfit` (all body text, UI elements)

---

## ✨ Key Features

### Landing Page
- **Animated 3D CSS coin** — rotates continuously, speeds up on hover
- **"Our Services" click animation** — coin spins fast → flies off screen → page scrolls → coin drops into wallet with bounce effect
- **Theme toggle** — switches between warm dark and soft light themes
- **Floating particle system** — ambient background particles
- **Hero stats**, **service cards grid**, **wallet**, **feature row**, **footer**

### Auth Pages (Sign In / Sign Up)
- Split-panel layout: animated coin on the left, form on the right
- **Demo login buttons** — instantly enter as Viewer or Admin
- Form validation with error messages
- Redirects to dashboard after login

### Dashboard

#### Overview
- **4 Summary cards** — Total Balance, Income, Expenses, Net Savings with % change
- **Area chart** — 6-month income vs expenses trend (Recharts)
- **Donut chart** — Spending breakdown by category with legend
- Recent transactions preview table

#### Transactions
- **Full sortable table** — click column headers to sort (date, merchant, category, amount)
- **Search bar** — live filter by merchant or category name
- **Category filter dropdown** — filter by spending category
- **Type filter** — All / Income / Expense
- **Export CSV** — downloads filtered transactions as CSV
- **Admin only:** Delete transaction button visible
- Empty state UI when no results match

#### Insights
- **Highest spending category** card
- **Savings rate** with contextual advice
- **Average daily spend** card
- **Income vs last month** comparison card
- **Monthly bar chart** — income vs expenses per month
- **Category spending bars** — horizontal progress bars with percentages

### Role-Based UI (RBAC Simulation)
| Feature | Viewer | Admin |
|---------|--------|-------|
| View dashboard | ✅ | ✅ |
| View transactions | ✅ | ✅ |
| View insights | ✅ | ✅ |
| Add transaction | ❌ | ✅ |
| Delete transaction | ❌ | ✅ |
| Role badge shown | 👁 Viewer | ⚡ Admin |

Switch roles via the sidebar dropdown at any time — UI updates instantly.

### State Management
All state is managed with React `useState` and `useMemo` (no external library needed at this scale):
- `transactions` — full list, mutated by add/delete (Admin)
- `search`, `filterCat`, `filterType` — filter state
- `sortField`, `sortDir` — sorting state
- `role` — current active role
- `theme` — persisted in `localStorage` via Context

---

## 📱 Responsive Design
- **Desktop:** Full sidebar + main content layout
- **Tablet/Mobile:** Sidebar hidden, single-column layout
- Cards grid adapts via `auto-fit minmax`
- Chart containers use `ResponsiveContainer`

---

## 🔧 Tech Stack
| Tool | Purpose |
|------|---------|
| React 18 | UI framework |
| Vite 5 | Build tool + dev server |
| React Router v6 | Client-side routing |
| Recharts | AreaChart + PieChart |
| CSS Custom Properties | Theming system |
| Google Fonts | Syne + Outfit |

---

## 🌐 Pages & Routes
| Route | Component | Description |
|-------|-----------|-------------|
| `/` | LandingPage | Marketing page with coin animation |
| `/signin` | SignIn | Login form |
| `/signup` | SignUp | Registration form |
| `/dashboard` | Dashboard | Protected dashboard (requires auth) |

---

## 💡 Design Decisions
1. **Pure CSS 3D coin** — no Three.js needed, just `transform-style: preserve-3d` + `conic-gradient` for the metallic look
2. **CSS variables for theming** — toggling `data-theme` attribute on `<html>` swaps the entire palette instantly
3. **useMemo for filtering** — expensive filter+sort operations are memoized to avoid re-computation on unrelated renders
4. **No backend** — auth is simulated; real implementation would call an API and store JWT
5. **Coin-to-wallet animation** — pure CSS `@keyframes` triggered by adding/removing class names

---

## 🔮 Possible Enhancements
- LocalStorage persistence for transactions
- Mock API with `json-server` or `MSW`
- Framer Motion for page transitions
- Budget limits with alert system
- PDF/Excel export
- Dark/light preference synced with OS `prefers-color-scheme`
