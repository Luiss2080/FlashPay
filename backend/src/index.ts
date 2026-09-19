import dotenv from "dotenv";
dotenv.config();

import { app } from "./app";
import { checkConnection } from "./config/db";
import { assertAuthConfig } from "./utils/auth";

assertAuthConfig();

const PORT = process.env.PORT || 3001;

// Check DB Connection
checkConnection();

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
