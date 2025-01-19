from io import StringIO

def generate_content(game_data:dict): 
    output = StringIO()
    game_metadata = game_data['gameData']
    teams = game_metadata['teams']
    venue = game_metadata['venue']
    weather = game_metadata.get('weather', {})

    # Teams
    home_team = teams['home']['name']
    away_team = teams['away']['name']

    # Venue
    venue_name = venue.get('name', 'Unknown')

    # Weather
    weather_summary = f"{weather.get('condition', 'Unknown')} | Temp: {weather.get('temp', 'N/A')} | Wind: {weather.get('wind', 'N/A')}"

    # Output Overview
    output.write(f"Game Overview:\n")
    output.write(f"Teams: {away_team} vs {home_team}\n")
    output.write(f"Venue: {venue_name}\n")
    output.write(f"Weather: {weather_summary}\n\n")

    scoring_plays = game_data['liveData']['plays']['scoringPlays']
    all_plays = game_data['liveData']['plays']['allPlays']

    output.write("Scoring Highlights:\n")
    for idx in scoring_plays:
        play = all_plays[idx]
        inning = play['about']['inning']
        half_inning = play['about']['halfInning']
        description = play['result']['description']
        player_id = play['matchup']['batter']['id']
        batter_name = game_metadata['players'][f'ID{player_id}']['fullName']

        output.write(f"Inning {inning} ({half_inning}): {batter_name} - {description}\n")

    plays_by_inning = game_data['liveData']['plays']['playsByInning']

    output.write("\nFull Play-by-Play Highlights:\n")
    for inning_num, inning_data in enumerate(plays_by_inning, start=1):
        output.write(f"Inning {inning_num}:\n")

        # Top plays
        top_plays = inning_data['top']
        output.write("  Top Plays:\n")
        for play_idx in top_plays:
            play = all_plays[play_idx]
            output.write(f"    {play['result']['description']}\n")

        # Bottom plays
        bottom_plays = inning_data['bottom']
        output.write("  Bottom Plays:\n")
        for play_idx in bottom_plays:
            play = all_plays[play_idx]
            output.write(f"    {play['result']['description']}\n")

    special_events = {
        "home_run": [],
        "double_play": [],
        "strikeout": []
    }

    for play in all_plays:
        description = play['result']['description'].lower()
        if 'home run' in description:
            special_events["home_run"].append(description)
        elif 'double play' in description:
            special_events["double_play"].append(description)
        elif 'strikeout' in description:
            special_events["strikeout"].append(description)

    output.write("\nSpecial Highlights:\n")
    output.write("Home Runs:\n")
    for hr in special_events["home_run"]:
        output.write(f"  {hr}\n")

    output.write("\nDouble Plays:\n")
    for dp in special_events["double_play"]:
        output.write(f"  {dp}\n")

    output.write("\nStrikeouts:\n")
    for so in special_events["strikeout"]:
        output.write(f"  {so}\n")

    output.write("\nVideo Highlights:\n")
    for idx in scoring_plays:
        play = all_plays[idx]

        # Extract playId
        play_id = None
        for event in play.get("playEvents", []):
            if event.get("type") == "pitch":  # Check if the event type is "pitch"
                play_id = event.get("playId")
                break  # Exit the loop after finding the first "pitch" event

        # Description and video link
        description = play['result']['description']
        if play_id:
            video_link = f'https://www.mlb.com/video/search?q=playid=\"{play_id}\"'
        else:
            video_link = "No video available"
  
        output.write(f"  {description} - Watch here: {video_link}\n")

    fav_player_ids = [12345, 67890]  # Replace with user’s favorite player IDs
    output.write("\nFavorite Players Highlights:\n")
    for play in all_plays:
        batter_id = play['matchup']['batter']['id']
        if batter_id in fav_player_ids:
            description = play['result']['description']
            output.write(f"  {description}\n")

    return output.getvalue()
