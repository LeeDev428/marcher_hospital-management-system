import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { PrismaClient } from '../../../prisma/generated/instance/index.js';

const prisma = new PrismaClient();

// Generate JWT tokens
export const generateTokens = (userId, email, role, firstName, lastName) => {
  const accessToken = jwt.sign(
    { userId, email, role, firstName, lastName },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: userId, userId, email, role, firstName, lastName },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

// Hash password
export const hashPassword = async (password) => {
  const saltRounds = process.env.NODE_ENV === 'production' ? 12 : 8; // Faster hashing in development
  return await bcrypt.hash(password, saltRounds);
};

// Compare password
export const comparePassword = async (password, hashedPassword) => {
  return await bcrypt.compare(password, hashedPassword);
};

// Save refresh token to database
export const saveRefreshToken = async (userId, refreshToken) => {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7); // 7 days from now

  await prisma.refreshToken.create({
    data: {
      token: refreshToken,
      userId,
      expiresAt,
    },
  });
};

// Verify refresh token
export const verifyRefreshToken = async (token) => {
  try {
    const decoded = jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);
    
    const refreshToken = await prisma.refreshToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!refreshToken || refreshToken.isRevoked || refreshToken.expiresAt < new Date()) {
      return null;
    }

    return refreshToken.user;
  } catch (error) {
    return null;
  }
};

// Revoke refresh token
export const revokeRefreshToken = async (token) => {
  await prisma.refreshToken.updateMany({
    where: { token },
    data: { isRevoked: true },
  });
};

// Generate unique patient number
export const generatePatientNumber = async () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  return `P${year}${timestamp}`;
};

// Generate unique staff number
export const generateStaffNumber = async () => {
  const year = new Date().getFullYear().toString().slice(-2);
  const timestamp = Date.now().toString().slice(-6); // Last 6 digits of timestamp
  return `S${year}${timestamp}`;
};

export default {
  generateTokens,
  hashPassword,
  comparePassword,
  saveRefreshToken,
  verifyRefreshToken,
  revokeRefreshToken,
  generatePatientNumber,
  generateStaffNumber,
};