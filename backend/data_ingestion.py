from .utils import process_endpoint_url
import pandas as pd
import json
import requests

class DataIngestion:
    def __init__(self):
        pass

    def initiate_data_ingestion(self):
        game_pk = self.latest_completed_game()
        game_data = self.get_single_game_data(game_pk)
        return game_data

    def latest_completed_game(self):
        schedule_endpoint_url = 'https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=2025'
        
        # Fetch schedule data
        schedule_dates = process_endpoint_url(schedule_endpoint_url, "dates")

        # Normalize games data into a DataFrame
        games = pd.json_normalize(
            schedule_dates.explode('games').reset_index(drop=True)['games']
        )

        date_columns = [
            "gameDate",
            "officialDate",
            # "rescheduleDate",
            # "rescheduleGameDate",
            # "rescheduledFromDate",
            # "resumeDate",
            # "resumeGameDate",
            # "resumedFromDate"
        ]

        # Convert the specified columns to datetime
        for col in date_columns:
            games[col] = pd.to_datetime(games[col], errors='coerce')

        # Filter for completed games
        completed_games = games[
            games['status.detailedState'].isin(['Final', 'Completed Early'])
        ]

        # Get the most recent completed game
        completed_games = completed_games.sort_values(by='gameDate', ascending=False)
        latest_game = completed_games.iloc[0]

        return latest_game['gamePk']
    
    
    def get_single_game_data(self, game_pk):
        single_game_feed_url = f'https://statsapi.mlb.com/api/v1.1/game/{game_pk}/feed/live'

        single_game_info_json = json.loads(requests.get(single_game_feed_url).content)

        return single_game_info_json
    def get_games_between_dates(self, start_date, end_date):
        """
        Fetches games between the specified start and end dates.

        Args:
            start_date (str): The start date in the format 'YYYY-MM-DD'.
            end_date (str): The end date in the format 'YYYY-MM-DD'.

        Returns:
            DataFrame: A DataFrame containing games between the specified dates.
        """
        schedule_endpoint_url = (
            f"https://statsapi.mlb.com/api/v1/schedule?sportId=1&startDate={start_date}&endDate={end_date}"
        )

        # Fetch schedule data
        schedule_dates = process_endpoint_url(schedule_endpoint_url, "dates")

        # Normalize games data into a DataFrame
        games = pd.json_normalize(
            schedule_dates.explode('games').reset_index(drop=True)['games']
        )

        date_columns = [
            "gameDate",
            "officialDate",
            "rescheduleDate",
            "rescheduleGameDate",
            "rescheduledFromDate",
            # "resumeDate",
            # "resumeGameDate",
            # "resumedFromDate"
        ]

        # Convert the specified columns to datetime
        for col in date_columns:
            games[col] = pd.to_datetime(games[col], errors='coerce')

        # Filter games based on status or any specific conditions if needed
        return games
    
