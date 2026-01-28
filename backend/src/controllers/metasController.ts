import { Request, Response } from "express";
import { pool } from "../config/db";
import { RowDataPacket } from "mysql2";

export const getMetas = async (req: Request, res: Response) => {
  const userId = req.query.user_id;
  if (!userId) {
    res.status(400).json({ status: "error", message: "Falta user_id" });
    return;
  }
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
  const { user_id, title, target_amount, icon } = req.body;
  if (!user_id || !title || !target_amount) {
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
  const { meta_id, amount } = req.body;
  if (!meta_id || !amount) {
    res.status(400).json({ status: "error", message: "Datos incompletos" });
    return;
  }

  try {
    await pool.query(
      "UPDATE Metas SET monto_actual = monto_actual + ? WHERE id_meta = ?",
      [amount, meta_id],
    );
    // TODO: Deduct from main balance? For now just tracking visually.
    res.json({ status: "success", message: "Fondos agregados" });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
};
