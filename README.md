# StayNest — Boarding Places Portal for SUSL

StayNest is a modern, fully-responsive serverless web application designed to help students near the Sabaragamuwa University of Sri Lanka (SUSL) find and book verified boarding places.

## 🚀 Live Demo
The application is hosted on GitHub Pages.

## 🛠️ Architecture (Serverless & Client-Side)
Unlike traditional systems requiring a Flask backend and Python servers, StayNest runs entirely on the client-side, powered by:
- **Frontend**: HTML5, Vanilla CSS3 (with premium dynamic styling), and Modern ES6 JavaScript.
- **Backend-as-a-Service (BaaS)**: **Firebase Auth** (Google Single Sign-In & Email/Password) and **Firebase Realtime Database** for instant, secure data synchronization.
- **Hosting**: GitHub Pages (Frontend static hosting).

## ✨ Key Features
- **Interactive Map Search**: Built-in map search with real-time walking distance calculations to different faculties of SUSL.
- **Real-time Messaging**: Instant communication thread between students and property owners.
- **Smart Mobile-First UI**: Fully optimized layout for mobile viewports including grid lists and details views.
- **Google Maps Integration**: Direct coordinates extraction from Google Maps links.
- **Real-Time Notifications**: Instant toast messages for newly arrived inbox inquiries.

## ⚙️ How to Deploy on GitHub Pages
1. Push this repository to GitHub.
2. Go to **Settings** -> **Pages** in your GitHub repository, and select the branch you want to deploy from.
3. **Important**: Go to your **Firebase Console** -> **Authentication** -> **Settings** -> **Authorized Domains** and add your GitHub Pages domain (e.g., `saliyawickramasingha4-new.github.io`).
