from utils import load_newline_delimited_json, process_endpoint_url
import pandas as pd
import json
import requests
import datetime

class DataIngestion:
    def __init__(self, id='1LOQWJRV7HJYY9P'):
        self.id = id

    def initiate_data_ingestion(self):
        fav_team_id, followed_players, followed_teams = self.get_user_preferences()
        game_pk = self.fav_team_games(fav_team_id)
        game_data = self.get_single_game_data(game_pk)
        return game_data

    def get_user_preferences(self):
        mlb_fan_favorites_json_file = 'https://storage.googleapis.com/gcp-mlb-hackathon-2025/datasets/mlb-fan-content-interaction-data/2025-mlb-fan-favs-follows.json'

        mlb_fan_favorites_df = load_newline_delimited_json(mlb_fan_favorites_json_file)

        # Convert favorite team ID to integer format
        mlb_fan_favorites_df['favorite_team_id'] = (

            mlb_fan_favorites_df['favorite_team_id'].astype('Int64'))
        
        user = mlb_fan_favorites_df[mlb_fan_favorites_df['user_id'] == self.id]

        return user.iloc[0]['favorite_team_id'].astype('int64'), user.iloc[0]['followed_player_ids'], user.iloc[0]['followed_team_ids']


    def fav_team_games(self, fav_team_id):
        schedule_endpoint_url = 'https://statsapi.mlb.com/api/v1/schedule?sportId=1&season=2024'

        schedule_dates = process_endpoint_url(schedule_endpoint_url, "dates")

        games = pd.json_normalize(
            schedule_dates.explode('games').reset_index(drop = True)['games'])
                
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

        completed_games['status.detailedState'].unique()

        fav_team_games = games[games['teams.home.team.id'] == fav_team_id]
        fav_team_games.loc[:, 'teams.away.isWinner'] = fav_team_games['teams.away.isWinner'].replace({"False": False, "True":True}).astype(bool)
        fav_team_games.loc[:, 'teams.home.isWinner'] = fav_team_games['teams.home.isWinner'].replace({"False": False, "True":True}).astype(bool)

        # games_by_date = fav_team_games[
        #     fav_team_games['officialDate'].dt.date == datetime.datetime(2024, 9, 18)
        # ]

        fav_team_games['officialDate'] = pd.to_datetime(fav_team_games['officialDate'])
        specific_date = pd.Timestamp("2024-09-28")  # Or use pd.to_datetime("2024-09-28")
        games_by_date = fav_team_games[fav_team_games['officialDate'] == specific_date]


        games_by_date['is_fav_team_winner'] = (
            (games_by_date['teams.away.team.id'] == fav_team_id) &
            (games_by_date['teams.away.isWinner'] == True)
        ) | (
            (games_by_date['teams.home.team.id'] == fav_team_id) &
            (games_by_date['teams.home.isWinner'] == True)
        )

        return games_by_date['gamePk'].iloc[0]
    
    def get_single_game_data(self, game_pk):

        single_game_feed_url = f'https://statsapi.mlb.com/api/v1.1/game/{game_pk}/feed/live'

        single_game_info_json = json.loads(requests.get(single_game_feed_url).content)

        return single_game_info_json

