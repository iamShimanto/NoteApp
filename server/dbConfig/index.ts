import mongoose from "mongoose";
import port from "../utils/validEnv.ts";

const dbConfig = async () => {
  await mongoose
    .connect(port.MONGODB_URI)
    .then(() => console.log("mongodb connected"))
    .catch((err) => console.error(err));
};

export default dbConfig;
