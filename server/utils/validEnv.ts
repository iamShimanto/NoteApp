import { cleanEnv, port, str, url } from "envalid";

export default cleanEnv(process.env, {
  MONGODB_URI: str(),
  PORT: port({ default: 5000 }),
  JWT_SECRET: str(),
  CLIENT_URL: url(),
});
