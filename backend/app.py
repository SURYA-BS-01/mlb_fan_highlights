from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.middleware.cors import CORSMiddleware

from .data_ingestion import DataIngestion
from .generate_content import generate_content
from .routers import user, auth, article

from google import genai
from dotenv import load_dotenv
import os
import json
import re
import time

import psycopg2
from psycopg2.extras import RealDictCursor

from . import models
from .models import *
from .database import engine, sessionLocal, collection

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
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Add the React frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)

app.include_router(user.router)
app.include_router(auth.router)
app.include_router(article.router)

# Setup templates directory for HTML rendering
templates = Jinja2Templates(directory="templates")

# Load environment variables
load_dotenv()
API_KEY = os.getenv("API_KEY")

def generate_text(prompt):
    client = genai.Client(api_key=API_KEY, http_options={'api_version': 'v1alpha'})
    text = ""
    for chunk in client.models.generate_content_stream(
        model='gemini-2.0-flash-thinking-exp', contents=prompt
    ):
        for part in chunk.candidates[0].content.parts:
            if not part.thought:
                text += part.text
    return text

def reformat_text(text):
    match = re.search(r"{.*}", text, re.DOTALL)
    if match:
        extracted_json = match.group(0)  # Extract the JSON content
        extracted_json.strip()  # Strip any extra whitespace
    else:
        return None
    extracted_json = re.sub(r"\*.*?\*", "", extracted_json)  # Remove asterisks
    extracted_json = extracted_json.strip()
    return extracted_json

@app.get("/", response_class=HTMLResponse)
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

# @app.post("/generate", response_class=HTMLResponse)
# async def generate(request: Request, language: str = Form("ENGLISH")):
#     # Data ingestion and summary generation
#     data_ingestion = DataIngestion()
#     game_data = data_ingestion.initiate_data_ingestion()
#     summary = generate_content(game_data)

#     # Generate content prompt
#     prompt = f"""
# GENERATE THE CONTENT IN LANGUAGE: {language}, MAKE IT SOUND LIKE A NATIVE SPEAKER
# "Using the provided baseball game data, craft an engaging and dynamic highlight summary designed for fans to stay updated on the latest action.
# Game data:{summary}
# Requirements:
# Tone: Energetic, conversational, and exciting to draw in readers and keep them engaged.
# Content Focus:
# Summarize the game’s key moments, focusing on pivotal scoring plays, standout performances, and game-changing events.
# Highlight any exceptional plays, like home runs, doubles, defensive gems, or clutch pitching moments.
# Structure:
# Opening: Set the scene with details about the matchup, venue, and overall atmosphere (e.g., weather or crowd energy).
# Game Highlights: Present a chronological or thematic breakdown of the game’s key moments.
# Player Spotlights: Feature individual standout performances or memorable contributions.
# Engagement: Encourage fans to stay tuned for more updates or share their thoughts.
# Video Integration: Seamlessly reference links to video highlights, encouraging fans to relive the excitement.
# Engagement Style:
# Use vivid language to bring the game to life (e.g., "a rocket of a home run," "an electrifying double play").
# Balance factual recaps with creative commentary to make the highlights more immersive.
# Length: Aim for a concise summary of about 500-600 words that emphasizes storytelling while remaining informative.
# The goal is to create a summary that feels like a conversation among fans, celebrating the thrill of the game and leaving them eager for the next update!"

# Structure the article into Introduction, Game Highlights, key players and conclusion

# put the highlights video link before the end.
# """
#     raw_text = generate_text(prompt)
#     print(raw_text)
#     formatted_text = reformat_text(raw_text)

#     return JSONResponse(content={"content": formatted_text})


