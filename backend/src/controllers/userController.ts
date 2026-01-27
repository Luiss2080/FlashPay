import { Request, Response } from "express";
import { pool } from "../config/db";
import { RowDataPacket } from "mysql2";

export const updateProfile = async (req: Request, res: Response) => {
  const { user_id, nombre, email, telefono } = req.body;

  if (!user_id || !nombre || !email) {
    res
      .status(400)
      .json({ status: "error", message: "Faltan datos requeridos" });
    return;
  }

  try {
    await pool.query(
      "UPDATE Usuarios SET nombre = ?, email = ?, telefono = ? WHERE id_usuario = ?",
      [nombre, email, telefono || null, user_id],
    );

    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id_usuario, nombre, email, telefono, saldo FROM Usuarios WHERE id_usuario = ?",
      [user_id],
    );

    res.json({
      status: "success",
      message: "Perfil actualizado correctamente",
      user: rows[0],
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error al actualizar perfil" });
  }
};

export const updatePassword = async (req: Request, res: Response) => {
  const { user_id, current_password, new_password } = req.body;

  if (!user_id || !current_password || !new_password) {
    res
      .status(400)
      .json({ status: "error", message: "Faltan datos requeridos" });
    return;
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT password FROM Usuarios WHERE id_usuario = ?",
      [user_id],
    );

    if (rows.length === 0) {
      res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
      return;
    }

    const user = rows[0];
    // Simple check matching authController (no hash for now per existing pattern)
    if (user.password !== current_password) {
      res
        .status(401)
        .json({ status: "error", message: "Contraseña actual incorrecta" });
      return;
    }

    await pool.query("UPDATE Usuarios SET password = ? WHERE id_usuario = ?", [
      new_password,
      user_id,
    ]);

    res.json({ status: "success", message: "Contraseña actualizada" });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error al cambiar contraseña" });
  }
};

// Spending Limits (Mock implementation for now, or need DB schema update)
// Let's assume we store it in a new table or just mock it for the MVP feature
export const getLimits = async (req: Request, res: Response) => {
  // Mock response
  res.json({
    status: "success",
    limits: {
      daily_transfer: 500,
      daily_service: 1000,
    },
  });
};

export const setLimits = async (req: Request, res: Response) => {
  // Mock success
  res.json({ status: "success", message: "Límites actualizados" });
};
