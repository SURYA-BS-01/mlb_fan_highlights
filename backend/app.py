from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from .routers import user, auth, article, generate
from .routers import generate

from .models import *
import json
import aiosmtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText

from .database import get_db

from dotenv import load_dotenv
import os


load_dotenv()
FRONTEND_URL = os.getenv("FRONTEND_URL")

# Initialize FastAPI app
app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://mlb-fan-highlights.vercel.app", FRONTEND_URL, "https://gqgm6k77-5173.inc1.devtunnels.ms"],  # Add the React frontend URL
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

# Email sending function
async def send_email(recipient, game_data, url, sender_email, password, smtp_server, port):
    """Send email to a single recipient asynchronously."""
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = recipient
    message["Subject"] = f"New Game Recap: {game_data['title']}"

    email_body = f"""
    <html>
    <body>
        <h2>{game_data['title']}</h2>
        <p><strong>Game Date:</strong> {game_data['game_date']}</p>
        <p><strong>Teams:</strong> {game_data['team_away']} vs. {game_data['team_home']}</p>
        <hr>    
        <h3>Game Highlights</h3>
        <p> Read more about the game here: {url}</p>
    </body>
    </html>
    """
    message.attach(MIMEText(email_body, "html"))

    try:
        await aiosmtplib.send(
            message.as_string(),
            sender=sender_email,
            recipients=[recipient],  # Send to a single recipient at a time
            hostname=smtp_server,
            port=port,
            username=sender_email,
            password=password,
            use_tls=False,
            start_tls=True
        )
        print(f"Email sent successfully to {recipient}")
    except Exception as e:
        print(f"Failed to send email to {recipient}: {e}")

async def send_bulk_emails(receiver_emails, game_data, url):
    """Send emails to all users concurrently."""
    sender_email = "mlbggle@gmail.com"
    password = "wovv tzjo rnpa vuec"  # Store this securely in env variables
    smtp_server = "smtp.gmail.com"
    port = 587

    # Create a list of email sending tasks
    tasks = [
        send_email(email, game_data, url, sender_email, password, smtp_server, port) 
        for email in receiver_emails
    ]

    # Run all tasks concurrently
    await asyncio.gather(*tasks)

# Polling function
async def poll_schedule():
    previous_data = await fetch_schedule()
    while True:
        schedule_data = await fetch_schedule()
        # schedule_data['new'] = 'new data'
        if schedule_data != previous_data:
            print("New updates detected!")

            json_data = generate.generate_summary("ENGLISH")
            json_data = json.loads(json_data.body)
            data = json_data['data']
            id = json_data['id']
            db = get_db()
            users_collection = db.users_collection

            # Fetch all user emails from MongoDB
            user_emails = [user["email"] for user in users_collection.find({}, {"email": 1})]

            # Send email alerts asynchronously
            if user_emails:
                await send_bulk_emails(user_emails, data, f"http://localhost:5173/article/{id}")

            previous_data = schedule_data
        
        await asyncio.sleep(12)

@app.on_event("startup")
async def startup_event():
    # Schedule the polling task at startup
    asyncio.create_task(poll_schedule())

@app.get("/")
async def root():
    return {"message": "MLB Fan Highlights Backend is running!"}
