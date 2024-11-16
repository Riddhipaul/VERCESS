import json
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from datetime import datetime, timedelta

# Scopes define the level of access you need
SCOPES = ['https://www.googleapis.com/auth/gmail.readonly']

# Load credentials from the JSON file
flow = InstalledAppFlow.from_client_secrets_file(
    'D:\\LearnWithProjects\\VERCASS\\backend\Credentials.json', SCOPES)
credentials = flow.run_local_server(port=0)

# Build the Gmail service
service = build('gmail', 'v1', credentials=credentials)

# Function to format date for Gmail API query
def format_date(date):
    return date.strftime('%Y/%m/%d')

# Get today's and yesterday's date
today = datetime.today()
yesterday = today - timedelta(days=1)

# Format dates for Gmail API query
today_str = format_date(today)
yesterday_str = format_date(yesterday)

# Query string to filter emails received today or yesterday
query = f'after:{yesterday_str} before:{today_str}'

# Example: List the user's messages
results = service.users().messages().list(userId='me', q=query).execute()
messages = results.get('messages', [])

# List to store the emails
emails = []

for message in messages:
    msg = service.users().messages().get(userId='me', id=message['id']).execute()
    
    # Extract headers
    headers = msg['payload']['headers']
    
    # Extract sender's email ID, date, and time
    sender = next((header['value'] for header in headers if header['name'] == 'From'), None)
    date = next((header['value'] for header in headers if header['name'] == 'Date'), None)
    
    # Create a dictionary for the email
    email = {
        "id": msg['id'],
        "threadId": msg['threadId'],
        "labelIds": msg['labelIds'],
        "snippet": msg['snippet'],
        "payload": {
            "headers": [
                {"name": header['name'], "value": header['value']} for header in headers
            ],
            "body": {
                "size": msg['payload']['body']['size'] if 'body' in msg['payload'] else None,
                "data": msg['payload']['body']['data'] if 'body' in msg['payload'] and 'data' in msg['payload']['body'] else None
            }
        },
        "sizeEstimate": msg['sizeEstimate'],
        "historyId": msg['historyId'],
        "internalDate": msg['internalDate'],
        "sender": sender,
        "date": date
    }
    
    # Append the email to the list
    emails.append(email)

# Save the emails list to a JSON file
with open('emails.json', 'w') as f:
    json.dump(emails, f, indent=4)

print("Emails saved to emails.json")