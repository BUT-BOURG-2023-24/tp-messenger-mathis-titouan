
const express = require('express');
const router = express.Router();
import joiValidator from "../middleware/joiValidator";
import { Request, Response } from 'express';

router.post('/login', joiValidator, async (req: Request, res: Response) => {
    try {
        // Make sure req.body is not null
        if (!req.body) {
            return res.status(400).json({ error: 'Request body is missing.' });
        }

        // Assert the type of req.body
        const { username, password } = req.body;

        const result = await req.app.locals.database.userController.login(username, password);

        if (result.error) {
            return res.status(result.code || 500).json({ error: result.error });
        } else {
            return res.status(200).json({ user: result.user, token: result.token });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// À refaire
router.get('/online', joiValidator,  async (req: Request, res: Response) => {
    try {
        const result = await req.app.locals.database.userController.getAllUsers();

        if (result.error) {
            return res.status(result.code || 500).json({ error: result.error });
        } else {
            return res.status(200).json({ users: result.users });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/all', joiValidator, async (req: Request, res: Response) => {
    try {
        const result = await req.app.locals.database.userController.getAllUsers();

        if (result.error) {
            return res.status(result.code || 500).json({ error: result.error });
        } else {
            return res.status(200).json({ users: result.users });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports = router;