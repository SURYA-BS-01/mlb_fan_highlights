from data_ingestion import DataIngestion
from generate_content import generate_content
from google import genai
from transformers import MBartForConditionalGeneration, MBart50TokenizerFast
from dotenv import load_dotenv
import os
import re

data_ingestion = DataIngestion()
game_data = data_ingestion.initiate_data_ingestion()

summary = generate_content(game_data)
load_dotenv()
API_KEY = os.getenv("API_KEY")

language = "ENGLISH"
prompt = f"""
GENERATE THE CONTENT IN LANGUAGE: {language}, MAKE IT SOUND LIKE A NATIVE SPEAKER
"Using the provided baseball game data, craft an engaging and dynamic highlight summary designed for fans to stay updated on the latest action.
Game data:{summary}
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
Length: Aim for a concise summary of about 400-500 words that emphasizes storytelling while remaining informative.
The goal is to create a summary that feels like a conversation among fans, celebrating the thrill of the game and leaving them eager for the next update!"

Structure the article into Introduction, Game Highlights, key players and conclusion

put the highlights video link before the end.
"""


def generate_text(prompt):

    client = genai.Client(api_key=API_KEY, http_options={'api_version':'v1alpha'})
    text = ""
    for chunk in client.models.generate_content_stream(
        model='gemini-2.0-flash-thinking-exp', contents=prompt
    ):
        for part in chunk.candidates[0].content.parts:
            if part.thought == True:
                pass
            else:
                text += part.text
                # print(part.text, end="")

    return text

def reformat_text(text):
    text = re.sub(r"\*.*?\*", "", text)  # Remove asterisks
    text = re.sub(r"http\S+", "", text)  # Remove URLs
    text = text.strip()

    conversational_prompt = f"""
    Imagine you are a sports commentator narrating the highlights of a baseball game to fans. Your goal is to create an engaging, lively, and human-like narration that feels like a real conversation. Here's how to approach it:
    
    1. Avoid reading out unnecessary details like video links or specific formatting elements (e.g., asterisks or headers).
    2. Use dynamic expressions to convey the excitement of key moments (e.g., "What a spectacular home run by Jack López!" or "Eric Wagaman delivered big with a clutch double!").
    3. Add natural pauses and conversational phrases to make it sound like you're directly talking to fans (e.g., "Did you see that play? Unbelievable!").
    4. Feel free to add light commentary or humor that fans would enjoy, while keeping the narration concise and focused.
    
    Here's the original text: {text}
    
    Please rewrite it as an engaging audio script for fans, making it sound as realistic and conversational as possible.
    """

    text = generate_text(conversational_prompt)

    return text


def translate(text, language=None):

    model = MBartForConditionalGeneration.from_pretrained("facebook/mbart-large-50-many-to-many-mmt")
    tokenizer = MBart50TokenizerFast.from_pretrained("facebook/mbart-large-50-many-to-many-mmt")

    # translate Hindi to French
    tokenizer.src_lang = "en_XX"
    encoded_text = tokenizer(text, return_tensors="pt")
    generated_tokens = model.generate(
        **encoded_text,
        forced_bos_token_id=tokenizer.lang_code_to_id["es_XX"]
    )
    tokenizer.batch_decode(generated_tokens, skip_special_tokens=True)

text = generate_text(prompt)
print(text)
# spanish = translate(text)
# print(spanish)