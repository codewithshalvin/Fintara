// ── INR FORMATTERS ────────────────────────────────────
export const INR = (v) =>
  '₹' + Math.abs(v).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const INR_SHORT = (v) => {
  const n = Math.abs(v)
  if (n >= 10000000) return '₹' + (n / 10000000).toFixed(1) + 'Cr'
  if (n >= 100000)   return '₹' + (n / 100000).toFixed(1) + 'L'
  if (n >= 1000)     return '₹' + (n / 1000).toFixed(1) + 'K'
  return '₹' + n.toFixed(0)
}

// ── CREDIT CARDS CONFIG ────────────────────────────────
export const CREDIT_CARDS = [
  {
    id: 'visa',
    bank: 'Fintara',
    type: 'Visa Premier',
    number: '•••• •••• •••• 4821',
    holder: 'Raj',
    expiry: '08/27',
    bg: 'linear-gradient(135deg, #1a5c4a 0%, #0d7a6b 100%)',
    network: 'visa',
    color: '#0d7a6b',
  },
  {
    id: 'mc',
    bank: 'HDFC Bank',
    type: 'Mastercard Elite',
    number: '•••• •••• •••• 7340',
    holder: 'Raj',
    expiry: '03/26',
    bg: 'linear-gradient(135deg, #2c2c2c 0%, #444444 100%)',
    network: 'mc',
    color: '#eb001b',
  },
  {
    id: 'amex',
    bank: 'Amex',
    type: 'Gold Card',
    number: '•••• •••••• •1006',
    holder: 'Raj',
    expiry: '11/28',
    bg: 'linear-gradient(135deg, #b8952a 0%, #d4a93a 100%)',
    network: 'amex',
    color: '#b8952a',
  },
]

// ── MOCK TRANSACTIONS ──────────────────────────────────
export const INITIAL_TRANSACTIONS = [
  { id: 1,  date: '2025-06-01', merchant: 'Netflix',         category: 'Entertainment', type: 'expense', amount: -1325,  cardId: 'mc'   },
  { id: 2,  date: '2025-06-02', merchant: 'Salary Deposit',  category: 'Income',        type: 'income',  amount: 432000, cardId: 'visa' },
  { id: 3,  date: '2025-06-03', merchant: 'BigBasket',       category: 'Groceries',     type: 'expense', amount: -7265,  cardId: 'visa' },
  { id: 4,  date: '2025-06-04', merchant: 'Ola',             category: 'Transport',     type: 'expense', amount: -1840,  cardId: 'mc'   },
  { id: 5,  date: '2025-06-05', merchant: 'Freelance Pay',   category: 'Income',        type: 'income',  amount: 99800,  cardId: 'mc'   },
  { id: 6,  date: '2025-06-06', merchant: 'Café Coffee Day', category: 'Food & Drink',  type: 'expense', amount: -560,   cardId: 'visa' },
  { id: 7,  date: '2025-06-07', merchant: 'Flipkart',        category: 'Shopping',      type: 'expense', amount: -11150, cardId: 'mc'   },
  { id: 8,  date: '2025-06-08', merchant: 'Cult.fit',        category: 'Health',        type: 'expense', amount: -4150,  cardId: 'amex' },
  { id: 9,  date: '2025-06-09', merchant: 'Dividend',        category: 'Income',        type: 'income',  amount: 26600,  cardId: 'visa' },
  { id: 10, date: '2025-06-10', merchant: 'Spotify',         category: 'Entertainment', type: 'expense', amount: -830,   cardId: 'amex' },
  { id: 11, date: '2025-06-11', merchant: 'BESCOM Bill',     category: 'Utilities',     type: 'expense', amount: -6510,  cardId: 'visa' },
  { id: 12, date: '2025-06-12', merchant: 'Swiggy',          category: 'Food & Drink',  type: 'expense', amount: -2660,  cardId: 'visa' },
  { id: 13, date: '2025-06-13', merchant: 'Rent',            category: 'Housing',       type: 'expense', amount: -99700, cardId: 'visa' },
  { id: 14, date: '2025-06-14', merchant: 'Side Project',    category: 'Income',        type: 'income',  amount: 41500,  cardId: 'amex' },
  { id: 15, date: '2025-06-15', merchant: 'Apollo Pharmacy', category: 'Health',        type: 'expense', amount: -1945,  cardId: 'mc'   },
  { id: 16, date: '2025-05-20', merchant: 'Zomato',          category: 'Food & Drink',  type: 'expense', amount: -3200,  cardId: 'visa' },
  { id: 17, date: '2025-05-22', merchant: 'MakeMyTrip',      category: 'Travel',        type: 'expense', amount: -18500, cardId: 'amex' },
  { id: 18, date: '2025-05-25', merchant: 'LIC Premium',     category: 'Insurance',     type: 'expense', amount: -12000, cardId: 'amex' },
  { id: 19, date: '2025-05-28', merchant: 'Zerodha Gains',   category: 'Income',        type: 'income',  amount: 15400,  cardId: 'visa' },
  { id: 20, date: '2025-06-16', merchant: 'BookMyShow',      category: 'Entertainment', type: 'expense', amount: -1500,  cardId: 'mc'   },
  { id: 21, date: '2025-05-01', merchant: 'Netflix',         category: 'Entertainment', type: 'expense', amount: -1325,  cardId: 'mc'   },
  { id: 22, date: '2025-04-01', merchant: 'Netflix',         category: 'Entertainment', type: 'expense', amount: -1325,  cardId: 'mc'   },
  { id: 23, date: '2025-03-01', merchant: 'Netflix',         category: 'Entertainment', type: 'expense', amount: -999,   cardId: 'mc'   },
  { id: 24, date: '2025-05-04', merchant: 'Ola',             category: 'Transport',     type: 'expense', amount: -2100,  cardId: 'mc'   },
  { id: 25, date: '2025-04-18', merchant: 'Ola',             category: 'Transport',     type: 'expense', amount: -950,   cardId: 'visa' },
  { id: 26, date: '2025-05-12', merchant: 'Swiggy',          category: 'Food & Drink',  type: 'expense', amount: -1890,  cardId: 'visa' },
  { id: 27, date: '2025-04-22', merchant: 'Swiggy',          category: 'Food & Drink',  type: 'expense', amount: -3400,  cardId: 'visa' },
  { id: 28, date: '2025-03-15', merchant: 'Swiggy',          category: 'Food & Drink',  type: 'expense', amount: -2100,  cardId: 'visa' },
  { id: 29, date: '2025-05-13', merchant: 'Rent',            category: 'Housing',       type: 'expense', amount: -99700, cardId: 'visa' },
  { id: 30, date: '2025-04-13', merchant: 'Rent',            category: 'Housing',       type: 'expense', amount: -99700, cardId: 'visa' },
  { id: 31, date: '2025-05-02', merchant: 'Salary Deposit',  category: 'Income',        type: 'income',  amount: 432000, cardId: 'visa' },
  { id: 32, date: '2025-04-02', merchant: 'Salary Deposit',  category: 'Income',        type: 'income',  amount: 415000, cardId: 'visa' },
  { id: 33, date: '2025-05-08', merchant: 'Cult.fit',        category: 'Health',        type: 'expense', amount: -4150,  cardId: 'amex' },
  { id: 34, date: '2025-04-08', merchant: 'Cult.fit',        category: 'Health',        type: 'expense', amount: -3999,  cardId: 'amex' },
  { id: 35, date: '2025-05-10', merchant: 'Spotify',         category: 'Entertainment', type: 'expense', amount: -830,   cardId: 'amex' },
  { id: 36, date: '2025-04-10', merchant: 'Spotify',         category: 'Entertainment', type: 'expense', amount: -830,   cardId: 'amex' },
]

