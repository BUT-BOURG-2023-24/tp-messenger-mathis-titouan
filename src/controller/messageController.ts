import MessageModel, {IMessage} from '../database/Mongo/Models/MessageModel';

class MessageController {

    public async createMessage(conversationId: string, senderId: string, message: string): Promise<{ code?: number, error?: string, message?: IMessage }> {
        try {
            const newMessage = await MessageModel.create({ conversationId, senderId, message });
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
            const message = await MessageModel.findByIdAndDelete(messageId) as IMessage | null;

            if (!message) {
                return { code: 404, error: 'Message not found' };
            }

            return { message };
        } catch (error) {
            console.error(error);
            return { code: 500, error: 'Internal server error' };
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

    public async editMessageById(messageId: string, newMessageContent: string): Promise<{ code?: number, error?: string, message?: IMessage }> {
        try {
            const message = await MessageModel.findByIdAndUpdate(messageId, { newMessageContent }, { new: true }) as IMessage | null;

            if (message === null) {
                return { code: 404, error: 'Message not found' };
            }

            return { message };
        } catch (error) {
            console.error(error);
            return { code: 500, error: 'Internal server error' };
        }
    }

    public async reactToMessage(messageId : string, userId : string, reaction : string) {
        
    }
}

export default MessageController;
export type { MessageController };
