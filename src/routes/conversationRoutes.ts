import joiValidator from "../middleware/joiValidator";
import {Request, Response} from 'express';
import {IConversation} from "../database/Mongo/Models/ConversationModel";
import {IMessage} from "../database/Mongo/Models/MessageModel";

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
            req.app.locals.socketController.emitNewConversation(result.conversation as IConversation, concernedUsersIds);
            return res.status(200).json(result);
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

router.get('/', joiValidator, auth.checkAuth, async (req: Request, res: Response) => {
    try {
        const result = await req.app.locals.database.conversationController.getAllConversationsForUser(
            res.locals.userId as string
        );

        if ('error' in result) {
            return res.status(500).json({ error: result.error });
        } else {
            return res.status(200).json({ conversations: result });
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
            req.app.locals.socketController.emitDeleteConversation(result.conversation as IConversation);
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

        const result = await req.app.locals.database.messageController.createMessage(id, res.locals.userId as string, messageContent, messageReplyId as string);
        await req.app.locals.database.conversationController.addMessageToConversation(id, result.message?.id as string);
        await req.app.locals.database.conversationController.setConversationSeenForUserAndMessage(id, res.locals.userId as string, result.message?.id as string);
        const conversation = await req.app.locals.database.conversationController.getConversationById(id);

        if (result.error) {
            return res.status(result.code || 500).json({ error: result.error });
        } else {
            if(conversation != null) {
                req.app.locals.socketController.emitNewMessage(conversation as IConversation, result.message as IMessage);
            }
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
            req.app.locals.socketController.emitSeenConversation(result.conversation as IConversation);
            return res.status(200).json({ conversation: result });
        }
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
});

// router.get('/see/:id', joiValidator, auth.checkAuth, conversationController.getConversationById);

module.exports = router;