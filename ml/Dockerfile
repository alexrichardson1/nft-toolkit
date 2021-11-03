FROM python:3.8-slim-buster

WORKDIR /api/app

COPY requirements.txt requirements.txt
RUN /usr/local/bin/python -m pip install --upgrade pip
RUN pip3 install -r requirements.txt

COPY . .

EXPOSE 4000

CMD [ "python3", "-m" , "flask", "run" ]