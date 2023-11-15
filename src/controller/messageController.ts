import { Request, Response } from 'express';
import ConversationModel from '../database/Mongo/Models/ConversationModel';
import  MessageModel from '../database/Mongo/Models/MessageModel';

class MessageController {

    public async createMessage (conversationId : string, senderId : string, message : string) {
        try {
            const newMessage = await MessageModel.create({ conversationId, senderId, message });
            return newMessage;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async getMessagesByConversationId(conversationId : string) {
        try {
            const messages = await MessageModel.find({ conversationId });
            return messages;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    // ne delete pas le message mais le marque comme deleted
    public async deleteMessageById(messageId: string) {
        try {
            const updatedMessage = await MessageModel.findByIdAndUpdate(
                messageId,
                { deleted: true },
                { new: true }
            );
            return updatedMessage;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    // delete vraiment tous les messages
    public async deleteAllMessages() {
        try {
            const messages = await MessageModel.deleteMany();
            return messages;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async editMessageById(messageId: string, message: string) {
        try {
            const updatedMessage = await MessageModel.findByIdAndUpdate(
                messageId,
                { content: message, edited: true },
                { new: true }
            );
            return updatedMessage;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async reactToMessage(messageId: string, userId: string, reaction: string) {
        try {
            const message = await MessageModel.findById(messageId);
            if (!message) {
                throw new Error(`Message with ID ${messageId} not found`);
            }

            const reactions = message.reactions || {};
            reactions[userId] = reaction as "HAPPY" | "SAD" | "THUMBSUP" | "THUMBSDOWN" | "LOVE";

            const updatedMessage = await MessageModel.findByIdAndUpdate(
                messageId,
                { reactions },
                { new: true }
            );

            return updatedMessage;
        } catch (error) {
            console.error(error);
            return error;
        }
    }
}

export default MessageController;
export type { MessageController };