@app.post("/generate")
async def generate(request: Request):
    
    body = await request.json()
    language = body.get("language", "ENGLISH")
    # Data ingestion and summary generation
    data_ingestion = DataIngestion()
    game_data = data_ingestion.initiate_data_ingestion()
    summary = generate_content(game_data)

    # Generate content prompt
    prompt = f"""
GENERATE THE CONTENT MUST IN LANGUAGE: {language}, MAKE IT SOUND LIKE A NATIVE SPEAKER.
OUTPUT THE RESULT STRICTLY IN THIS JSON FORMAT WITHOUT ANY EXTRA SPACES AND LINES, DON'T GENERATE ANY EXTRA CHARACTERS OTHER THAN THE JSON. THE CONTENT MUST BE IN THE MENTIONED LANGUAGE.
{{
  "title": "<Title of the article>",
  "sections": [
    {{
      "heading": "Introduction",
      "content": "<Introduction content>"
    }},
    {{
      "heading": "Game Highlights",
      "content": "<Details about key moments in the game.
      Things to keep in mind:
    No links here.
    Pacing Adjustments: Smooth transitions between key moments would help the narrative flow better.
    Clarify Descriptions: Add more detail to specific plays for better understanding, like how runners scored.
    Avoid Repetition: Use varied language to prevent overuse of phrases like “answered back.”
    Strengthen Key Player Explanations: Provide more context on how each key player's actions impacted the game.
    Grammar Refinements: Small tweaks in punctuation and phrasing could improve clarity and tighten the writing.>"
    }},
    {{
      "heading": "Key Players",
      "content": "<Details about standout players>"
    }}
  ],
  "links": [
    {{"<link title 1>":"<Link to the first highlight video>",
    "<link title 2>":"<Link to the second highlight video>",
    etc...
    }}
  ],
  "conclusion": "<Closing statement or call to action>"
}}

Game data: {summary}

Requirements:
Tone: Energetic, conversational, and exciting to draw in readers and keep them engaged.
Content Focus:
Summarize the game’s key moments, focusing on pivotal scoring plays, standout performances, and game-changing events.
Highlight any exceptional plays, like home runs, doubles, defensive gems, or clutch pitching moments.
Structure:
Opening: Set the scene with details about the matchup, venue, and overall atmosphere (e.g., weather or crowd energy).
Game Highlights: Present a chronological or thematic breakdown of the game’s key moments.
Player Spotlights: Feature individual standout performances or memorable contributions.
Engagement: Encourage fans to stay tuned for more updates or share their thoughts.
Video Integration: Seamlessly reference links to video highlights, encouraging fans to relive the excitement.
Engagement Style:
Use vivid language to bring the game to life (e.g., "a rocket of a home run," "an electrifying double play").
Balance factual recaps with creative commentary to make the highlights more immersive.
Length: Aim for a concise summary of about 800-1000 words that emphasizes storytelling while remaining informative.
The goal is to create a summary that feels like a conversation among fans, celebrating the thrill of the game and leaving them eager for the next update!"""

    # Parse and return JSON directly
    try:
        raw_text = generate_text(prompt)

        # print("Raw Text Before Reformatting:", raw_text)  # Debugging purposes

        # Check if text is empty
        if not raw_text.strip():
            return JSONResponse(content={"error": "No content generated by the AI model."}, status_code=500)

        # Reformat and parse JSON
        formatted_text = reformat_text(raw_text)
        json_data = json.loads(formatted_text)
        collection.insert_one(json_data)
        print(type(json_data))
        if not formatted_text.startswith("{") or not formatted_text.endswith("}"):
            # print("Invalid JSON structure:", formatted_text)
            return JSONResponse(content={"error": "Generated content is not valid JSON."}, status_code=500)
        
        parsed_json = json.loads(formatted_text)
    except json.JSONDecodeError as e:
        print(f"JSONDecodeError: {e}")
        # print("Formatted Text Causing Error:", formatted_text)
        return JSONResponse(content={"error": "Failed to parse generated content."}, status_code=500)
    except Exception as e:
        print("Error during text generation:", e)
        return JSONResponse(content={"error": "AI model failed to generate content."}, status_code=500)

    return JSONResponse(content=parsed_json)
