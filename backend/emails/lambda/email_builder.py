from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.application import MIMEApplication
import os


class EmailBuilder:
    def __init__(self):
        self.sender = None
        self.recipient = None
        self.subject = None
        self.text_body = ""
        self.html_body = ""
        self.attachment_path = None

    def from_sender(self, sender):
        self.sender = sender
        return self

    def to_recipient(self, recipient):
        self.recipient = recipient
        return self

    def with_subject(self, subject):
        self.subject = subject
        return self

    def with_text_body(self, text):
        self.text_body = text
        return self

    def with_html_body(self, html):
        self.html_body = html
        return self

    def with_attachment(self, path):
        self.attachment_path = path
        return self

    def build(self):
        msg = MIMEMultipart("mixed")
        msg["From"] = self.sender
        msg["To"] = self.recipient
        msg['Subject'] = self.subject

        msg_body = MIMEMultipart('alternative')
        msg_body.attach(MIMEText(self.text_body,  'plain'))
        msg_body.attach(MIMEText(self.html_body,  'html'))
        msg.attach(msg_body)

        if self.attachment_path:
            with open(self.attachment_path, 'rb') as f:
                part = MIMEApplication(f.read())
                part.add_header('Content-Disposition', 'attachment',
                                filename=os.path.basename(self.attachment_path))
                msg.attach(part)

        return msg


def load_rfp_html_template(name: str, rfp_list: list[dict]) -> str:
    first_name = name.split()[0]

    table_rows = ""
    for rfp in rfp_list:
        published = rfp.get("published", "")
        closing = rfp.get("closing_date", "")
        amended = "Yes" if rfp.get("amended", False) else "No"

        table_rows += f"""
        <tr>
            <td>{rfp['title']}</td>
            <td><a href="https://canadabuys.canada.ca/{rfp['link']}" style="color: #2a5934;">View</a></td>
            <td>{rfp.get('category', '')}</td>
            <td>{published}</td>
            <td>{amended}</td>
            <td>{closing}</td>
            <td>{rfp.get('organization', '')}</td>
        </tr>
        """

    html = f"""
    <html>
    <head>
        <meta charset="UTF-8">
        <title>RFP Digest</title>
    </head>
    <body style="font-family: Arial, sans-serif; font-size: 15px; background-color: #f6fff6; color: #2a5934; padding: 20px;">
        <h2 style="color: #2a5934;">Hi {first_name}, here are your latest RFP matches:</h2>

        <table style="border-collapse: collapse; width: 100%; margin-top: 20px;">
            <thead style="background-color: #d4f4dd;">
                <tr>
                    <th style="padding: 10px; border: 1px solid #b2dfb2;">Title</th>
                    <th style="padding: 10px; border: 1px solid #b2dfb2;">Link</th>
                    <th style="padding: 10px; border: 1px solid #b2dfb2;">Category</th>
                    <th style="padding: 10px; border: 1px solid #b2dfb2;">Published</th>
                    <th style="padding: 10px; border: 1px solid #b2dfb2;">Amended</th>
                    <th style="padding: 10px; border: 1px solid #b2dfb2;">Closing Date</th>
                    <th style="padding: 10px; border: 1px solid #b2dfb2;">Organization</th>
                </tr>
            </thead>
            <tbody>
                {table_rows}
            </tbody>
        </table>

        <p style="margin-top: 30px;">You’re receiving this because you subscribed to daily RFP alerts. Let us know if you’d like to refine your matches.</p>
        <p style="color: #2a5934;">– The Biddermelon Team</p>
    </body>
    </html>
    """

    return html


if __name__ == "__main__":
    html = load_rfp_html_template("Jane Smith", [
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
    ])

    with open("./test.html", "w") as f:
        f.write(html)
