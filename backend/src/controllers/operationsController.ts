import { Request, Response } from "express";
import { pool } from "../config/db";
import { RowDataPacket, ResultSetHeader } from "mysql2";

// Transfer Logic
export const transfer = async (req: Request, res: Response) => {
  const { id_emisor, telefono, monto } = req.body;

  if (!id_emisor || !telefono || !monto) {
    res.status(400).json({ status: "error", message: "Datos incompletos" });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    // 1. Check Sender Balance
    const [senderRows] = await connection.query<RowDataPacket[]>(
      "SELECT saldo FROM Usuarios WHERE id_usuario = ?",
      [id_emisor],
    );
    if (senderRows.length === 0) {
      await connection.rollback();
      res
        .status(404)
        .json({ status: "error", message: "Usuario emisor no encontrado" });
      return;
    }
    const sender = senderRows[0];
    const amount = parseFloat(monto);

    if (sender.saldo < amount) {
      await connection.rollback();
      res.status(400).json({ status: "error", message: "Saldo insuficiente" });
      return;
    }

    // 2. Find Receiver
    const [receiverRows] = await connection.query<RowDataPacket[]>(
      "SELECT id_usuario FROM Usuarios WHERE telefono = ?",
      [telefono],
    );
    if (receiverRows.length === 0) {
      await connection.rollback();
      res
        .status(404)
        .json({ status: "error", message: "Destinatario no encontrado" });
      return;
    }
    const receiver = receiverRows[0];

    if (receiver.id_usuario == id_emisor) {
      await connection.rollback();
      res
        .status(400)
        .json({
          status: "error",
          message: "No puedes transferirte a ti mismo",
        });
      return;
    }

    // 3. Update Balances
    await connection.query(
      "UPDATE Usuarios SET saldo = saldo - ? WHERE id_usuario = ?",
      [amount, id_emisor],
    );
    await connection.query(
      "UPDATE Usuarios SET saldo = saldo + ? WHERE id_usuario = ?",
      [amount, receiver.id_usuario],
    );

    // 4. Record Transaction
    await connection.query(
      "INSERT INTO Transacciones (id_emisor, id_receptor, monto, tipo) VALUES (?, ?, ?, ?)",
      [id_emisor, receiver.id_usuario, amount, "transferencia"],
    );

    await connection.commit();
    res.json({ status: "success", message: "Transferencia exitosa" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error en la transferencia" });
  } finally {
    connection.release();
  }
};

// Topup Logic
export const topup = async (req: Request, res: Response) => {
  const { id_usuario, monto, telefono, operador } = req.body;

  if (!id_usuario || !monto || !telefono) {
    res.status(400).json({ status: "error", message: "Datos incompletos" });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const amount = parseFloat(monto);

    // 1. Check Balance
    const [userRows] = await connection.query<RowDataPacket[]>(
      "SELECT saldo FROM Usuarios WHERE id_usuario = ?",
      [id_usuario],
    );
    if (userRows.length === 0) {
      await connection.rollback();
      res
        .status(404)
        .json({ status: "error", message: "Usuario no encontrado" });
      return;
    }

    if (userRows[0].saldo < amount) {
      await connection.rollback();
      res.status(400).json({ status: "error", message: "Saldo insuficiente" });
      return;
    }

    // 2. Deduct Bundle
    await connection.query(
      "UPDATE Usuarios SET saldo = saldo - ? WHERE id_usuario = ?",
      [amount, id_usuario],
    );

    // 3. Log
    // Assuming self-topup or generic receptor id for logs, usually 0 or system id.
    // Since constraints might fail if id_receptor doesn't exist, we assume id_usuario is both actor and beneficiary of the "service",
    // OR we insert into a separate Topups table if it existed, but we reuse Transacciones with type 'recarga'
    // Hack: Set receiver as self for now to track expense.
    await connection.query(
      "INSERT INTO Transacciones (id_emisor, id_receptor, monto, tipo) VALUES (?, ?, ?, ?)",
      [id_usuario, id_usuario, amount, "recarga"],
    );

    await connection.commit();
    res.json({
      status: "success",
      message: `Recarga de S/ ${amount} a ${operador || "celular"} exitosa`,
    });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res.status(500).json({ status: "error", message: "Error en la recarga" });
  } finally {
    connection.release();
  }
};

// Pay Service Logic
export const payService = async (req: Request, res: Response) => {
  const { user_id, service_id, amount, reference } = req.body;

  if (!user_id || !service_id || !amount || !reference) {
    res.status(400).json({ status: "error", message: "Datos incompletos" });
    return;
  }

  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();

    const monto = parseFloat(amount);

    // 1. Check Balance
    const [userRows] = await connection.query<RowDataPacket[]>(
      "SELECT saldo FROM Usuarios WHERE id_usuario = ?",
      [user_id],
    );
    if (userRows.length === 0 || userRows[0].saldo < monto) {
      await connection.rollback();
      res
        .status(400)
        .json({
          status: "error",
          message: "Saldo insuficiente o usuario no encontrado",
        });
      return;
    }

    // 2. Deduct Balance
    await connection.query(
      "UPDATE Usuarios SET saldo = saldo - ? WHERE id_usuario = ?",
      [monto, user_id],
    );

    // 3. Record Payment
    await connection.query(
      "INSERT INTO Pagos_Servicios (id_usuario, id_servicio, monto, referencia) VALUES (?, ?, ?, ?)",
      [user_id, service_id, monto, reference],
    );

    // Optional: Log in Transacciones with type 'pago' (skipping to avoid complexity with ID receptor)

    await connection.commit();
    res.json({ status: "success", message: "Pago realizado con éxito" });
  } catch (error) {
    await connection.rollback();
    console.error(error);
    res
      .status(500)
      .json({ status: "error", message: "Error al procesar el pago" });
  } finally {
    connection.release();
  }
};
