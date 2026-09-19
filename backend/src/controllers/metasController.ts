import { Request, Response } from "express";
import { pool } from "../config/db";
import { uid } from "../middleware/auth";
import { parseAmount } from "../utils/amount";

export const getMetas = async (req: Request, res: Response) => {
  const userId = uid(req);
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Metas WHERE id_usuario = ?",
      [userId],
    );
    res.json({ status: "success", metas: rows });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
};

export const createMeta = async (req: Request, res: Response) => {
  const user_id = uid(req);
  const { title, icon } = req.body;
  const target_amount = parseAmount(req.body.target_amount);
  if (!title || target_amount === null) {
    res.status(400).json({ status: "error", message: "Datos incompletos" });
    return;
  }

  try {
    await pool.query(
      "INSERT INTO Metas (id_usuario, titulo, monto_objetivo, icono) VALUES (?, ?, ?, ?)",
      [user_id, title, target_amount, icon || "piggy-bank"],
    );
    res.json({ status: "success", message: "Meta creada" });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
};

export const addFundsMeta = async (req: Request, res: Response) => {
  const { meta_id } = req.body;
  const amount = parseAmount(req.body.amount);
  if (!meta_id || amount === null) {
    res.status(400).json({ status: "error", message: "Datos incompletos" });
    return;
  }

  try {
    await pool.query(
      "UPDATE Metas SET monto_actual = monto_actual + ? WHERE id_meta = ? AND id_usuario = ?",
      [amount, meta_id, uid(req)],
    );
    // TODO: Deduct from main balance? For now just tracking visually.
    res.json({ status: "success", message: "Fondos agregados" });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
};
