"""
Script to save database data to cvs file
"""

import csv
from routes import get_collection
from dotenv import load_dotenv


load_dotenv()

collection = get_collection()

header = ['name', 'reddit_score', 'twitter_score',
          'avg_sale_price', 'volume', 'preview_img']

with open('training_data.csv', 'w') as file:
    file.truncate(0)

writer = csv.writer(file)
writer.writerow(header)

for document in collection.find():
    print("Writing row for : " + document['name'])
    writer.writerow(list(document.values())[1:])
