import { Request, Response } from "express";
import { pool } from "../config/db";
import { RowDataPacket } from "mysql2";

export const getHomeData = async (req: Request, res: Response) => {
  const userId = req.query.id_usuario;

  if (!userId) {
    res
      .status(400)
      .json({ status: "error", message: "ID de usuario requerido" });
    return;
  }

  try {
    // 1. User Info & QR
    const [userRows] = await pool.query<RowDataPacket[]>(
      `SELECT u.saldo, u.nombre, u.email, u.telefono, q.codigo_qr 
       FROM Usuarios u 
       LEFT JOIN QR_Pagos q ON u.id_usuario = q.id_usuario 
       WHERE u.id_usuario = ?`,
      [userId],
    );

    if (userRows.length === 0) {
      res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
      return;
    }
    const user = userRows[0];

    // 2. Transactions
    const [transRows] = await pool.query<RowDataPacket[]>(
      `SELECT t.*, 
        CASE 
          WHEN t.id_emisor = ? THEN 'egreso' 
          ELSE 'ingreso' 
        END as direccion,
        CASE 
          WHEN t.id_emisor = ? THEN (SELECT nombre FROM Usuarios WHERE id_usuario = t.id_receptor)
          ELSE (SELECT nombre FROM Usuarios WHERE id_usuario = t.id_emisor)
        END as otro_usuario_nombre
       FROM Transacciones t 
       WHERE t.id_emisor = ? OR t.id_receptor = ? 
       ORDER BY t.fecha DESC 
       LIMIT 5`,
      [userId, userId, userId, userId],
    );

    // 3. Notifications (Unread)
    const [notifRows] = await pool.query<RowDataPacket[]>(
      "SELECT * FROM Notificaciones WHERE id_usuario = ? AND leido = 0 ORDER BY fecha DESC LIMIT 5",
      [userId],
    );

    // 4. Contacts
    const [contactRows] = await pool.query<RowDataPacket[]>(
      `SELECT c.id_contacto, c.alias, u.nombre, u.telefono 
       FROM Contactos c
       JOIN Usuarios u ON c.id_usuario_contacto = u.id_usuario
       WHERE c.id_usuario = ?
       LIMIT 10`,
      [userId],
    );

    res.json({
      status: "success",
      data: {
        user,
        transactions: transRows,
        notifications: notifRows,
        contacts: contactRows,
      },
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error al obtener datos" });
  }
};
