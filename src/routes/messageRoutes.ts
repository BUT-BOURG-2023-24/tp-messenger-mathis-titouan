import {IMessage} from "../database/Mongo/Models/MessageModel";

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
            req.app.locals.socketController.emitEditMessage(result.message as IMessage);
            return res.status(200).json({ message: result });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/:id', joiValidator, auth.checkAuth, async (req : Request, res : Response) => {
    try {
        const { id } = req.params;
        const { reaction } = req.body;

        const result = await req.app.locals.database.messageController.reactToMessage(id, res.locals.userId as string, reaction);

        if ('error' in result) {
            return res.status(500).json({ error: result.error });
        } else {
            res.locals.socketController.emitReaction(result as IMessage);
            return res.status(200).json({ message: result });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.delete('/:id', joiValidator, auth.checkAuth, async (req : Request, res : Response) => {
   try {
         const { id } = req.params;

         const result = await req.app.locals.database.messageController.deleteMessageById(id);

         if (result.error) {
              return res.status(result.code || 500).json({ error: result.error });
         } else {
                req.app.locals.socketController.emitDeleteMessage(result.message as IMessage);
              return res.status(200).json({ message: result });
         }
   } catch (error) {
         return res.status(500).json({ error: 'Internal server error' });
   }
});

module.exports = router;