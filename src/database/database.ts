import config from "../config";
import mongoose from "mongoose";
import type { UserController } from "../controller/userController";
import type { MessageController } from "../controller/messageController";
import type { ConversationController } from "../controller/conversationController";


class Database 
{
	fromTest: boolean;
	userController : UserController;
	messageController : MessageController;
	conversationController : ConversationController;

	constructor(fromTest: boolean, userController: UserController, messageController: MessageController, conversationController: ConversationController) 
	{
		this.fromTest = fromTest;
		this.userController = userController;
		this.messageController = messageController;
		this.conversationController = conversationController;

	}
	
	async connect()
	{
		console.log(`Connecting to database at ${this.fromTest ? config.DB_ADDRESS_TEST : config.DB_ADDRESS}`);
		return await mongoose.connect(this.fromTest ? config.DB_ADDRESS_TEST : config.DB_ADDRESS);
	}
}

export default Database;
export type { Database };
