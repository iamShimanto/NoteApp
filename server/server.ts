import app from "./app.ts";

import env from "./utils/validEnv.ts";
import dbConfig from "./dbConfig/index.ts";

const port = env.PORT;

dbConfig();

app.listen(port, () => {
  console.log("server is running on port " + port);
});
