import { Request, Response } from "express";
import { pool } from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

export const transfer = async (req: Request, res: Response) => {
  const { id_emisor, telefono, monto } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Get Sender
    const [senderRows] = await connection.query<RowDataPacket[]>(
      "SELECT id_usuario, saldo FROM Usuarios WHERE id_usuario = ?",
      [id_emisor],
    );

    if (senderRows.length === 0) {
      throw new Error("Usuario emisor no encontrado");
    }

    const sender = senderRows[0];
    if (parseFloat(sender.saldo) < monto) {
      throw new Error("Saldo insuficiente");
    }

    // 2. Get Receiver
    const [receiverRows] = await connection.query<RowDataPacket[]>(
      "SELECT id_usuario FROM Usuarios WHERE telefono = ?",
      [telefono],
    );

    if (receiverRows.length === 0) {
      throw new Error("Destinatario no encontrado (teléfono inválido)");
    }
    const receiver = receiverRows[0];

    // 3. Deduct from Sender
    await connection.query(
      "UPDATE Usuarios SET saldo = saldo - ? WHERE id_usuario = ?",
      [monto, id_emisor],
    );

    // 4. Add to Receiver
    await connection.query(
      "UPDATE Usuarios SET saldo = saldo + ? WHERE id_usuario = ?",
      [monto, receiver.id_usuario],
    );

    // 5. Record Transaction
    await connection.query(
      "INSERT INTO Transacciones (id_emisor, id_receptor, monto, tipo, descripcion) VALUES (?, ?, ?, 'transferencia', 'Yapeo')",
      [id_emisor, receiver.id_usuario, monto],
    );

    await connection.commit();
    res.json({ status: "success", message: "Transferencia realizada" });
  } catch (error: any) {
    await connection.rollback();
    res.status(400).json({ status: "error", message: error.message });
  } finally {
    connection.release();
  }
};

export const topup = async (req: Request, res: Response) => {
  const { id_usuario, telefono, operador, monto } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check balance
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT saldo FROM Usuarios WHERE id_usuario = ?",
      [id_usuario],
    );
    if (rows.length === 0) throw new Error("Usuario no encontrado");
    if (rows[0].saldo < monto) throw new Error("Saldo insuficiente");

    // Deduct
    await connection.query(
      "UPDATE Usuarios SET saldo = saldo - ? WHERE id_usuario = ?",
      [monto, id_usuario],
    );

    // Record (Self transaction or service payment style)
    await connection.query(
      "INSERT INTO Transacciones (id_emisor, id_receptor, monto, tipo, descripcion) VALUES (?, ?, ?, 'recarga', ?)",
      [id_usuario, id_usuario, monto, `Recarga ${operador} - ${telefono}`],
    );

    await connection.commit();
    res.json({ status: "success", message: "Recarga realizada exitosamente" });
  } catch (error: any) {
    await connection.rollback();
    res.status(400).json({ status: "error", message: error.message });
  } finally {
    connection.release();
  }
};

export const payService = async (req: Request, res: Response) => {
  const { id_usuario, id_servicio, codigo_cliente, monto } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Check balance
    const [rows] = await connection.query<RowDataPacket[]>(
      "SELECT saldo FROM Usuarios WHERE id_usuario = ?",
      [id_usuario],
    );
    if (rows.length === 0) throw new Error("Usuario no encontrado");
    if (rows[0].saldo < monto) throw new Error("Saldo insuficiente");

    // Deduct
    await connection.query(
      "UPDATE Usuarios SET saldo = saldo - ? WHERE id_usuario = ?",
      [monto, id_usuario],
    );

    // Record
    await connection.query(
      "INSERT INTO Transacciones (id_emisor, id_receptor, monto, tipo, descripcion) VALUES (?, ?, ?, 'servicio', ?)",
      [
        id_usuario,
        id_usuario,
        monto,
        `Pago Servicio #${id_servicio} - ${codigo_cliente}`,
      ],
    );

    await connection.commit();
    res.json({ status: "success", message: "Servicio pagado exitosamente" });
  } catch (error: any) {
    await connection.rollback();
    res.status(400).json({ status: "error", message: error.message });
  } finally {
    connection.release();
  }
};

export const deposit = async (req: Request, res: Response) => {
  const { id_usuario, monto, metodo } = req.body;

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // Add balance (It's a deposit)
    await connection.query(
      "UPDATE Usuarios SET saldo = saldo + ? WHERE id_usuario = ?",
      [monto, id_usuario],
    );

    // Record
    await connection.query(
      "INSERT INTO Transacciones (id_emisor, id_receptor, monto, tipo, descripcion) VALUES (?, ?, ?, 'ingreso', ?)",
      [id_usuario, id_usuario, monto, `Ingreso vía ${metodo}`],
    );

    await connection.commit();
    res.json({ status: "success", message: "Depósito realizado exitosamente" });
  } catch (error: any) {
    await connection.rollback();
    res.status(400).json({ status: "error", message: error.message });
  } finally {
    connection.release();
  }
};
