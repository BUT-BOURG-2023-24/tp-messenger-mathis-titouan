const auth = require('../middleware/auth');
const express = require('express');
const router = express.Router();
import joiValidator from "../middleware/joiValidator";
import { Request, Response } from 'express';

router.put('/:id', joiValidator, auth.checkAuth, async (req : Request, res : Response) => {
    try {
        const { id } = req.params;
        const { newMessageContent } = req.body;

        const result = await req.app.locals.database.messageController.editMessageById(id, newMessageContent);

        if (result.error) {
            return res.status(result.code || 500).json({ error: result.error });
        } else {
            return res.status(200).json({ message: result });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

/*
router.post('/:id', joiValidator, auth.checkAuth, async (req : Request, res : Response) => {
    try {
        const { id } = req.params;
        const { reaction } = req.body;

        const result = await req.app.locals.database.messageController.reactToMessage(id, reaction);

        if (result.error) {
            return res.status(result.code || 500).json({ error: result.error });
        } else {
            return res.status(200).json({ message: result });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});
*/

router.delete('/:id', joiValidator, auth.checkAuth, async (req : Request, res : Response) => {
   try {
         const { id } = req.params;

         const result = await req.app.locals.database.messageController.deleteMessageById(id);

         if (result.error) {
              return res.status(result.code || 500).json({ error: result.error });
         } else {
              return res.status(200).json({ message: result });
         }
   } catch (error) {
         return res.status(500).json({ error: 'Internal server error' });
   }
});

module.exports = router;