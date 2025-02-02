from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://suryabs:alpha1234@mlbarticles.ndsr0.mongodb.net/?retryWrites=true&w=majority&appName=MlbArticles"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))


db = client.mlb_articles
collection = db['articles']
users_collection = db['users']  # Collection for storing users
user_articles = db['user_articles']

def get_db():
    return db  # Return the MongoDB database instance