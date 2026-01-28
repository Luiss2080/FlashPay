import { Request, Response } from "express";
import { pool } from "../config/db";

export const getPromos = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Promociones WHERE activo = 1 ORDER BY fecha_inicio DESC",
    );
    res.json({ status: "success", data: rows });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error fetching promos" });
  }
};