// ── COLORS ─────────────────────────────────────────────
export const SPENDING_COLORS = ['#C8922A','#1A8B9D','#E24B4A','#534AB7','#639922','#D85A30','#378ADD','#D4537E','#888780']

export const CAT_COLORS = {
  Housing: '#E24B4A', Groceries: '#639922', 'Food & Drink': '#BA7517',
  Entertainment: '#534AB7', Transport: '#1D9E75', Shopping: '#D85A30',
  Health: '#D4537E', Utilities: '#378ADD', Income: '#4CAF50',
  Travel: '#0F6E56', Insurance: '#3C3489', Other: '#888780'
}

export const CATEGORIES = ['All', 'Income', 'Groceries', 'Food & Drink', 'Entertainment',
  'Transport', 'Shopping', 'Health', 'Utilities', 'Housing', 'Travel', 'Insurance']

// ── BALANCE TREND DATA ─────────────────────────────────
export const BALANCE_TREND = [
  { month: 'Jan', balance: 1510000, income: 498000, expenses: 340000 },
  { month: 'Feb', balance: 1610000, income: 481000, expenses: 323000 },
  { month: 'Mar', balance: 1569000, income: 456000, expenses: 398000 },
  { month: 'Apr', balance: 1760000, income: 597600, expenses: 340000 },
  { month: 'May', balance: 1893000, income: 531200, expenses: 323000 },
  { month: 'Jun', balance: 2024000, income: 599300, expenses: 337000 },
]

export const SPARKLINE_DATA = [
  { v: 320000 }, { v: 380000 }, { v: 290000 }, { v: 420000 },
  { v: 390000 }, { v: 460000 }, { v: 380000 }, { v: 530000 },
  { v: 480000 }, { v: 599300 },
]

// ── MERCHANT ICON MAP (keys only — Icons imported separately) ──
export const MERCHANT_ICON_KEYS = {
  'Netflix':          'film',
  'Salary Deposit':   'briefcase',
  'BigBasket':        'cart',
  'Ola':              'car',
  'Freelance Pay':    'laptop',
  'Café Coffee Day':  'coffee',
  'Flipkart':         'package',
  'Cult.fit':         'dumbbell',
  'Dividend':         'dividend',
  'Spotify':          'music',
  'BESCOM Bill':      'zap',
  'Swiggy':           'pizza',
  'Rent':             'home',
  'Side Project':     'rocket',
  'Apollo Pharmacy':  'pill',
  'Zomato':           'pizza',
  'MakeMyTrip':       'plane',
  'LIC Premium':      'shield',
  'Zerodha Gains':    'zerodha',
  'BookMyShow':       'ticket',
  'Amazon':           'package',
}