import dotenv from "dotenv";
import mongoose from "mongoose";

dotenv.config();

export const connect = async (): Promise<void> => {
  await mongoose.connect(process.env.DB_URI);
};

export const close = async (): Promise<void> => {
  await mongoose.connection.dropDatabase();
  await mongoose.connection.close();
};

const db = {
  connect: connect,
  close: close,
};
export default db;
