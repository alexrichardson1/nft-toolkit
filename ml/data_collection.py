"""
We will be using Mongodb Atlas as our database we don't need to store anything locally
it will all be done in the cloud.
"""
import json
import threading
import requests
import pymongo


def database_initialisations(databases1, client1):
    """
    This will initialise two databases in client1,
    1) Collections - stores collection slugs
    2) Assets - stores asset information

    Args:
        databases1: a list of database names
        client1: the mongodb client

    Returns:
        nothing
    """

    if "AssetDB" not in databases1:
        # initialise AssetDB
        collection = client1.AssetDB.assets
        asset_data = [
            {
                'num_sales': 0,
                'name': 'CryptoPunk #10000',
                'description': None,
                'traits': [],
                'last_sale': None,
                'top_bid': None,
                'sell_orders': None,
                'image_url': 'https://www.larvalabs.com/cryptopunks/cryptopunk10000.png'
            },
        ]

        collection.insert_many(asset_data)

    if "CollectionDB" not in databases1:
        # initialise CollectionDB
        collection = client1.CollectionDB.collections
        collection_data = [
            {
                'name': 'cryptopunk',
            },
        ]

        collection.insert_many(collection_data)


def isolate_parameters(asset: dict) -> dict:
    """
    Takes in an asset object (dictionary) and isolates relevant parameters

    Args:
        asset: asset object from opensea

    Returns:
        dict: updated asset
    """

    return {
        "num_sales": asset["num_sales"],
        "name": asset["name"],
        "description": asset["description"],
        "traits": asset["traits"],
        "last_sale": asset["last_sale"],
        "top_bid": asset["top_bid"],
        "sell_orders": asset["sell_orders"],
        "image_url": asset["image_url"]
    }


def collect_asset_information(client1, collection_name: str = "cryptopunks"):
    """
    This will use OpenSea to collect asset infromation provided that the collection-slug
    is equal to the collection name.

    Args:
        client1: the mongodb client
        collection_name: the collection slug

    Returns:
        nothing
    """
    # Get collection id
    correct_collection = client1.CollectionDB.collections.find(
        {"name": collection_name})

    if not correct_collection:
        return
    collection_id = correct_collection[0]["_id"]

    url = "https://api.opensea.io/api/v1/assets"

    asset_collection = client1.AssetDB.assets

    for i in range(1000):
        try:
            querystring = {
                "token_ids": list(range((i * 29) + 1, (i * 29) + 30)),
                "order_direction": "asc",
                "offset": "0",
                "limit": "50",
                "collection": collection_name,
            }
            headers = {"Accept": "application/json"}

            response = requests.request(
                "GET", url, headers=headers, params=querystring)
            resp = json.loads(response.text)
            if not resp["assets"]:
                break
            for j in resp["assets"]:
                # Populate database
                isolated = isolate_parameters(j)
                isolated["collection_id"] = collection_id
                if not asset_collection.find({"name": isolated["name"],
                                              "description": isolated["description"]}):
                    asset_collection.insert_many([isolated])
                else:
                    asset_collection.update_one({"name": isolated["name"],
                                                 "description": isolated["description"]},
                                                isolated)
        except ():
            break


def collect_collection_information(client1, offset: int = 0):
    """
    This scrapes collection slugs from the OpenSea API

    Args:
        client1: the mongodb client
        offset: page offset it should search for

    Returns:
        array of collections
    """
    collection = client1.CollectionDB.collections
    url = "https://api.opensea.io/api/v1/events"
    collections = []
    querystring = {
        "offset": offset,
        "limit": "300",
    }
    headers = {"Accept": "application/json"}

    response = requests.request(
        "GET", url, headers=headers, params=querystring)
    resp = json.loads(response.text)["asset_events"]
    for i in resp:
        slug = i["collection_slug"]
        # Check if collection already exists in mongodb
        if not collection.find({"name": slug}):
            collections.append(slug)
            collection.insert_many([{"name": slug}])

    return collections


def collection_thread_function(client1, global_q):
    """
    Collection Thread function - collects collection-slugs and populates
    mongodb

    Args:
        client1: mongo db client
        global_q: the global q object

    Returns:
        nothing
    """
    offset = 0
    while offset < 10000:
        cols = collect_collection_information(client1, offset)
        for i in cols:
            print("adding collection:", i)
            global_q.queue.append(i)
        offset += len(cols)
    global_q.finished = True


def asset_thread_functions(client1, global_q):
    """
    Asset Thread - handles getting asset information from collection slug

    Args:
        client1: the mongodb client
        global_q: the global queue data structure

    Returns:
        nothing
    """

    while not global_q.finished:
        while not global_q.queue:
            col = global_q.queue.pop(0)
            print("handling collection:", col)
            collect_asset_information(client1, collection_name=col)

    while not global_q.queue:
        col = global_q.queue.pop(0)
        print("handling collection:", col)
        collect_asset_information(client1, collection_name=col)


class GlobalQueue:
    """
    Object that handles the job queue and the finished flag
    Thread 1 - Adds collections to the queue
    Thread 2 - Removes a collection, conducts asset population
    """

    def __init__(self):
        self.queue = []
        self.finished = False

    def get_queue(self):
        """
        Gets queue
        """
        return self.queue

    def get_finished(self):
        """
        Gets finished flag
        """
        return self.finished


if __name__ == "__main__":
    MONGO_STRING = ""
    CLIENT = pymongo.MongoClient(MONGO_STRING)

    DATABASES = []

    # Fetch current databases
    print("Current Databases")

    for database_name in CLIENT.list_database_names():
        print("Database - " + database_name)
        DATABASES.append(database_name)

    print("----- END OF DATABASES -----")

    database_initialisations(DATABASES, CLIENT)

    GLOBAL_QUEUE = GlobalQueue()

    threading.Thread(target=collection_thread_function,
                     args=(CLIENT, GLOBAL_QUEUE)).start()
    threading.Thread(target=asset_thread_functions,
                     args=(CLIENT, GLOBAL_QUEUE)).start()
