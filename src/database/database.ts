import config from "../config";
import mongoose from "mongoose";
import type { UserController } from "../controller/userController";
import type { MessageController } from "../controller/messageController";


class Database 
{
	fromTest: boolean;
	userController : UserController;
	messageController : MessageController

	constructor(fromTest: boolean, userController: UserController, messageController: MessageController) 
	{
		this.fromTest = fromTest;
		this.userController = userController;
		this.messageController = messageController;

	}
	
	async connect()
	{
		console.log(`Connecting to database at ${this.fromTest ? config.DB_ADDRESS_TEST : config.DB_ADDRESS}`);
		return await mongoose.connect(this.fromTest ? config.DB_ADDRESS_TEST : config.DB_ADDRESS);
	}
}

export default Database;
export type { Database };
