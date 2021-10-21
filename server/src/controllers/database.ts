import mongoose from "mongoose";
import dotenv from "dotenv";

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
