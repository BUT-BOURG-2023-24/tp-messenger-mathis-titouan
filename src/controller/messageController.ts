import MessageModel, {IMessage} from '../database/Mongo/Models/MessageModel';
import ConversationModel from "../database/Mongo/Models/ConversationModel";

class MessageController {

    public async createMessage(
        conversationId: string,
        senderId: string,
        message: string,
        replyTo?: string
    ): Promise<{ code?: number; error?: string; message?: IMessage }> {
        try {
            const newMessage = await MessageModel.create({
                conversationId: conversationId,
                from: senderId,
                content: message,
                postedAt: new Date(), // Utilisez new Date() pour obtenir l'instant actuel
                replyTo: replyTo,
                edited: false,
                deleted: false,
                reactions: {} // Ajout d'une valeur par défaut pour reactions
            });

            return { message: newMessage };
        } catch (error) {
            console.error(error);
            return { code: 500, error: 'Internal server error' };
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

    public async deleteMessageById(messageId: string): Promise<{ code?: number, error?: string, message?: IMessage }> {
        try {
            const message = await MessageModel.findByIdAndUpdate(
                messageId,
                { deleted: true },
                { new: true }
            ) as IMessage | null;

            if (!message) {
                return { code: 404, error: 'Message not found' };
            }

            return { message };
        } catch (error) {
            console.error(error);
            return { code: 500, error: 'Internal server error' };
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

    public async editMessageById(messageId: string, newMessageContent: string): Promise<{ code?: number, error?: string, message?: IMessage }> {
        try {
            const message = await MessageModel.findByIdAndUpdate(messageId, { content : newMessageContent, edited: true }, { new: true }) as IMessage | null;

            if (message === null) {
                return { code: 404, error: 'Message not found' };
            }

            return { message };
        } catch (error) {
            console.error(error);
            return { code: 500, error: 'Internal server error' };
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
            return { code: 500, error: 'Internal server error' };
        }
    }
}

export default MessageController;
export type { MessageController };
