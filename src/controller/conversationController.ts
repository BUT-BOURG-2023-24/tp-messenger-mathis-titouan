import { Request, Response } from 'express';
import ConversationModel from '../database/Mongo/Models/ConversationModel';
import  MessageModel from '../database/Mongo/Models/MessageModel';

export const conversationController = {
    async getConversationWithParticipants(req: Request, res: Response) {
        const { participants } = req.body;
        try {
            const conversation = await ConversationModel.findOne({
                participants: { $all: participants },
            });
            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }
            return res.status(200).json(conversation);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getAllConversationsForUser(req: Request, res: Response) {
        const { userId } = req.params;
        try {
            const conversations = await ConversationModel.find({
                participants: userId,
            });
            return res.status(200).json(conversations);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    async getConversationById(req: Request, res: Response) {
        const { conversationId } = req.params;
        try {
            const conversation = await ConversationModel.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }
            return res.status(200).json(conversation);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    async createConversation(req: Request, res: Response) {
        const { participants } = req.body;
        try {
            const conversation = await ConversationModel.create({ participants });
            return res.status(201).json(conversation);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    async addMessageToConversation(req: Request, res: Response) {
        const { conversationId } = req.params;
        const { sender, text } = req.body;
        try {
            const message = await MessageModel.create({ sender, text });
            const conversation = await ConversationModel.findByIdAndUpdate(
                conversationId,
                { $push: { messages: message } },
                { new: true }
            );
            return res.status(200).json(conversation);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    async setConversationSeenForUserAndMessage(req: Request, res: Response) {
        const { conversationId, userId, messageId } = req.params;
        try {
            const conversation = await ConversationModel.findById(conversationId);
            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }
            const message = conversation.messages.id(messageId);
            if (!message) {
                return res.status(404).json({ message: 'Message not found' });
            }
            message.seenBy.push(userId);
            await conversation.save();
            return res.status(200).json(conversation);
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },

    async deleteConversation(req: Request, res: Response) {
        const { conversationId } = req.params;
        try {
            const conversation = await ConversationModel.findByIdAndDelete(
                conversationId
            );
            if (!conversation) {
                return res.status(404).json({ message: 'Conversation not found' });
            }
            return res.status(200).json({ message: 'Conversation deleted' });
        } catch (error) {
            console.error(error);
            return res.status(500).json({ message: 'Internal server error' });
        }
    },
};
