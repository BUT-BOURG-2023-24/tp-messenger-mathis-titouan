import { Request, Response } from 'express';
import User, {IUser} from '../database/Mongo/Models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from "../config";
import {pickRandom} from "../pictures";
import UserModel from "../database/Mongo/Models/UserModel";

class UserController {

    public async createUser (username : string, password : string) {
        try {
            const user = await User.create({ username, password });
            return { user };
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async getAllUsers(): Promise<{ code?: number, error?: string, users?: IUser[] }> {
        try {
            const users = await User.find();
            return { users };
        } catch (error) {
            console.error(error);
            return { code: 500, error: 'Internal server error' };
        }
    }

    public async getUserByUsername(username : string) {
        try {
            const user = await User.findOne({ username });
            return user;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async getUserById(userId : string) {
        try {
            const user = await User.findById(userId);
            return user;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async getUsersByIds(userIds : string[]) {
        try {
            const users = await User.find({ _id: { $in: userIds } });
            return users;
        } catch (error) {
            console.error(error);
            return error;
        }
    }

    public async login(username : string, password : string) : Promise<{ code?: number, error?: string, user?: any, token?: string }> {
        try {
            let user = await User.findOne({ username });
            if (!user) {
                let hashedPassword = await bcrypt.hash(password, 10);
                user = new User({
                    username: username,
                    password: hashedPassword,
                    profilePicId: pickRandom()
                });
                await user.save();
            } else {
                const isPasswordCorrect = await bcrypt.compare(password, user.password.toString());
                if (!isPasswordCorrect) {
                    return { code: 400, error: 'Wrong password' };
                }
            }

            const token = jwt.sign({ id: user._id }, config.JWT_SECRET);

            return { user, token };
        } catch (error) {
            console.error(error);
            return { code: 500, error: 'Internal server error' };
        }
    }
}

export default UserController;
export type { UserController };


