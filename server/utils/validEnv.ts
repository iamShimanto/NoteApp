import { cleanEnv, port, str } from "envalid";

export default cleanEnv(process.env, {
  MONGODB_URI: str(),
  PORT: port(),
});
