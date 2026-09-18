import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import authRoutes from "./routes/authRoutes";
import apiRoutes from "./routes/apiRoutes";
import { requireAuth } from "./middleware/auth";

export const app = express();

app.use(cors());
app.use(bodyParser.json());

app.use("/auth", authRoutes);
// Todas las rutas de /api exigen un JWT valido; el usuario sale del token, no del cuerpo.
app.use("/api", requireAuth, apiRoutes);

app.get("/", (req, res) => {
  res.send("FlashPay Backend is running");
});
