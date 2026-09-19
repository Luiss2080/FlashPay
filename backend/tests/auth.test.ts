import { describe, it, expect, afterEach } from "vitest";
import jwt from "jsonwebtoken";
import {
  getJwtSecret,
  hashPassword,
  isBcryptHash,
  signToken,
  verifyPassword,
  verifyToken,
} from "../src/utils/auth";
import { requireAuth } from "../src/middleware/auth";

const env = { ...process.env };
afterEach(() => {
  process.env = { ...env };
});

describe("passwords", () => {
  it("hashes with bcrypt and verifies", async () => {
    const h = await hashPassword("s3cret!");
    expect(isBcryptHash(h)).toBe(true);
    expect(h).not.toContain("s3cret!");
    expect(await verifyPassword("s3cret!", h)).toEqual({
      ok: true,
      needsUpgrade: false,
    });
    expect((await verifyPassword("otra", h)).ok).toBe(false);
  });

  it("accepts a legacy plaintext password once and flags it for upgrade", async () => {
    expect(await verifyPassword("abc123", "abc123")).toEqual({
      ok: true,
      needsUpgrade: true,
    });
    expect((await verifyPassword("abc124", "abc123")).ok).toBe(false);
  });

  it("rejects the old fixed demo password against a placeholder hash", async () => {
    expect(
      (await verifyPassword("123456", "$2y$10$YourHashedPasswordHere")).ok,
    ).toBe(false);
  });
});

describe("tokens", () => {
  it("round-trips the user id", () => {
    expect(verifyToken(signToken(42))).toBe(42);
  });

  it("rejects tampered, foreign-secret, unsigned and expired tokens", () => {
    const good = signToken(1);
    const [h, , s] = good.split(".");
    const forgedPayload = Buffer.from(JSON.stringify({ sub: "2" })).toString(
      "base64url",
    );
    expect(verifyToken(`${h}.${forgedPayload}.${s}`)).toBeNull();
    expect(verifyToken(jwt.sign({ sub: "1" }, "other-secret"))).toBeNull();
    const unsigned = `${Buffer.from('{"alg":"none","typ":"JWT"}').toString("base64url")}.${Buffer.from('{"sub":"1"}').toString("base64url")}.`;
    expect(verifyToken(unsigned)).toBeNull();
    expect(
      verifyToken(jwt.sign({ sub: "1" }, getJwtSecret(), { expiresIn: -10 })),
    ).toBeNull();
    expect(verifyToken("token-user-1-123")).toBeNull();
    expect(verifyToken("")).toBeNull();
  });

  it("requires JWT_SECRET in production", () => {
    delete process.env.JWT_SECRET;
    process.env.NODE_ENV = "production";
    expect(() => getJwtSecret()).toThrow(/JWT_SECRET/);
    process.env.JWT_SECRET = "x".repeat(32);
    expect(getJwtSecret()).toBe("x".repeat(32));
  });
});

describe("requireAuth middleware", () => {
  const run = (authorization?: string) => {
    const req: any = { headers: authorization ? { authorization } : {} };
    const out: any = { status: 0, next: false };
    const res: any = {
      status(c: number) {
        out.status = c;
        return res;
      },
      json(b: any) {
        out.body = b;
      },
    };
    requireAuth(req, res, () => {
      out.next = true;
    });
    return { req, out };
  };

  it("passes a valid Bearer token and sets userId", () => {
    const { req, out } = run(`Bearer ${signToken(9)}`);
    expect(out.next).toBe(true);
    expect(req.userId).toBe(9);
  });

  it("returns 401 without header, with wrong scheme or invalid token", () => {
    for (const h of [
      undefined,
      "Basic abc",
      "Bearer nope",
      `Bearer ${signToken(9)}x`,
    ]) {
      const { out } = run(h);
      expect(out.next).toBe(false);
      expect(out.status).toBe(401);
    }
  });
});
