import { Request, Response } from "express";
import { pool } from "../config/db";
import { RowDataPacket } from "mysql2";

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400).json({ status: "error", message: "Datos incompletos" });
    return;
  }

  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      "SELECT id_usuario, nombre, email, password, saldo FROM Usuarios WHERE email = ?",
      [email],
    );

    if (rows.length > 0) {
      const user = rows[0];

      // Password verification logic matching PHP (Plain text for dev/demo or hash check)
      // In PHP: if (password_verify($password, $user['password']) || $user['password'] === $password || $password === '123456')
      // simulating strictly standard behavior here + the demo backdoor

      const isMatch = user.password === password || password === "123456";
      // Note: Skipping generic password_verify implementation for now as we don't have the bcrypt lib installed and mocked users use plain text or different hashes.
      // If production, use bcrypt.compare(password, user.password)

      if (isMatch) {
        const { password, ...userWithoutPassword } = user;
        const token =
          Math.random().toString(36).substring(2) +
          Math.random().toString(36).substring(2); // Simple mock token

        res.json({
          status: "success",
          message: "Login exitoso",
          token,
          user: userWithoutPassword,
        });
      } else {
        res
          .status(401)
          .json({ status: "error", message: "Contraseña incorrecta" });
      }
    } else {
      res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", message: "Error en el servidor" });
  }
};
