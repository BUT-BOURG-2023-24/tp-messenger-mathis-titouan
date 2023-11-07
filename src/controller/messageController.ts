import { Request, Response } from 'express';
import ConversationModel from '../database/Mongo/Models/ConversationModel';
import  MessageModel from '../database/Mongo/Models/MessageModel';

export const createMessage = async (req: Request, res: Response) => {
    try {
        const { conversationId, sender, text } = req.body;
        const message = await MessageModel.create({ conversationId, sender, text });
        res.status(201).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const editMessage = async (req: Request, res: Response) => {
    try {
        const { messageId } = req.params;
        const { text } = req.body;
        const message = await MessageModel.findByIdAndUpdate(messageId, { text }, { new: true });
        res.status(200).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const deleteMessage = async (req: Request, res: Response) => {
    try {
        const { messageId } = req.params;
        await MessageModel.findByIdAndDelete(messageId);
        res.status(200).json({ message: 'Message deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const reactToMessage = async (req: Request, res: Response) => {
    try {
        const { messageId } = req.params;
        const { reaction } = req.body;
        const message = await MessageModel.findByIdAndUpdate(messageId, { $push: { reactions: reaction } }, { new: true });
        res.status(200).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

export const getMessageById = async (req: Request, res: Response) => {
    try {
        const { messageId } = req.params;
        const message = await MessageModel.findById(messageId);
        res.status(200).json({ message });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server Error' });
    }
};

