import { Request, Response } from 'express';
import ConversationModel, { IConversation } from '../database/Mongo/Models/ConversationModel'
import  MessageModel from '../database/Mongo/Models/MessageModel';
import {date} from "joi";
import {pickRandom} from "../pictures";

class ConversationController {

    public async createConversation(userIds: string[]): Promise<{ code?: number, error?: string, conversation?: IConversation }> {
        try {
            const newConversation = await ConversationModel.create({ title: pickRandom(), participants: userIds, lastUpdate: new Date, seen: {} });
            return { conversation: newConversation };
        } catch (error) {
            console.error(error);
            return { code: 500, error: 'Internal server error' };
        }
    }

    public async getConversationById(conversationId : string) : Promise<IConversation | { error: any } | null>{
        try {
            const conversation = await ConversationModel.findById(conversationId).populate('participants').populate('messages');
            return conversation;
        } catch (error) {
            console.error(error);
            return { error };
        }
    }

    public async deleteConversation(conversationId : string) : Promise<{ code?: number, error?: string, conversation?: IConversation }> {
        try {
            const conversation = await ConversationModel.findByIdAndDelete(conversationId);

            if (!conversation) {
                return { code: 404, error: 'Conversation not found' };
            }

            return { conversation };
        } catch (error) {
            console.error(error);
            return { code : 500, error: 'Internal server error' };
        }
    }

    public async getAllConversationsForUser(userId: string): Promise<IConversation[] | { error: any }> {
        try {
            const conversations = await ConversationModel.find({ participants: { $in: userId } }).populate('participants').populate('messages');
            return conversations;
        } catch (error) {
            console.error(error);
            return { error };
        }
    }

    public async getConverationWithParticipants(userIds : string[]) {
        try {
            const conversation = await ConversationModel.findOne({ userIds: { $all: userIds } });
            return conversation;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async addMessageToConversation(conversationId : string, messageId : string) {
        try {
            const conversation = await ConversationModel.findByIdAndUpdate(conversationId, { $push: { messages: messageId } }, { new: true });
            return conversation;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async setConversationSeenForUserAndMessage(
        conversationId: string,
        userId: string,
        messageId: string
    ): Promise<{ code?: number; error?: string; conversation?: IConversation }> {
        try {
            const conversation = await ConversationModel.findByIdAndUpdate(
                conversationId,
                { $set: { [`seen.${userId}`]: messageId } },
                { new: true }
            ).populate('participants').populate('messages');

            if (!conversation) {
                // Si la conversation n'est pas trouvée, renvoyer une réponse appropriée
                return { code: 404, error: 'Conversation not found' };
            }

            return { conversation };
        } catch (error) {
            return { code: 500, error: 'Internal server error' };
        }
    }

}

export default ConversationController;
export type { ConversationController };