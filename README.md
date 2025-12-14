# 🎬 Movie Recommender System (Genre-Based & Hybrid) 🍿

A full-stack **Movie Recommendation System** that suggests movies based on:
- 🎥 **Movie similarity (content-based filtering)**
- 🎭 **Multiple genre selection**
- 🔀 **Hybrid approach (movie + genres)**

Built using **Python (Flask)** for the backend and **React (Vite)** for the frontend.

---

## 🚀 Features

- 🔍 Content-based movie recommendation using cosine similarity
- 🎭 Multi-genre based filtering (Action, Drama, Sci-Fi, etc.)
- 🔀 Hybrid recommendations (movie + selected genres)
- ✨ Clean, responsive, and animated UI
- 🔄 Reset functionality
- 🌐 REST API using Flask
- ⚙️ Modular & scalable project structure

---

## 🧠 Tech Stack

### Backend
- Python
- Flask
- Pandas
- Scikit-learn
- Pickle
- Flask-CORS

### Frontend
- React (Vite)
- JavaScript
- CSS (Glassmorphism + Animations)

---


---

## ⚠️ Important Note About Pickle Files (`.pkl`)

The following files are **NOT included** in this repository:

- `movies.pkl`
- `similarity.pkl`

### ❓ Why are they missing?

These files are:
- Large generated artifacts (>100 MB)
- Automatically created from the dataset
- Not suitable for version control

👉 **This follows standard ML industry practices.**

---

## 🔁 How to Generate Pickle Files (Required)

Before running the backend, you must generate the pickle files locally.

### ✅ Step 1: Go to backend folder

```bash
cd movie-recommender-backend

```
### ✅ Step 2: Run the pickle generation script

```bash
python generate_pickle.py
```

▶️ How to Run the Project
🔹 Backend (Flask)
```bash
cd movie-recommender-backend
python app.py
```
Backend will start at:
http://127.0.0.1:5000

🔹 Frontend (React)
```bash
cd movie-recommender-frontend
npm install
npm run dev
```

Frontend will start at:
http://localhost:5173

📌 Future Improvements :

Sort recommendations by rating or popularity
Genre weightage slider
Save user preferences (localStorage)
Deploy backend & frontend (Render + Vercel)
Add collaborative filtering
