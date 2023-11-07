import * as http from "http";
import express from "express";
import { Server } from "socket.io";
import { Database } from "./database/database";
import { SocketController } from "./socket/socketController";

/**
 * Import all routes here.
 */
const userRoutes = require('./routes/userRoutes');
const conversationRoutes = require('./routes/conversationRoutes');
const messageRoutes = require('./routes/messageRoutes');

const app = express();
const cors = require('cors');

function makeApp(database: Database) 
{

	app.locals.database = database;

	app.locals.database.connect().then
	(
		() => console.log("Connected to database."),
		(error) => console.log("Error connecting to database:", error)
	);

	const server = http.createServer(app);
	app.use(express.json());

	// Configuration de CORS pour autoriser les requêtes depuis un domaine spécifique
	app.use(cors({
		origin: '*', // Remplacez par le domaine que vous souhaitez autoriser
		methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
	}));

	// Connects the routes to the app.
	app.use('/users', userRoutes);
	app.use('/conversations', conversationRoutes);
	app.use('/messages', messageRoutes);

	const io = new Server(server, { cors: { origin: "*" } });
	let socketController = new SocketController(io, database);

	app.locals.socketController = socketController;

	return { app, server };
}

export { makeApp };
