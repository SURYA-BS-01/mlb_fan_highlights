from sqlalchemy import create_engine
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker

SQLALCHEMY_DATABASE_URL = 'postgresql://postgres:alpha1234@localhost/mlb_users'

engine = create_engine(SQLALCHEMY_DATABASE_URL)
sessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

Base = declarative_base()


def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()



from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi

uri = "mongodb+srv://suryabs:alpha1234@mlbarticles.ndsr0.mongodb.net/?retryWrites=true&w=majority&appName=MlbArticles"

# Create a new client and connect to the server
client = MongoClient(uri, server_api=ServerApi('1'))


db = client.mlb_articles
collection = db['articles']



