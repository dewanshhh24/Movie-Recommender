from flask import Flask, request, jsonify
from flask_cors import CORS
import pickle
import difflib

# -------------------- APP SETUP --------------------
app = Flask(__name__)

CORS(
    app,
    resources={r"/*": {"origins": "*"}},
    supports_credentials=True
)

# -------------------- LOAD DATA --------------------
movies_data = pickle.load(open("movies.pkl", "rb"))
similarity = pickle.load(open("similarity.pkl", "rb"))

# -------------------- EXTRACT GENRES (DEBUG) --------------------
all_genres = set()
for g in movies_data["genres"]:
    if isinstance(g, str):
        for genre in g.split():
            all_genres.add(genre)

ALL_GENRES = sorted(list(all_genres))
print("Available genres:", ALL_GENRES)

# -------------------- GENRE NORMALIZATION --------------------
# Frontend genre -> Dataset genre mapping
GENRE_MAP = {
    "Sci-Fi": ["Science", "Fiction"]
}

# -------------------- RECOMMEND FUNCTION --------------------
def recommend(movie_name=None, genres=None, top_n=10):
    filtered_movies = movies_data.copy()

    # ---------- GENRE FILTERING ----------
    if genres and len(genres) > 0:
        expanded_genres = []

        for g in genres:
            if g in GENRE_MAP:
                expanded_genres.extend(GENRE_MAP[g])
            else:
                expanded_genres.append(g)

        expanded_genres = [g.lower() for g in expanded_genres]

        filtered_movies = filtered_movies[
            filtered_movies["genres"]
            .str.lower()
            .apply(lambda x: any(g in x for g in expanded_genres))
        ]

    # ---------- MOVIE + GENRE (HYBRID) ----------
    if movie_name:
        titles = filtered_movies["title"].tolist()
        matches = difflib.get_close_matches(movie_name, titles)

        if not matches:
            return []

        matched_title = matches[0]

        idx = filtered_movies[
            filtered_movies.title == matched_title
        ]["index"].values[0]

        similarity_scores = list(enumerate(similarity[idx]))
        sorted_movies = sorted(
            similarity_scores, key=lambda x: x[1], reverse=True
        )

        recommendations = []
        for score in sorted_movies:
            movie_index = score[0]
            title = movies_data[
                movies_data.index == movie_index
            ]["title"].values[0]

            if title not in recommendations:
                recommendations.append(title)

            if len(recommendations) == top_n:
                break

        return recommendations

    # ---------- ONLY GENRE BASED ----------
    return filtered_movies["title"].head(top_n).tolist()

# -------------------- API ROUTE --------------------
@app.route("/recommend", methods=["POST"])
def recommend_api():
    data = request.get_json(force=True)

    movie = data.get("movie")
    genres = data.get("genres")

    recommendations = recommend(
        movie_name=movie,
        genres=genres
    )

    return jsonify({
        "recommendations": recommendations
    })

# -------------------- RUN SERVER --------------------
if __name__ == "__main__":
    app.run(debug=True)
