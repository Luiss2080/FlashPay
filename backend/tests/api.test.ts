import { describe, it, expect, vi, beforeEach } from "vitest";
import request from "supertest";

const query = vi.fn();
const connQuery = vi.fn();
vi.mock("../src/config/db", () => ({
  pool: {
    query: (...a: any[]) => query(...a),
    getConnection: async () => ({
      beginTransaction: async () => {},
      commit: async () => {},
      rollback: async () => {},
      release: () => {},
      query: (...a: any[]) => connQuery(...a),
    }),
  },
  checkConnection: async () => {},
}));

import { app } from "../src/app";
import { hashPassword, signToken } from "../src/utils/auth";

beforeEach(() => {
  query.mockReset();
  connQuery.mockReset();
});

const userRow = (password: string, id = 5) => ({
  id_usuario: id,
  nombre: "Ana",
  email: "a@a.com",
  password,
  saldo: "10.00",
});

describe("POST /auth/login", () => {
  it("logs in with a bcrypt hash and returns a JWT accepted by /api (no password field)", async () => {
    const hash = await hashPassword("clave-segura");
    query.mockResolvedValueOnce([[userRow(hash)]]);
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "a@a.com", password: "clave-segura" });
    expect(res.status).toBe(200);
    expect(res.body.user.password).toBeUndefined();

    query.mockResolvedValue([[]]);
    const check = await request(app)
      .get("/api/notifications")
      .set("Authorization", `Bearer ${res.body.token}`);
    expect(check.status).toBe(200);
  });

  it("rejects a wrong password and the old fixed demo password", async () => {
    const hash = await hashPassword("clave-segura");
    query.mockResolvedValue([[userRow(hash)]]);
    for (const password of ["mala", "123456"]) {
      const res = await request(app)
        .post("/auth/login")
        .send({ email: "a@a.com", password });
      expect(res.status).toBe(401);
      expect(res.body.token).toBeUndefined();
    }
  });

  it("does not reveal whether the account exists", async () => {
    query.mockResolvedValueOnce([[]]);
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "x@x.com", password: "p" });
    expect(res.status).toBe(401);
  });

  it("upgrades a legacy plaintext password to bcrypt on successful login", async () => {
    query.mockResolvedValueOnce([[userRow("plano1", 3)]]);
    query.mockResolvedValueOnce([{}]);
    const res = await request(app)
      .post("/auth/login")
      .send({ email: "a@a.com", password: "plano1" });
    expect(res.status).toBe(200);
    const update = query.mock.calls[1];
    expect(update[0]).toMatch(/UPDATE Usuarios SET password/);
    expect(update[1][0]).toMatch(/^\$2[aby]\$/);
    expect(update[1][1]).toBe(3);
  });
});

describe("/api requires a valid token", () => {
  it("returns 401 without token and with the old Math.random-style token", async () => {
    expect((await request(app).get("/api/home-data?id_usuario=1")).status).toBe(
      401,
    );
    const res = await request(app)
      .post("/api/transfer")
      .set("Authorization", "Bearer k3j2h1g4f5")
      .send({ id_emisor: 1, telefono: "1", monto: 5 });
    expect(res.status).toBe(401);
    expect(connQuery).not.toHaveBeenCalled();
  });

  it("uses the user id from the token, not from the request", async () => {
    query.mockResolvedValue([[]]);
    await request(app)
      .get("/api/contacts?user_id=999")
      .set("Authorization", `Bearer ${signToken(7)}`);
    expect(query.mock.calls[0][1]).toEqual([7]);
  });

  it("transfer debits the token's user even if the body names someone else", async () => {
    connQuery.mockImplementation(async (sql: string) => {
      if (/FROM Usuarios WHERE id_usuario/.test(sql))
        return [[{ id_usuario: 7, saldo: "100.00" }]];
      if (/WHERE telefono/.test(sql)) return [[{ id_usuario: 8 }]];
      return [{}];
    });
    const res = await request(app)
      .post("/api/transfer")
      .set("Authorization", `Bearer ${signToken(7)}`)
      .send({ id_emisor: 1, telefono: "555", monto: 20 });
    expect(res.status).toBe(200);
    const debit = connQuery.mock.calls.find((c) =>
      /saldo = saldo - \?/.test(c[0]),
    )!;
    expect(debit[1]).toEqual([20, 7]);
  });

  it("rejects negative, zero and non-numeric amounts", async () => {
    for (const monto of [-50, "abc", 0]) {
      const res = await request(app)
        .post("/api/transfer")
        .set("Authorization", `Bearer ${signToken(7)}`)
        .send({ telefono: "555", monto });
      expect(res.status).toBe(400);
    }
    expect(connQuery).not.toHaveBeenCalled();
  });
});
