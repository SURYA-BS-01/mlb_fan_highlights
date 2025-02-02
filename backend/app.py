from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from .routers import user, auth, article, generate
from .routers import generate

import time

import psycopg2
from psycopg2.extras import RealDictCursor

from . import models
from .models import *
from .database import engine, sessionLocal

# Initialize FastAPI app
app = FastAPI()

models.Base.metadata.create_all(bind=engine)


def get_db():
    db = sessionLocal()
    try:
        yield db
    finally:
        db.close()


while True:
    try:
        conn = psycopg2.connect(host='localhost', database='fastapi', user='postgres', password='alpha1234', cursor_factory=RealDictCursor)
        cursor = conn.cursor()
        print("Database connection was successfull")
        break
    except Exception as error:
        print("Database connection failed")
        print("Error: ", error)
        time.sleep(2)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173", "https://gqgm6k77-5173.inc1.devtunnels.ms"],  # Add the React frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(article.router)
app.include_router(generate.router)


# Setup templates directory for HTML rendering
templates = Jinja2Templates(directory="templates")


@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

import asyncio
import aiohttp

async def fetch_schedule():
    url = 'https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=2024'
    async with aiohttp.ClientSession() as session:
        async with session.get(url) as response:
            data = await response.json()
            return data

async def poll_schedule():
    previous_data = await fetch_schedule()
    while True:
        schedule_data = await fetch_schedule()
        schedule_data['new'] = 'new data'
        if schedule_data != previous_data:
            print("New updates detected!")
            generate.generate_summary("ENGLISH")
            
            # Process the new schedule_data here
            previous_data = schedule_data
        await asyncio.sleep(12)  # Avoid blocking with  async sleep

@app.on_event("startup")
async def startup_event():
    # Schedule the polling task at startup
    asyncio.create_task(poll_schedule())

@app.get("/")
async def root():
    return {"message": "MLB Fan Highlights Backend is running!"}
