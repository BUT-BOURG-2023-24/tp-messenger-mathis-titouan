import { Request, Response } from 'express';
import ConversationModel, { IConversation } from '../database/Mongo/Models/ConversationModel'
import  MessageModel from '../database/Mongo/Models/MessageModel';

class ConversationController {

    public async createConversation (name : string, userIds : string[]) {
        try {
            const newConversation = await ConversationModel.create({ name, userIds });
            return newConversation;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async getConversationById(conversationId : string) {
        try {
            const conversation = await ConversationModel.findById(conversationId);
            return conversation;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async deleteConversation(conversationId : string) {
        try {
            const conversation = await ConversationModel.findByIdAndDelete(conversationId);
            return conversation;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async getAllConversationsForUser(userId: string): Promise<IConversation[] | { error: any }> {
        try {
            const conversations = await ConversationModel.find({ participants: { $in: userId } });
            return conversations;
        } catch (error) {
            console.error(error);
            return { error };
        }
    }

    public async getConversationWithParticipants(userIds : string[]) {
        try {
            const conversation = await ConversationModel.findOne({ userIds: { $all: userIds } });
            return conversation;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    // pas de remove from conversation, comment on gere ça deja ??
    public async addMessageToConversation(conversationId : string, messageId : string) {
        try {
            const conversation = await ConversationModel.findByIdAndUpdate(conversationId, { $push: { messages: messageId } }, { new: true });
            return conversation;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public setConversationSeenForUserAndMessage(conversationId : string, userId : string, messageId : string) {
        
    }

}

export default ConversationController;
export type { ConversationController };