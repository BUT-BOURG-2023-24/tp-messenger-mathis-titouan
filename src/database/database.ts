import config from "../config";
import mongoose from "mongoose";
import type { UserController } from "../controller/userController";

class Database 
{
	fromTest: boolean;
	userController : UserController;

	constructor(fromTest: boolean, userController: UserController) 
	{
		this.fromTest = fromTest;
		this.userController = userController;

	}
	
	async connect()
	{
		console.log(`Connecting to database at ${this.fromTest ? config.DB_ADDRESS_TEST : config.DB_ADDRESS}`);
		return await mongoose.connect(this.fromTest ? config.DB_ADDRESS_TEST : config.DB_ADDRESS);
	}
}

export default Database;
export type { Database };
