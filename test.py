from google.cloud import texttospeech
import os

def generate_audio_from_text(text, output_file="commentary.mp3"):
    # Set up Google Cloud TTS client
    client = texttospeech.TextToSpeechClient()

    # Prepare SSML-enhanced text for natural flow
    ssml_text = f"""
    <speak>
        <prosody rate="medium" pitch="default">
            {text}
        </prosody>
    </speak>
    """

    # Define voice and audio settings
    voice = texttospeech.VoiceSelectionParams(
        language_code="en-US", 
        name="en-US-Journey-F",  # Example of a natural male voice
        ssml_gender=texttospeech.SsmlVoiceGender.MALE
    )
    audio_config = texttospeech.AudioConfig(
        audio_encoding=texttospeech.AudioEncoding.MP3,
        speaking_rate=1.1,  # Slightly faster for excitement
        pitch=2.0  # Higher pitch for energy
    )

    # Generate speech
    synthesis_input = texttospeech.SynthesisInput(ssml=ssml_text)
    response = client.synthesize_speech(input=synthesis_input, voice=voice, audio_config=audio_config)

    # Save audio to file
    with open(output_file, "wb") as out:
        out.write(response.audio_content)
    print(f"Audio content written to {output_file}")


text = """
    What a game we had today! Eric Wagaman came through with a clutch double in the 7th inning, scoring Kevin Pillar to break the ice. 
    And then, Jack López launched a rocket of a homer into left center in the 8th—absolutely electrifying stuff!
    But wait, the White Sox answered back in style! Bryan Ramos smacked a sharp double, followed by a gritty play by Luis Robert Jr., 
    who kept the pressure on with a scrappy run. The energy in the ballpark was just off the charts!
"""

generate_audio_from_text(text)