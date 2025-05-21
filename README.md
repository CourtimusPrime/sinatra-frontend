# Sinatra Frontend

Sinatra is a modern, React-based web application for sharing your music taste with the world. Connect your Spotify account, showcase your favorite tracks, genres, and playlists, and generate a beautiful public music profile to share with friends.

---

## 🚀 Features

- **Spotify Login:** Secure OAuth login with Spotify.
- **Public Music Profile:** Share a unique link to your music taste, including top genres, sub-genres, and playlists.
- **Featured Playlists:** Select and display your favorite playlists.
- **Live Playback:** Show your most recently played track, updated in real-time.
- **Genre Analysis:** Visualize your top genres and sub-genres with interactive bar charts.
- **Profile Customization:** Edit your display name and profile picture, including cropping and preset avatars.
- **Responsive Design:** Mobile-friendly and fast, with smooth transitions and animations.
- **Settings & Account Management:** Edit featured playlists, log out, or delete your account.
- **Onboarding Flow:** Guided onboarding for new users to select playlists and set up their profile.

---

## 🛠️ Tech Stack

- **Frontend:** React 18, React Router 6, Tailwind CSS, Motion One (animations)
- **Build Tool:** Vite
- **State Management:** React Context API
- **API:** Communicates with a backend (default: `http://localhost:8000`)
- **Other Libraries:**  
  - `react-easy-crop` for profile image cropping  
  - `lucide-react` for icons  
  - `d3` for data visualization  
  - `react-swipeable` for mobile gestures

---

## 📦 Project Structure

```
sinatra-frontend/
├── public/                # Static assets (robots.txt, favicon, etc.)
├── src/
│   ├── components/        # Reusable UI components
│   ├── context/           # React Context (UserContext)
│   ├── pages/             # Route-based pages (home, onboard, landing, etc.)
│   ├── styles/            # CSS and Tailwind styles
│   ├── themes/            # Theme customization options
│   ├── utils/             # Utility functions (API, image cropping, etc.)
│   ├── constants/         # Static data (meta genres, etc.)
│   └── main.jsx           # App entry point
├── index.html             # Main HTML file
├── package.json           # Project metadata and scripts
├── tailwind.config.js     # Tailwind CSS config
├── postcss.config.js      # PostCSS config
├── vite.config.js         # Vite config (dev server, proxy, build)
├── vercel.json            # Vercel deployment config
└── .gitignore
```

---

## 🧑‍💻 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) (v18+ recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Installation

1. **Clone the repository:**
   ```sh
   git clone https://github.com/yourusername/sinatra-frontend.git
   cd sinatra-frontend
   ```

2. **Install dependencies:**
   ```sh
   npm install
   # or
   yarn install
   ```

3. **Configure environment variables:**
   - Create a `.env` file (if needed) and set `VITE_API_BASE_URL` to your backend API URL (default is `http://localhost:8000`).

4. **Run the development server:**
   ```sh
   npm run dev
   # or
   yarn dev
   ```

   The app will be available at [http://localhost:5173](http://localhost:5173) (default Vite port).

---

## ⚙️ Configuration

- **API Proxy:**  
  The Vite dev server proxies API requests (see [`vite.config.js`](vite.config.js)).  
  Update the proxy targets if your backend runs on a different port.

- **Tailwind CSS:**  
  Tailwind is configured via [`tailwind.config.js`](tailwind.config.js) and used throughout the app.

- **Deployment:**  
  Vercel deployment is supported via [`vercel.json`](vercel.json).  
  All routes are rewritten to `index.html` for SPA support.

---

## 📝 Scripts

| Command         | Description                  |
|-----------------|-----------------------------|
| `npm run dev`   | Start local dev server      |
| `npm run build` | Build for production        |
| `npm run preview` | Preview production build  |
| `npm run lint`  | Run ESLint                  |

---

## 🖼️ Customization

- **Themes & Fonts:**  
  See [`src/themes/customizations.js`](src/themes/customizations.js) for background, font, and text color options.

- **Profile Avatars:**  
  Preset avatars are available in `/avatars/`.  
  Users can upload and crop their own images.

---

## 🧩 Notable Files

- [`src/App.jsx`](src/App.jsx): Main app routes and layout.
- [`src/context/UserContext.jsx`](src/context/UserContext.jsx): User authentication and state.
- [`src/pages/home.jsx`](src/pages/home.jsx): Main dashboard after login.
- [`src/pages/onboard.jsx`](src/pages/onboard.jsx): Onboarding flow for new users.
- [`src/components/ui/MusicTaste.jsx`](src/components/ui/MusicTaste.jsx): Genre and sub-genre visualization.
- [`src/components/ui/ProfileImageEditor.jsx`](src/components/ui/ProfileImageEditor.jsx): Profile image cropping and selection.

---

## 🛡️ License

This is a commercial application, and may not be copied or replicated in any way. All rights are reserved by the owner, @CourtimusPrime. 

---

## 🙏 Acknowledgements

- [Spotify Web API](https://developer.spotify.com/documentation/web-api/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Motion One](https://motion.dev/)
- [Lucide Icons](https://lucide.dev/)

---

## 📣 Contributing

Pull requests and issues are welcome!  
Please open an issue to discuss major changes before submitting a PR.

---

## 📬 Contact

Questions? Suggestions?  
<<<<<<< HEAD
Open an issue or reach out at [sinatra.live](https://sinatra.live).
=======
Open an issue or reach out at [sinatra.live](https://sinatra.live).

---
>>>>>>> ce6e23462d273775e5259a133f9f4d014e1acb91
