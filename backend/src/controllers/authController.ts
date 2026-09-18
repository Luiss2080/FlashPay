import { Request, Response } from "express";
import { pool } from "../config/db";
import { RowDataPacket } from "mysql2";
import { hashPassword, signToken, verifyPassword } from "../utils/auth";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body ?? {};

  if (
    typeof email !== "string" ||
    typeof password !== "string" ||
    !email ||
    !password
  ) {
    res.status(400).json({ status: "error", message: "Datos incompletos" });
    return;
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id_usuario, nombre, email, password, saldo FROM Usuarios WHERE email = ?",
      [email],
    );

    // Mismo mensaje para usuario inexistente y clave incorrecta (no revela cuentas).
    const invalid = () =>
      res
        .status(401)
        .json({ status: "error", message: "Credenciales incorrectas" });

    if (rows.length === 0) {
      invalid();
      return;
    }

    const user = rows[0];
    const check = await verifyPassword(password, String(user.password));
    if (!check.ok) {
      invalid();
      return;
    }

    // Upgrade-on-login: cuentas antiguas en texto plano se re-guardan con bcrypt.
    if (check.needsUpgrade) {
      await pool.query(
        "UPDATE Usuarios SET password = ? WHERE id_usuario = ?",
        [await hashPassword(password), user.id_usuario],
      );
    }

    const { password: _omit, ...userWithoutPassword } = user;
    res.json({
      status: "success",
      message: "Login exitoso",
      token: signToken(user.id_usuario),
      user: userWithoutPassword,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};
