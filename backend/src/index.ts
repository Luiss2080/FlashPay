import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import { checkConnection } from "./config/db";
import authRoutes from "./routes/authRoutes";
import apiRoutes from "./routes/apiRoutes";

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

// Check DB Connection
checkConnection();

// Routes
app.use("/auth", authRoutes);
app.use("/api", apiRoutes);

app.get("/", (req, res) => {
  res.send("FlashPay Backend is running");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
