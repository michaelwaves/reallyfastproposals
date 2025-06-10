import boto3
from email_builder import EmailBuilder, load_rfp_html_template
import json
from dotenv import load_dotenv
import os
load_dotenv()
AWS_SES_REGION = os.getenv("AWS_SES_REGION_SES")
AWS_SECRET_ACCESS_KEY = os.getenv("AWS_SECRET_ACCESS_KEY_SES")
AWS_ACCESS_KEY_ID = os.getenv("AWS_ACCESS_KEY_ID_SES")


class EmailSender:
    def __init__(self, region_name='us-east-2'):
        self.client = boto3.client('ses', region_name=region_name,
                                   aws_access_key_id=AWS_ACCESS_KEY_ID,
                                   aws_secret_access_key=AWS_SECRET_ACCESS_KEY
                                   )

    def send(self, msg, sender, recipient):
        response = self.client.send_raw_email(
            Source=sender,
            Destinations=[recipient],
            RawMessage={'Data': msg.as_string()}
        )
        print(f"Email sent! Message ID: {response['MessageId']}")
        return response["MessageId"]


def send_rfp_email(name, rfp_data, email, sender, subject):
    html = load_rfp_html_template(name, rfp_data)
    text = json.dumps({"data": rfp_data})

    msg = EmailBuilder().from_sender(sender).to_recipient(email).with_subject(
        subject).with_text_body(text).with_html_body(html).build()

    return EmailSender().send(msg, sender, email)
