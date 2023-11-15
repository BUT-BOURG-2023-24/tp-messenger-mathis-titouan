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

    public async deleteMessageById(messageId : string) {
        try {
            const message = await MessageModel.findByIdAndDelete(messageId);
            return message;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async deleteMessagesByIds(messageIds : string[]) {
        try {
            const messages = await MessageModel.deleteMany({ _id: { $in: messageIds } });
            return messages;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async deleteAllMessages() {
        try {
            const messages = await MessageModel.deleteMany();
            return messages;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async editMessageById(messageId : string, message : string) {
        try {
            const updatedMessage = await MessageModel.findByIdAndUpdate(messageId, { message }, { new: true });
            return updatedMessage;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async reactToMessage(messageId : string, userId : string, reaction : string) {
        
    }
}

export default MessageController;
export type { MessageController };
