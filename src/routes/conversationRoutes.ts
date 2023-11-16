import joiValidator from "../middleware/joiValidator";
import {Request, Response} from 'express';

const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');

router.post('/', joiValidator, auth.checkAuth, async (req : Request, res : Response) => {
    try {
        const { concernedUsersIds } = req.body;
        concernedUsersIds.push(res.locals.userId);
        const result = await req.app.locals.database.conversationController.createConversation(concernedUsersIds);

        if (result.error) {
            return res.status(result.code || 500).json({ error: result.error });
        } else {
            return res.status(200).json(result);
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', joiValidator, auth.checkAuth, async (req : Request, res : Response) => {
   try {

       console.log('user id : ' + res.locals.userId as string);

         const result = await req.app.locals.database.conversationController.getAllConversationsForUser(res.locals.userId as string);

       if (result.error) {
              return res.status(result.code || 500).json({ error: result.error });
         } else {
              return res.status(200).json(result);
         }
   } catch (error) {
         return res.status(500).json({ error: 'Internal server error' });
   }
});

router.delete('/:id', joiValidator, auth.checkAuth, async (req : Request, res : Response) => {
   try {
        const { id } = req.params;

        const result = await req.app.locals.database.conversationController.deleteConversation(id);

        if (result.error) {
            return res.status(result.code || 500).json({ error: result.error });
        } else {
            return res.status(200).json({ conversation: result });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
   }
});

router.post('/:id', joiValidator, auth.checkAuth, async (req : Request, res : Response) => {
    try {
        const { id } = req.params;
        const { messageContent, messageReplyId } = req.body;


        console.log(res.locals.userId);
        const result = await req.app.locals.database.messageController.createMessage(id, res.locals.userId as string, messageContent, messageReplyId as string);
        await req.app.locals.database.conversationController.addMessageToConversation(id, result.message?.id as string);
        await req.app.locals.database.conversationController.setConversationSeenForUserAndMessage(id, res.locals.userId as string, result.message?.id as string);

        if (result.error) {
            return res.status(result.code || 500).json({ error: result.error });
        } else {
            return res.status(200).json({ message: result });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.post('/see/:id', joiValidator, auth.checkAuth, async (req : Request, res : Response) => {
    try {
        const { id } = req.params;
        const { messageId } = req.body;

        const result = await req.app.locals.database.conversationController.setConversationSeenForUserAndMessage(id, res.locals.userId as string, messageId);

        if (result.error) {
            return res.status(result.code || 500).json({ error: result.error });
        } else {
            return res.status(200).json({ conversation: result });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// router.get('/see/:id', joiValidator, auth.checkAuth, conversationController.getConversationById);

module.exports = router;