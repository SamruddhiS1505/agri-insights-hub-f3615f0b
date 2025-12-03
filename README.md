# Smart Crop Advisory System (Frontend)

A farmer-friendly dashboard to enter crop data, view time-series graphs, see analytics, and download PNG plots from the backend.

## Features

- **Dashboard**: Record crop data with an intuitive form interface
- **Time Series Analysis**: View trends and forecast future values with Chart.js visualizations
- **Statistics Overview**: Aggregate statistics for crop data by metric type
- **Responsive Design**: Mobile-friendly layout that works on all devices
- **Modern UI**: Clean, agricultural-themed design with green accents

## Tech Stack

- React 18 with TypeScript
- Vite (build tool)
- TailwindCSS (styling)
- Chart.js + react-chartjs-2 (time-series visualization)
- Axios (REST API calls)
- React Router (navigation)

## Getting Started

### Prerequisites

- Node.js 18+ and npm installed

### Installation

1. Clone the repository:
   ```bash
   git clone <YOUR_GIT_URL>
   cd <YOUR_PROJECT_NAME>
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Set environment variable for the API URL:
   ```bash
   # Create a .env file in the root directory
   echo 'VITE_API_URL="http://localhost:8000"' > .env
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. Open your browser and navigate to `http://localhost:8080`

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API base URL | `http://localhost:8000` |

## Backend API Endpoints

This frontend expects the following backend endpoints:

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/data` | Submit crop data |
| GET | `/api/data` | Retrieve all crop data |
| GET | `/api/timeseries` | Get time series analysis |
| GET | `/api/plot` | Download PNG plot |
| GET | `/api/stats` | Get statistics |

## Project Structure

```
src/
├── api/
│   └── api.ts              # Axios client & API functions
├── components/
│   ├── DataForm.tsx        # Farmer input form
│   ├── Layout.tsx          # Main layout wrapper
│   ├── Sidebar.tsx         # Navigation sidebar
│   ├── StatsTable.tsx      # Statistics table component
│   ├── TimeSeriesChart.tsx # Chart.js graph component
│   └── ui/                 # Shadcn UI components
├── pages/
│   ├── Dashboard.tsx       # Home + input form
│   ├── TimeSeries.tsx      # Graph page
│   ├── Stats.tsx           # Event count page
│   └── NotFound.tsx        # 404 page
├── App.tsx                 # Main app with routing
├── main.tsx                # Entry point
└── index.css               # Tailwind & design system
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## Design

The UI follows an agricultural theme with:
- Forest green primary color
- Golden harvest accents
- Clean, card-based layouts
- Accessible form inputs
- Responsive mobile-first design

## License

MIT
