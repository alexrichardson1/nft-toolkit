FROM python:3.8-slim

COPY requirements.txt requirements.txt
RUN /usr/local/bin/python -m pip install --upgrade pip
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 4000

RUN apt-get update && apt-get -y install cron

# Copy cron file to the cron.d directory
COPY update_scripts/crontab /etc/cron.d/crontab
 
# Give execution rights on the cron job
RUN chmod 0644 /etc/cron.d/crontab

# Apply cron job
RUN crontab /etc/cron.d/crontab
 
# Create the log file to be able to run tail
RUN touch /var/log/cron.log
 
# Run the app and cron job on start up
CMD python3 api/app.py & cron && tail -f /var/log/cron.log