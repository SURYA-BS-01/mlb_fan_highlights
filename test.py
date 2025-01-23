import asyncio
import websockets
import json

async def listen_to_gumbo():
    url = "wss://statsapi.mlb.com/api/v1.1/feed/live"  # Replace with the actual WebSocket URL
    async with websockets.connect(url) as ws:
        while True:
            message = await ws.recv()
            game_data = json.loads(message)


# Run the listener
asyncio.run(listen_to_gumbo())
