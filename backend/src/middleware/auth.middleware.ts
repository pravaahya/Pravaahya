import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: any;
}

export const protect = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    let token;
    
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    
    if (!token) {
      res.status(401).json({ error: "Unauthorized: Token missing" });
      return;
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "super_secret_pravaahya_key_2026");
    req.user = decoded;
    
    next();
  } catch (error) {
    res.status(401).json({ error: "Unauthorized: Invalid or expired token" });
  }
};

export const adminOnly = async (req: AuthRequest, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user || req.user.role !== 'admin') {
    res.status(403).json({ error: "Forbidden: Admin access strictly required" });
    return;
  }
  
  next();
};
