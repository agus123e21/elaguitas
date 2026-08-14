import bcrypt from 'bcryptjs';
import crypto from 'node:crypto';
import pool from '../../config/db.js';
import { ApiError } from '../../utils/ApiError.js';
import env from '../../config/env.js';

const SALT_ROUNDS = 10;
const RESET_TOKEN_TTL_MS = 60 * 60 * 1000;

export function hashToken(token) {
  return crypto.createHash('sha256').update(token).digest('hex');
}

export function generateResetToken() {
  return crypto.randomBytes(32).toString('hex');
}

export async function findUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT u.id, u.email, u.password_hash, u.name, u.phone, u.active,
            r.name AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
      WHERE u.email = $1`,
    [email]
  );
  return rows[0] || null;
}

export async function findUserById(id) {
  const { rows } = await pool.query(
    `SELECT u.id, u.email, u.name, u.phone, u.active, r.name AS role
       FROM users u
       JOIN roles r ON r.id = u.role_id
      WHERE u.id = $1`,
    [id]
  );
  return rows[0] || null;
}

export async function register({ name, email, password, phone }) {
  const existing = await findUserByEmail(email);
  if (existing) {
    throw new ApiError(409, 'Ya existe una cuenta con ese email');
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const role = await client.query('SELECT id FROM roles WHERE name = $1', ['CLIENT']);
    const user = await client.query(
      `INSERT INTO users (email, password_hash, name, phone, role_id)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, email, name, phone`,
      [email, passwordHash, name, phone, role.rows[0].id]
    );

    await client.query('INSERT INTO customers (user_id) VALUES ($1)', [user.rows[0].id]);

    await client.query('COMMIT');
    return findUserById(user.rows[0].id);
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }
}

export async function login(email, password) {
  const user = await findUserByEmail(email);
  if (!user) {
    throw new ApiError(401, 'Email o contraseña incorrectos');
  }

  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    throw new ApiError(401, 'Email o contraseña incorrectos');
  }

  if (!user.active) {
    throw new ApiError(403, 'Tu cuenta está desactivada');
  }

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    phone: user.phone,
    role: user.role,
  };
}

export async function requestPasswordReset(email) {
  const user = await findUserByEmail(email);
  if (!user) {
    return { resetUrl: null };
  }

  const token = generateResetToken();
  const expiresAt = new Date(Date.now() + RESET_TOKEN_TTL_MS);

  await pool.query(
    `INSERT INTO password_reset_tokens (user_id, token_hash, expires_at)
     VALUES ($1, $2, $3)`,
    [user.id, hashToken(token), expiresAt]
  );

  return { resetUrl: `${env.frontendUrl}/recuperar-password?token=${token}` };
}

export async function resetPassword(token, newPassword) {
  const tokenHash = hashToken(token);
  const { rows } = await pool.query(
    `SELECT id, user_id, expires_at, used
       FROM password_reset_tokens
      WHERE token_hash = $1`,
    [tokenHash]
  );

  if (rows.length === 0) {
    throw new ApiError(400, 'Token inválido');
  }

  const record = rows[0];
  if (record.used) {
    throw new ApiError(400, 'El token ya fue utilizado');
  }
  if (new Date(record.expires_at) < new Date()) {
    throw new ApiError(400, 'El token expiró');
  }

  const passwordHash = await bcrypt.hash(newPassword, SALT_ROUNDS);
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    await client.query('UPDATE users SET password_hash = $1 WHERE id = $2', [
      passwordHash,
      record.user_id,
    ]);
    await client.query('UPDATE password_reset_tokens SET used = TRUE WHERE id = $1', [
      record.id,
    ]);
    await client.query('COMMIT');
  } catch (err) {
    await client.query('ROLLBACK');
    throw err;
  } finally {
    client.release();
  }

  return findUserById(record.user_id);
}

export function signUser(user) {
  return {
    sub: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  };
}
