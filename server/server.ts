import app from "./app";

import env from "./utils/validEnv";
import dbConfig from "./dbConfig/index";

const port = env.PORT;

dbConfig();

app.listen(port, () => {
  console.log("server is running on port " + port);
});
