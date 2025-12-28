# Cryptocurrency Dashboard

A dynamic, real-time cryptocurrency dashboard built with Remix and React that displays live exchange rates from the Coinbase API. Features include drag-and-drop reordering, filtering, auto-refresh, and dark/light mode support.

## Technologies Used

- **Framework**: [Remix](https://remix.run/) v2.17.2 - Full-stack React framework
- **Runtime**: Node.js 24.12.0 (via Volta)
- **Language**: TypeScript 5.9.3
- **Build Tool**: Vite 6.4.1
- **UI Libraries**:
  - React 18.3.1
  - @dnd-kit/core & @dnd-kit/sortable - Drag and drop functionality
- **Testing**:
  - Vitest 4.0.16
  - @testing-library/react 16.3.1
  - @testing-library/user-event 14.6.1
- **Code Quality**:
  - ESLint 9.39.2
  - TypeScript ESLint
- **Styling**: CSS Modules with CSS Variables for theming

## Project Structure

```
coinbase-dash/
├── app/
│   ├── components/          # React components
│   │   ├── crypto-dash/     # Crypto dashboard components
│   │   │   ├── CryptoCard.tsx          # Individual crypto card component
│   │   │   ├── CryptoCard.module.css   # CryptoCard styles
│   │   │   ├── CryptoList.tsx          # List with drag-and-drop
│   │   │   ├── CryptoList.module.css   # CryptoList styles
│   │   │   ├── RefreshControls.tsx     # Refresh controls component
│   │   │   ├── RefreshControls.module.css # RefreshControls styles
│   │   │   ├── ThemeToggle.tsx         # Theme toggle component
│   │   │   └── ThemeToggle.module.css  # ThemeToggle styles
│   │   └── index.ts         # Component exports
│   ├── hooks/               # Custom React hooks
│   │   ├── useTheme.ts      # Theme management hook
│   │   └── index.ts         # Hook exports
│   ├── lib/                 # Utilities and API clients
│   │   ├── apis/
│   │   │   └── coinbase/    # Coinbase API integration
│   │   │       ├── coinbase.ts      # API client
│   │   │       ├── constants.ts     # API constants
│   │   │       └── types.ts        # TypeScript types
│   │   ├── utils/           # Shared utilities
│   │   │   └── theme-utils.ts # Theme utility functions
│   │   └── index.ts         # Library exports
│   ├── routes/              # Remix routes
│   │   ├── _index.tsx       # Home route (redirect to crypto-dash)
│   │   └── crypto-dash.tsx  # Main dashboard route
│   ├── styles/              # Global styles
│   │   ├── variables.css    # CSS variables & theme
│   │   ├── theme.css        # Theme styles
│   │   └── crypto-dash.module.css # Route-specific styles
│   └── root.tsx             # App root component
├── public/                  # Static assets
│   └── theme-init.js        # Theme initialization script
├── docs/                    # Documentation
│   ├── requirements.md      # Project requirements
│   └── notes.txt            # Development notes
├── eslint.config.js         # ESLint configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

## Requirements Completed

### Core Requirements

- **Cryptocurrency Card Layout**
  - Responsive card-based layout displaying 10+ cryptocurrencies
  - Each card shows: name, symbol, USD rate, and BTC rate
  - Fully responsive design

- **Dynamic Data Fetching**
  - Real-time data from Coinbase API
  - Manual refresh button
  - Auto-refresh toggle (5-second intervals)
  - Loading states during refresh

- **Drag & Drop Reordering**
  - Full drag-and-drop functionality using @dnd-kit
  - Order persists during session
  - Smooth animations and visual feedback

- **Filtering**
  - Filter input at top of page
  - Case-insensitive filtering by name or symbol
  - Real-time filtering as you type

### Bonus Features

- **Dark/Light Mode Toggle**
  - Theme toggle button in header
  - Persists preference to localStorage
  - Respects system preference on first visit
  - Prevents FOUC (Flash of Unstyled Content)

- **Loading and Error States**
  - Loading spinner during data fetch
  - Disabled state for refresh button while loading
  - Empty state messages for no data/no matches
  - Error handling with fallback to empty array

- **Unit Tests**
  - Comprehensive test coverage (32 tests)
  - Tests for components, hooks, routes, and API clients
  - Uses Vitest and React Testing Library

## Start-Up Steps

### 1. Clone the Project

```bash
git clone https://github.com/velveetachef/coinbase-dash.git
cd coinbase-dash
```

### 2. Set Up Volta

This project uses [Volta](https://volta.sh/) to manage Node.js and npm versions.

**Install Volta** (if not already installed):

```bash
# macOS/Linux
curl https://get.volta.sh | bash

# Windows
# Download and run the installer from https://volta.sh/
```

**Verify Volta is installed:**

```bash
volta --version
```

Volta will automatically use the correct Node.js (24.12.0) and npm (11.6.2) versions as specified in `package.json` when you run npm commands.

### 3. Install Dependencies

```bash
npm install
```

This will install all project dependencies. Volta will automatically switch to the correct Node.js version if needed.

### 4. Start Development Server

```bash
npm run dev
```

The application will be available at `http://localhost:5173` (or the port shown in the terminal).

### Additional Commands

```bash
# Run tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with UI
npm run test:ui

# Build for production
npm run build

# Start production server
npm start

# Lint code
npm run lint

# Fix linting issues
npm run lint:fix
```

## Notes & Decisions

- **remix scaffold**: used the quick start guide: https://v2.remix.run/docs/start/quickstart (without react router v7)
- **CryptoCurrency list**: symbol to name mapping sourced from public endpoint `https://api.coinbase.com/v2/currencies/crypto` and saved in constant `cryptoNamesBySymbol` for demo simplicity.
- **Exchange Rates API**: USD and BTC exchange rates sourced form public endpoint `https://api.coinbase.com/v2/exchange-rates?currency=<currency>`
- **Theme Initialization**: Uses an inline script in `public/theme-init.js` to prevent FOUC (Flash of Unstyled Content) by setting the theme before React hydrates
- **API Integration**: Centralized API client in `app/lib/apis/coinbase/` for maintainability
- **Component Architecture**: Modular components with CSS Modules for scoped styling
- **State Management**: Uses React hooks and Remix's built-in data loading
- **Error Handling**: Graceful error handling with fallbacks and user-friendly messages
- **Accessibility**: ARIA labels and keyboard navigation support

## License

ISC
