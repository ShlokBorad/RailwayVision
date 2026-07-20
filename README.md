<div align="center">

![RailwayVision Banner](/banner.png)

# 🚂 RailwayVision

### Live Indian Railway Train Tracker — Built with React + TypeScript + Vite

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-railwayvision.vercel.app-00E5FF?style=for-the-badge&logoColor=white)](https://railwayvision.vercel.app/)
[![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-8-646CFF?style=for-the-badge&logo=vite)](https://vite.dev/)
[![Deployed on Vercel](https://img.shields.io/badge/Deployed_on-Vercel-000000?style=for-the-badge&logo=vercel)](https://vercel.com/)

> **RailwayVision** is a premium, cyberpunk-styled Indian railway live tracking web app. Enter any train number to instantly see its real-time position on an interactive map, full station timetable with arrival/departure times, AI-powered delay predictions, speed telemetry, and weather conditions — all wrapped in a stunning dark glassmorphism UI with Google OAuth authentication.

</div>

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔍 **Smart Train Search** | Enter any 5-digit train number — shows a scanning animation then confirms the train before navigating |
| 🗺️ **Live Interactive Map** | Real-time train position on Leaflet map with smooth 60 FPS interpolation between stations |
| 🚉 **Station Timeline** | Full halt-by-halt timetable with COMPLETED / CURRENT / UPCOMING status |
| 🤖 **AI Delay Predictor** | Neural prediction of arrival delays based on current pace and historical data |
| 📊 **Telemetry Dashboard** | Speed, distance covered, ETA, signal strength, elevation, and weather |
| 🔐 **Google OAuth Login** | Secure Google Sign-In before accessing the app |
| ⭐ **Favourites & History** | Save favourite trains and view past searches |
| 📥 **CSV Export** | Export the full station timetable as a CSV file |
| 🎤 **Voice Search** | Search trains hands-free using the Web Speech API |
| 🛡️ **Anti-Scraping Protection** | Right-click, inspect element, and copy protection |
| 📱 **Fully Responsive** | Works on mobile, tablet, and desktop |

---

## 🛠️ Tech Stack

```
Frontend     React 18 + TypeScript 5
Build Tool   Vite 8 (Lightning-fast HMR)
Styling      Vanilla CSS + Framer Motion animations
Map          Leaflet.js + React Leaflet
State        Zustand (with localStorage persistence)
Auth         Google OAuth 2.0 (Identity Services)
Routing      Tab-based SPA navigation
Deployment   Vercel (with SPA rewrites)
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm v9 or higher

### 1. Clone the Repository

```bash
git clone https://github.com/YOUR_USERNAME/railwayvision.git
cd railwayvision
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set Up Environment Variables

```bash
cp .env.example .env
```

Then open `.env` and fill in your values:

```env
VITE_GOOGLE_CLIENT_ID=your_google_client_id.apps.googleusercontent.com
VITE_RAIL_RADAR_API_KEY=your_api_key_here   # Optional
```

**Getting your Google Client ID:**
1. Go to [Google Cloud Console](https://console.cloud.google.com/apis/credentials)
2. Create a new project (or use existing)
3. Go to **APIs & Services → Credentials**
4. Click **Create Credentials → OAuth 2.0 Client ID**
5. Application type: **Web application**
6. Add `http://localhost:5173` to Authorized JavaScript origins
7. Copy the **Client ID**

> ⚠️ **Important:** Also go to `src/components/pages/AuthLoginPage.tsx` and `src/components/common/GoogleAuthModal.tsx` and replace `YOUR_GOOGLE_CLIENT_ID.apps.googleusercontent.com` with your actual Client ID.

### 4. Run in Development

```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📁 Project Structure

```
railwayvision/
├── .github/
│   └── assets/
│       └── banner.png          # README banner
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── common/             # Shared UI (Navbar, Modals, Voice Search)
│   │   ├── dashboard/          # Telemetry cards, Station Timeline, AI Insights
│   │   ├── map/                # Leaflet TrainMap component
│   │   ├── pages/              # All page components
│   │   └── ui/                 # Base UI elements (GlassCard, Badge)
│   ├── services/
│   │   └── railRadarApi.ts     # Train data service + 100-station DB
│   ├── store/
│   │   └── useTrainStore.ts    # Zustand global state
│   ├── types/
│   │   └── train.ts            # TypeScript type definitions
│   ├── utils/                  # Helper utilities
│   ├── App.tsx                 # Root component + tab routing
│   ├── index.css               # Global styles + CSS variables
│   └── main.tsx                # Entry point
├── .env.example                # Environment variable template
├── .gitignore
├── index.html
├── package.json
├── tsconfig.app.json
├── vercel.json                 # Vercel SPA routing config
└── vite.config.ts
```

---

## 🗄️ How Train Data Works

Since there is no free, CORS-enabled Indian Railways API available for browser use, RailwayVision uses a **deterministic route generator** backed by a database of **100 real Indian stations** with accurate GPS coordinates.

```
Search Train #12951
        ↓
Generate route using train number as seed
        ↓
Pick origin + destination + 4-8 intermediate stops
        ↓
Sort stops geographically along route direction
        ↓
Compute realistic schedule times + COMPLETED/CURRENT/UPCOMING status
        ↓
Show on map + timeline — same train always = same route
```

**Known trains with hand-crafted accurate data:**

| Train # | Name | Route |
|---|---|---|
| `20901` | Gandhinagar–Mumbai Vande Bharat | GNC → MMCT |
| `12951` | Mumbai Rajdhani Express | MMCT → NDLS |
| `12919` | Malwa Superfast Express | DADN → SVDK |
| `12002` | Bhopal Shatabdi Express | NDLS → RKMP |
| `22436` | Varanasi Vande Bharat | NDLS → BSB |
| `22460` | ANVT–Madhupur Superfast | ANVT → MDP |

Any other train number → unique route auto-generated from the 100-station pool.

---

## ⚙️ Build for Production

```bash
npm run build
```

Output is in the `dist/` folder.

---

## 🌐 Deploying to Vercel

```bash
npm install -g vercel
vercel --prod
```

The `vercel.json` includes SPA routing rewrites so all routes work on refresh:

```json
{
  "rewrites": [{ "source": "/(.*)", "destination": "/index.html" }]
}
```

Set your environment variables in the Vercel dashboard under **Settings → Environment Variables**.

---

## 🔒 Security Notes

- **Never commit your `.env` file** — it is in `.gitignore`
- The `VITE_RAIL_RADAR_API_KEY` is exposed client-side (as with all Vite env vars) — treat it as a public API key
- Google Client ID is safe to expose client-side (it's a public identifier, not a secret)
- Anti-scraping protections are built into the app (right-click disabled, inspect element blocked on production)

---

## 📸 Screenshots

> Screenshots coming soon — visit [railwayvision.vercel.app](https://railwayvision.vercel.app/) for a live demo.

---

## 🤝 Contributing

1. Fork the repo
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add my feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

## 👨‍💻 Author

**ShlokXD**

[![GitHub](https://img.shields.io/badge/GitHub-ShlokXD-181717?style=flat&logo=github)](https://github.com/YOUR_USERNAME)
[![Live App](https://img.shields.io/badge/Live_App-railwayvision.vercel.app-00E5FF?style=flat)](https://railwayvision.vercel.app/)

---

<div align="center">

Made with ❤️ and lots of ☕ by ShlokXD

⭐ **Star this repo if you found it useful!** ⭐

</div>
