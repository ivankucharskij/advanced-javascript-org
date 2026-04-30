import { hash, verify } from "argon2";

export const hashPassword = (password: string) => hash(password);

export const verifyPassword = async (hash: string, password: string) => {
  try {
    return await verify(hash, password);
  } catch {
    return false;
  }
};

export const normalizeEmail = (email: string) => email.trim().toLowerCase();
