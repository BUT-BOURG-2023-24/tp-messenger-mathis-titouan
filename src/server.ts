import { makeApp } from "./app";
import  Database from "./database/database";
import config from "./config";
import UserController from "./controller/userController";

let DBInstance = new Database(
	false,
	new UserController()
);

const { app, server } = makeApp(DBInstance);


server.listen(config.PORT, () => {
	console.log(`Server is listening on http://localhost:${config.PORT}`);
});