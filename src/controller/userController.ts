import { Request, Response } from 'express';
import User from '../database/Mongo/Models/UserModel';

// Create a new user
export const createUser = async (req: Request, res: Response) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
};

// Get a user by name
export const getUserByName = async (req: Request, res: Response) => {
    try {
        const user = await User.findOne({ name: req.params.name });
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get a user by id
export const getUserById = async (req: Request, res: Response) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) {
            return res.status(404).send();
        }
        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
};

// Get users by ids
export const getUsersByIds = async (req: Request, res: Response) => {
    try {
        const ids = req.body.ids;
        const users = await User.find({ _id: { $in: ids } });
        res.send(users);
    } catch (error) {
        res.status(500).send(error);
    }
};


