import config from "../config";
import mongoose from "mongoose";

class Database 
{
	fromTest: boolean;

	constructor(fromTest: boolean) 
	{
		this.fromTest = fromTest;
	}
	
	async connect()
	{
		console.log(`Connecting to database at ${this.fromTest ? config.DB_ADDRESS_TEST : config.DB_ADDRESS}`);
		return await mongoose.connect(this.fromTest ? config.DB_ADDRESS_TEST : config.DB_ADDRESS);
	}
}

export default Database;
export type { Database };
