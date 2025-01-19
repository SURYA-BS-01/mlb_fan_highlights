# from data_ingestion import DataIngestion
# from generate_content import generate_content
# import google.generativeai as genai
# from dotenv import load_dotenv
# import os

# data_ingestion = DataIngestion()
# game_data = data_ingestion.initiate_data_ingestion()

# summary = generate_content(game_data)

# load_dotenv()

# API_KEY = os.getenv("API_KEY")

# genai.configure(api_key=API_KEY)
# model = genai.GenerativeModel("gemini-2.0-flash-thinking-exp-1219")

# topic = "Summarizing the game highlights and details for a sports audience."
# loops = int(input("No of reasoning loops? "))

# setup_prompt = f"""You are tasked with writing a game highlights and summary for a baseball match to send it to the user the day after the match. 
# Here’s the data you will use: 
# It consists of the information related to a baseball game.
# {summary}


# Your task is to generate a detailed framework on how to analyze and summarize this data for a sports audience. 
# This framework should explain:
# 1. **What aspects of the game are most important to include?** 
# (e.g., scoring highlights, standout plays, player contributions, home runs, doubles, game-changing events, ).
# 2. **How should the information be structured?** (e.g., narrative format, bullet points, key takeaways, outstanding hits, pitching,errors, fielding plays, etc.).
# 3. **What angles should be considered to give a well-rounded summary?** (e.g., team strategy, individual performances, pivotal moments).
# 4. Any additional context (e.g., weather, venue)

# Write this framework as a set of generic instructions that encourages thorough analysis and structured thinking.
# """
# first_response = model.generate_content(setup_prompt,
#     stream=True,
#     generation_config=genai.types.GenerationConfig(
#         temperature=0.3
#     ))

# print("\nFormulating Question:")

# question = ""
# for chunk in first_response:
#     question += chunk.text
#     print(chunk.text)
# print("\n"+ "_" * 80)

# current_thought = question
# all_thoughts = []
# for i in range(loops):
#     print(f"\nReasoning Loop {i+1}/{loops}:")

#     reasoning_prompt = f"""HERE"S WHAT YOU NEED TO DO: #### {current_thought} ###
#     Provide a detailed, thoughtful analysis as if you were a sports commentator breaking down this play for an audience."""

#     response = model.generate_content(reasoning_prompt,
#         stream=True,
#         generation_config=genai.types.GenerationConfig(
#         temperature=1.0
#     ))

#     current_thought = ""
#     for chunk in response:
#         current_thought += chunk.text
#         print(chunk.text)
#     all_thoughts.append(current_thought)
#     print("\n"+ "_" * 80)


# # Third agent

# print("\nFinal Synthesis:")
# synthesis_prompt = f"""Topic: {topic}"
# Initial Framework: {question}
# Reasoning Chain: {' | '.join(all_thoughts)}

# IMPORTANT: Your task is to synthesize these insights into a clear and engaging summary. 
# 1. Write in an article-like format, with a logical flow and structured narrative.
# 2. Highlight the most critical game events, player performances, and team strategies.
# 3. Ensure the language is engaging and suitable for a general sports audience."""

# final_response = model.generate_content(synthesis_prompt,
#     stream=True,
#     generation_config=genai.types.GenerationConfig(
#         temperature=0.1
#     ))
# for chunk in final_response:
#     print(chunk.text)
# print("\n"+ "_" * 80)

from fastapi import FastAPI, Form, Request
from fastapi.responses import HTMLResponse
from fastapi.responses import JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from fastapi.middleware.cors import CORSMiddleware
from data_ingestion import DataIngestion
from generate_content import generate_content
from google import genai
from dotenv import load_dotenv
import os
import json
import re

# Initialize FastAPI app
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173"],  # Add the React frontend URL
    allow_credentials=True,
    allow_methods=["*"],  # Allow all HTTP methods
    allow_headers=["*"],  # Allow all headers
)


# Setup templates directory for HTML rendering
templates = Jinja2Templates(directory="templates")
app.mount("/static", StaticFiles(directory="static"), name="static")

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
async def generate(request: Request, language: str = Form("ENGLISH")):
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
    "<Link to the first highlight video>",
    "<Link to the second highlight video>",
    <and etc. all other links like this>
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
        print("Raw Text Before Reformatting:", raw_text)  # Debugging purposes

        # Check if text is empty
        if not raw_text.strip():
            return JSONResponse(content={"error": "No content generated by the AI model."}, status_code=500)

        # Reformat and parse JSON
        formatted_text = reformat_text(raw_text)
        if not formatted_text.startswith("{") or not formatted_text.endswith("}"):
            print("Invalid JSON structure:", formatted_text)
            return JSONResponse(content={"error": "Generated content is not valid JSON."}, status_code=500)
        
        parsed_json = json.loads(formatted_text)
    except json.JSONDecodeError as e:
        print(f"JSONDecodeError: {e}")
        print("Formatted Text Causing Error:", formatted_text)
        return JSONResponse(content={"error": "Failed to parse generated content."}, status_code=500)
    except Exception as e:
        print("Error during text generation:", e)
        return JSONResponse(content={"error": "AI model failed to generate content."}, status_code=500)

    return JSONResponse(content=parsed_json)
