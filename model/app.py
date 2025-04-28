from flask import Flask, request, jsonify
from sentence_transformers import SentenceTransformer
import numpy as np
import json
from sklearn.metrics.pairwise import cosine_similarity
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # enable CORS for all routes

# load model and data at startup
model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")
restaurant_embeddings = np.load("embeddings.npy")
with open("restaurants.json", "r") as f:
    restaurants = json.load(f)


@app.route('/recommend', methods=['POST'])
def recommend():
    data = request.json
    user_query = data.get('query', '')

    if not user_query:
        return jsonify({"error": "No query provided"}), 400

    # generate embedding for user query
    user_embedding = model.encode(user_query)

    # calculate similarity with restaurant embeddings
    similarities = cosine_similarity([user_embedding], restaurant_embeddings)[0]

    # top 3 matches
    top_n = 3
    top_indices = np.argsort(similarities)[::-1][:top_n]

    recommended_ids = [restaurants[idx]['id'] for idx in top_indices]

    return jsonify({"recommended_ids": recommended_ids})


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)