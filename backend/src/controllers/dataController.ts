import { Request, Response } from "express";
import { pool } from "../config/db";
import { RowDataPacket } from "mysql2";

export const getServices = async (req: Request, res: Response) => {
  try {
    const [rows] = await pool.query("SELECT * FROM Servicios");
    res.json({ status: "success", services: rows });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
};

export const getContacts = async (req: Request, res: Response) => {
  const userId = req.query.user_id;
  if (!userId) {
    res.status(400).json({ status: "error", message: "Falta user_id" });
    return;
  }
  try {
    const [rows] = await pool.query(
      `
      SELECT c.id_contacto, c.alias, u.nombre, u.telefono, u.email, u.id_usuario as contact_user_id 
      FROM Contactos c
      JOIN Usuarios u ON c.id_usuario_contacto = u.id_usuario
      WHERE c.id_usuario = ?`,
      [userId],
    );
    res.json({ status: "success", contacts: rows });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
};

export const addContact = async (req: Request, res: Response) => {
  const { user_id, contact_phone, contact_email, alias } = req.body;
  if (!user_id || (!contact_phone && !contact_email)) {
    res.status(400).json({ status: "error", message: "Datos incompletos" });
    return;
  }

  try {
    let where = "";
    let val = "";
    if (contact_phone) {
      where = "telefono = ?";
      val = contact_phone;
    } else {
      where = "email = ?";
      val = contact_email;
    }

    const [users] = await pool.query<RowDataPacket[]>(
      `SELECT id_usuario, nombre FROM Usuarios WHERE ${where}`,
      [val],
    );

    if (users.length === 0) {
      res
        .status(404)
        .json({ status: "error", message: "Usuario contacto no encontrado" });
      return;
    }

    const contactUser = users[0];
    if (contactUser.id_usuario == user_id) {
      res
        .status(400)
        .json({ status: "error", message: "No puedes agregarte a ti mismo" });
      return;
    }

    const finalAlias = alias || contactUser.nombre;

    await pool.query(
      `
        INSERT INTO Contactos (id_usuario, id_usuario_contacto, alias) VALUES (?, ?, ?)
        ON DUPLICATE KEY UPDATE alias = ?`,
      [user_id, contactUser.id_usuario, finalAlias, finalAlias],
    );

    res.json({ status: "success", message: "Contacto agregado" });
  } catch (error) {
    res
      .status(500)
      .json({ status: "error", message: "Error al agregar contacto" });
  }
};

export const getNotifications = async (req: Request, res: Response) => {
  const userId = req.query.user_id;
  if (!userId) {
    res.status(400).json({ status: "error" });
    return;
  }
  try {
    const [rows] = await pool.query(
      "SELECT * FROM Notificaciones WHERE id_usuario = ? ORDER BY fecha DESC LIMIT 20",
      [userId],
    );
    // Mark as read
    await pool.query(
      "UPDATE Notificaciones SET leido = 1 WHERE id_usuario = ? AND leido = 0",
      [userId],
    );

    res.json({ status: "success", notifications: rows });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
};

export const resolveQR = async (req: Request, res: Response) => {
  const code = req.query.code;
  if (!code) {
    res.status(400).json({ status: "error" });
    return;
  }
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id_usuario FROM QR_Pagos WHERE codigo_qr = ?",
      [code],
    );
    if (rows.length > 0) {
      const userId = rows[0].id_usuario;
      const [users] = await pool.query<RowDataPacket[]>(
        "SELECT nombre, telefono, email FROM Usuarios WHERE id_usuario = ?",
        [userId],
      );
      if (users.length > 0) {
        res.json({ status: "success", data: users[0] });
        return;
      }
    }
    res.status(404).json({ status: "error", message: "QR no encontrado" });
  } catch (error) {
    res.status(500).json({ status: "error" });
  }
};
