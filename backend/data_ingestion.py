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
        schedule_endpoint_url = 'https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=2024'
        
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
            "resumeDate",
            "resumeGameDate",
            "resumedFromDate"
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
    
    def get_game_by_date(self, date):
        """
        Fetch game data for a specific date.

        Args:
            date (str): The date for which to fetch game data in 'YYYY-MM-DD' format.

        Returns:
            List[Dict]: A list of games on the specified date.
        """
        try:
            # Validate the input date format
            query_date = pd.to_datetime(date, format='%Y-%m-%d', errors='coerce').date()
            if query_date is None:
                raise ValueError("Invalid date format. Use 'YYYY-MM-DD'.")

            # Define the schedule endpoint
            schedule_endpoint_url = 'https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=2024'

            # Fetch schedule data
            schedule_dates = process_endpoint_url(schedule_endpoint_url, "dates")

            # Normalize games data into a DataFrame
            games = pd.json_normalize(
                schedule_dates.explode('games').reset_index(drop=True)['games']
            )

            # Define columns to convert to datetime
            date_columns = [
                "gameDate",
                "officialDate",
                "rescheduleDate",
                "rescheduleGameDate",
                "rescheduledFromDate",
                "resumeDate",
                "resumeGameDate",
                "resumedFromDate"
            ]

            # Convert the specified columns to datetime
            for col in date_columns:
                games[col] = pd.to_datetime(games[col], errors='coerce')

            # Filter games for the specific date
            games_on_date = games[games['gameDate'].dt.date == query_date]

            # Check if games exist for the given date
            if games_on_date.empty:
                return f"No games found for the date: {query_date}."

            # Return the filtered games as a list of dictionaries
            return games_on_date.to_dict(orient="records")

        except Exception as e:
            return {"error": str(e)}

    
    
    def get_single_game_data(self, game_pk):
        single_game_feed_url = f'https://statsapi.mlb.com/api/v1.1/game/{game_pk}/feed/live'

        single_game_info_json = json.loads(requests.get(single_game_feed_url).content)

        return single_game_info_json
