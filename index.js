import { connectDB } from "./database/db.js";
import { PORT } from "./config.js";

import app from "./app.js";

connectDB();

const server = app.listen(PORT, async () => {
  console.log("Se ha subido el servidor en el puerto" + PORT);
});

export default server;
