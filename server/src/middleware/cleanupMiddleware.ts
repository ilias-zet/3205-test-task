import pool from '../db';

let lastCleanup = 0;
const CLEANUP_INTERVAL = 10 * 60 * 1000;

export const cleanupMiddleware = async (req, res, next) => {
  const now = Date.now();
  
  if (now - lastCleanup > CLEANUP_INTERVAL) {
    try {
      await pool.query('DELETE FROM links WHERE expires_at < NOW()');
      console.log('Expired links removed');
      lastCleanup = now;
    } catch (err) {
      console.error('Error removing expired links:', err);
    }
  }

  next();
};
