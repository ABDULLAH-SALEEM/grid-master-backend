import "./pre-start"; // Must be the first import
import logger from "jet-logger";
import server from "./server";

const port = parseInt(process.env.PORT || "8080", 10);
const SERVER_START_MSG = "Express server started on port: " + port;

server.listen(port, "0.0.0.0", () => logger.info(SERVER_START_MSG));
