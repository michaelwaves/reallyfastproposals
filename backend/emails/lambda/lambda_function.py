import json
import boto3
import os
from email_sender import send_rfp_email
from db import get_subscribed_users, search_rfps
from datetime import datetime


def lambda_handler(event, context):
    # TODO implement
    name = "Thomas Speciel"
    users = get_subscribed_users()
    for u in users:
        email = u["email"]
        sender = "michael@quantoflow.com"
        subject = f"RFPs for {datetime.now().strftime('%d-%m-%Y')}"
        rfp_data = search_rfps(u["context"], 3)
        send_rfp_email(name, rfp_data, email, sender, subject)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }


if __name__ == "__main__":
    lambda_handler(1, 2)
