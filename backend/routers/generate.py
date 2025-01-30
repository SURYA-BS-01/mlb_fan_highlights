from fastapi import Request, APIRouter, status, Depends
from fastapi.responses import JSONResponse

from ..data_ingestion import DataIngestion
from .generate_utils import generate_content
from .. import oauth

from google import genai
from dotenv import load_dotenv
import os
import json
import re
import time

from ..models import *
from ..database import collection

load_dotenv()
API_KEY = os.getenv("API_KEY")


router = APIRouter(
    prefix="/generate",
    tags = ['generate']
)


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



@router.post("/", status_code=status.HTTP_201_CREATED)
async def generate(request: Request, current_user: int = Depends(oauth.get_current_user)):
    
    body = await request.json()
    language = body.get("language", "ENGLISH")
    return generate_summary(language)

def generate_summary(language):
    # Data ingestion and summary generation
    data_ingestion = DataIngestion()
    game_data = data_ingestion.initiate_data_ingestion()
    summary = generate_content(game_data)

    # Generate content prompt
    prompt = f"""
GENERATE THE CONTENT MUST IN LANGUAGE: {language}, MAKE IT SOUND LIKE A NATIVE SPEAKER.
OUTPUT THE RESULT STRICTLY IN THIS JSON FORMAT WITHOUT ANY EXTRA SPACES AND LINES, DON'T GENERATE ANY EXTRA CHARACTERS OTHER THAN THE JSON. THE CONTENT MUST BE IN THE MENTIONED LANGUAGE.
** IMPORTANT: I NEED YOU TO STRICTLY FOLLOW THE EXCAT STRUCTURE GIVEN BELOW**
{{
  "title": "<Title of the article>",
  "sections": [
    {{
      "heading": "Introduction",
      "content": "<Introduction content.>"
    }},
    {{
      "heading": "Game Highlights",
      "content": "<Details about key moments in the game.
      Things to keep in mind:
    No links here. Include score and which team won
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
Length: Aim for a concise summary of about 1000-1500 words that emphasizes storytelling while remaining informative.
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
        json_data['created_at'] = datetime.utcnow()

        iso_date = game_data["gameData"]["datetime"]["dateTime"]
        date_obj = datetime.strptime(iso_date, "%Y-%m-%dT%H:%M:%SZ")  # Parse full datetime
        date_only = date_obj.date()  # Extract only the date part
        json_data['game_date'] = date_only.isoformat()


        print(game_data)

        collection.insert_one(json_data)
        print("Data Inserted")
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

