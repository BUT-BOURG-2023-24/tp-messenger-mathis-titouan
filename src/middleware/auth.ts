import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import config from "../config";

function checkAuth(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization as string;

    console.log('Token:', token);

    if (!token) {
        return res.status(401).json({ error: 'Need a token!' });
    }

    try {
        const decodedToken = jwt.verify(token, config.JWT_SECRET) as { id: string, iat: number };
        const userId = decodedToken.id;

        console.log('Decoded userId:', userId);

        res.locals.userId = userId;

        next();
    } catch (error) {
        console.error('Token verification error:', error);
        return res.status(401).json({ error: 'Invalid token!' });
    }
}

export { checkAuth };