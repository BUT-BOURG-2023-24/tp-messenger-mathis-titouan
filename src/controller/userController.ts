import { Request, Response } from 'express';
import User from '../database/Mongo/Models/UserModel';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import config from "../config";

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

    
}


export default UserController;
export type { UserController };


