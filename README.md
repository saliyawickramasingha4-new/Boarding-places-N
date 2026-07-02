# Boarding Places — Capstone Project (DS2105)

A Flask-based boarding place management system for SUSL students, featuring:
- 🏠 Boarding listing search with map integration
- 🔐 User authentication (Student & Owner roles)
- 💬 In-app messaging between students and owners
- ❤️ Favorites / saved stays
- 📍 Haversine distance filter from SUSL faculties

## Project Structure

```
Boarding places/
├── backend/
│   ├── app/
│   │   ├── routes/          # auth, user, listing routes
│   │   ├── models/          # user, listing, favorite, message models
│   │   ├── utils/           # Helper scripts and seeding functions
│   │   ├── config.py        # App configuration & DB resolution
│   │   └── __init__.py      # Flask Application Factory
│   ├── requirements.txt     # Python dependencies
│   ├── run.py               # Application entry point
│   ├── unistay.db           # SQLite Database file
│   └── .env                 # Environment variables
├── frontend/
│   ├── static/
│   │   ├── css/style.css    # Stylesheet
│   │   ├── js/script.js     # Client-side script
│   │   ├── images/          # Image files
│   │   └── uploads/         # User uploaded media
│   └── templates/           # HTML templates (11 files)
└── README.md
```

## Running the Application

1. **Install Dependencies**:
   ```bash
   cd backend
   pip install -r requirements.txt
   ```

2. **Start the Server**:
   ```bash
   python run.py
   ```

3. **Access the App**:
   Visit: http://localhost:5000 in your browser.
