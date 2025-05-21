# TasteLanka 🍛🇱🇰

TasteLanka is a web app that helps users discover and connect with Sri Lankan restaurants through AI-powered search, location-based suggestions, and real-time chat. Built to support both diners and small local businesses, it offers a modern and personalized way to explore food options across the island.

---

## 📁 Project Structure

tastelanka/  
├── frontend/ # React.js application  
├── backend/ # Node.js + Express.js API with MongoDB  
├── model/ # Python-based NLP recommendation engine  


---


## 🚀 How to Run the Project

Prerequisites:  
 * Node.js (20.0 or higher)  
 * Rename .env.example to .env and fill in the required values

### 1. Start the Backend 

```
cd backend  
npm install  
npm start
```


### 2. Start the Frontend

```
cd ../frontend  
npm install  
npm run dev
```

Then visit http://localhost:3000  


### 3. Start the Recommendation Model (Python API)

Prerequisites:  
 * Python 3.8+  
 * Virtual environment (recommended)  

```
cd ../model  
python -m venv venv  
source venv/Scripts/activate  
pip install -r requirements.txt
```

Run the Flask server:  
```
python app.py
```

* The model will be available at http://localhost:5000/recommend  
* You can test it by sending a POST request with JSON like:  
 { "query": "cheap vegetarian place in kandy" }  


---


## 📌 Notes

* Before starting the Flask API, ensure embeddings.npy and restaurants.json exist. if not run:
```
python create_embeddings.npy
```

* Make sure all servers are running concurrently for full functionality



---


## ✨ Features

* 🤖 AI-powered natural language restaurant search 
* 📍 Location-based nearby restaurant discovery  
* 🔒 Encrypted real time chat between users and restaurants
* 🏢 Restaurant registration & management 
