import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
let mongoTestDB: MongoMemoryServer;

const connect: () => Promise<void> = async () => {
  mongoTestDB = await MongoMemoryServer.create();
  const uri = mongoTestDB.getUri();
  await mongoose.connect(uri);
};

const clear: () => Promise<void> = async () => {
  if (!mongoTestDB) {
    return;
  }
  const { collections } = mongoose.connection;

  for (const key in collections) {
    const collection = collections[key];
    if (collection) {
      await collection.deleteMany({});
    }
  }
};

const close: () => Promise<void> = async () => {
  if (!mongoTestDB) {
    return;
  }
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
  await mongoTestDB.stop();
};

const testDB = {
  connect: connect,
  clear: clear,
  close: close,
};

export default testDB;
