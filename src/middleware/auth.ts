import { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';
import config from "../config";

function checkAuth(req: Request, res: Response, next: NextFunction) {
    let token = req.headers.authorization as string;

    if (!token) {
        return res.status(401).json({ error: 'Need a token!' });
    }

    /*
    if(!token.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Invalid token!' });
    }

    token = token.split(' ')[1];
    */

    try {
        const decodedToken = jwt.verify(token, config.JWT_SECRET) as { userId: string };
        const userId = decodedToken.userId;

        /*
        if (req.body.userId && req.body.userId !== userId) {
            return res.status(401).json({ error: 'Invalid token!' });
        }
        */

        // Stockez l'ID de l'utilisateur dans la réponse
        res.locals.userId = userId;

        next();
    } catch (error) {
        return res.status(401).json({ error: 'Invalid token!' });
    }
}

export { checkAuth };