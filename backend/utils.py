import requests
import json
import pandas as pd
from fastapi.exceptions import HTTPException
from fastapi import status
from dotenv import load_dotenv
import os

load_dotenv()
EMAIL_VERIFICATION_API_KEY = os.getenv("EMAIL_VERIFICATION_API_KEY")

def load_newline_delimited_json(url):
    """Loads a newline-delimited JSON file from a URL into a pandas DataFrame.

    Args:
        url: The URL of the newline-delimited JSON file.

    Returns:
        A pandas DataFrame containing the data, or None if an error occurs.
    """
    try:
        response = requests.get(url)
        response.raise_for_status()  # Raise an exception for bad status codes

        data = []
        for line in response.text.strip().split('\n'):
            try:
                data.append(json.loads(line))
            except json.JSONDecodeError as e:
                print(f"Skipping invalid JSON line: {line} due to error: {e}")

        return pd.DataFrame(data)
    except requests.exceptions.RequestException as e:
        print(f"Error downloading data: {e}")
        return None
    except Exception as e:
        print(f"An unexpected error occurred: {e}")
        return None
    
def process_endpoint_url(endpoint_url, pop_key=None):
  """
  Fetches data from a URL, parses JSON, and optionally pops a key.

  Args:
    endpoint_url: The URL to fetch data from.
    pop_key: The key to pop from the JSON data (optional, defaults to None).

  Returns:
    A pandas DataFrame containing the processed data
  """
  json_result = requests.get(endpoint_url).content

  data = json.loads(json_result)

   # if pop_key is provided, pop key and normalize nested fields
  if pop_key:
    df_result = pd.json_normalize(data.pop(pop_key), sep = '_')
  # if pop_key is not provided, normalize entire json
  else:
    df_result = pd.json_normalize(data)

  return df_result

def send_welcome_email(receiver):
    import smtplib
    from email.mime.multipart import MIMEMultipart
    from email.mime.text import MIMEText

    # Email Configuration
    sender_email = "mlbggle@gmail.com"
    receiver_email = str(receiver)
    password = "wovv tzjo rnpa vuec"

    # SMTP Server Settings
    smtp_server = "smtp.gmail.com"
    port = 587  # TLS port
   
    # Create Email
    message = MIMEMultipart()
    message["From"] = sender_email
    message["To"] = receiver_email
    message["Subject"] = "Welcome to MLB Community"

    # Email Body
    email_body = f"""
<html>
<body>
    <h2>!</h2>
    <p>Hi there,</p>
    <p>Thank you for joining MLB Community! We're excited to have you on board. Here's what you can expect:</p>
    
    <ul>
        <li><strong>Game Recaps:</strong> Get the latest updates and recaps of the biggest MLB games.</li>
        <li><strong>Detailed Highlights:</strong> Discover key moments, player performances, and more.</li>
        <li><strong>Stay Informed:</strong> Receive real-time game summaries, team stats, and game schedules.</li>
    </ul>
    
    <p>We hope you enjoy following the exciting world of MLB with us!</p>
    
    <h3>Getting Started:</h3>
    <p>Click <a href="http://localhost:5173/">here</a> to check out the latest game highlights and summaries.</p>
    
    <hr>
    <p>If you have any questions or feedback, feel free to reach out to us anytime. We're here to make your experience even better!</p>
    
    <p>Stay tuned for more game recaps and updates!</p>
</body>
</html>
"""


    message.attach(MIMEText(email_body, "html"))
    # Send Email
    try:
        response = requests.get(f"https://emailvalidation.abstractapi.com/v1/?api_key={EMAIL_VERIFICATION_API_KEY}&email={receiver_email}")
        content = json.loads(response.content)
        print(type(receiver_email), receiver_email)
        print(response.content)
        if content['deliverability'] != 'DELIVERABLE':
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Email not valid")
        server = smtplib.SMTP(smtp_server, port)
        server.starttls()  # Secure the connection
        server.login(sender_email, password)
        response = server.sendmail(sender_email, receiver_email, message.as_string())
        print(response)
        if not response:
            print("Email sent successfully!")
        else:
            print(f"Failed to send email. Response: {response}")
    except Exception as e:
        print(f"Error: {e}")
    finally:
        server.quit()