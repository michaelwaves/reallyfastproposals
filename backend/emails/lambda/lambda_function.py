import json
import boto3
import os
from dotenv import load_dotenv
from email_sender import send_rfp_email

load_dotenv()
AWS_SES_REGION = os.getenv("AWS_SES_REGION")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID")


def lambda_handler(event, context):
    # TODO implement
    name = "Thomas Speciel"
    rfp_data = [
        {
            "title": "Cybersecurity Audit Services",
            "link": "https://rfps.gov/example1",
            "category": "IT Security",
            "published": "2025-06-05",
            "amended": True,
            "closing_date": "2025-06-20",
            "organization": "Ministry of Technology"
        },
        {
            "title": "Wastewater Treatment Upgrade",
            "link": "https://rfps.gov/example2",
            "category": "Environmental Engineering",
            "published": "2025-06-06",
            "amended": False,
            "closing_date": "2025-07-01",
            "organization": "Public Works Canada"
        }
    ]
    email = "michaelyu713705@gmail.com"
    sender = "michael@quantoflow.com"
    subject = "Weekly RFPs for June 8th 2025"

    send_rfp_email(name, rfp_data, email, sender, subject)
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
