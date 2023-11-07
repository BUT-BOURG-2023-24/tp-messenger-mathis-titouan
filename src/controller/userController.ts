import { Request, Response } from 'express';
import User from '../database/Mongo/Models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';


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

export const login = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        let user = await getUserByName(username);

        if (!user) {
            user = new User({ name: username, password });
            await user.save();
        }
        else {
            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            if (!isPasswordCorrect) {
                return res.status(400).send('Invalid username or password');
            }
        }

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);

        res.send({ user, token, isNewUser: !req.body.id });
    } catch (error) {
        // If there's an error, return a 500 error
        res.status(500).send(error);
    }
};



