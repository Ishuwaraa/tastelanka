from sentence_transformers import SentenceTransformer
import numpy as np
import json

model = SentenceTransformer("sentence-transformers/all-MiniLM-L6-v2")

restaurants = [
    {"id": "67e8f0636bf54e9ce766f47d", "description": "Spicy kottu roti with chicken, perfect for late-night cravings in Colombo."},
    {"id": "67ea2b76652270dd19caaa7d", "description": "Authentic Jaffna-style spicy crab curry with fresh seafood."},
    {"id": "67e8f0636bf54e9ce766f47d", "description": "Traditional Sri Lankan rice & curry with a variety of vegetarian and meat options."},
    {"id": "67ea2b76652270dd19caaa7d", "description": "Cozy spot in Kandy serving premium Ceylon tea and Sri Lankan short eats."},
    {"id": "67e8f0636bf54e9ce766f47d", "description": "Fresh seafood platters including prawns, lobster, and cuttlefish by the beach."},
]

# convert restaurant descriptions to embeddings
restaurant_descriptions = [r["description"] for r in restaurants]
restaurant_embeddings = model.encode(restaurant_descriptions)

# save embeddings and restaurant data
np.save("embeddings.npy", restaurant_embeddings)  # save embeddings
with open("restaurants.json", "w") as f:  # save restaurant data
    json.dump(restaurants, f)

print("Embeddings and restaurant data saved successfully!")
