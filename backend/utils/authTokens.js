import jwt from 'jsonwebtoken';

export const COOKIE_NAME = process.env.COOKIE_NAME || 'petsafely_token';

export const signToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

export const getCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.COOKIE_SECURE === 'true',
  path: '/',
});

export const setAuthCookie = (res, token) => {
  res.cookie(COOKIE_NAME, token, getCookieOptions());
};

export const clearAuthCookie = (res) => {
  res.clearCookie(COOKIE_NAME, { path: '/' });
};
