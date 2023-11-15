import type { Database } from "../database/database";
import ConversationModel, { IConversation } from '../database/Mongo/Models/ConversationModel'
import { Server } from "socket.io";

export class SocketController
{
	/*
		Pour savoir si un utilisateur est connecté depuis la route /online,
		Nous devons stocker une correspondance socketId <=> userId.
	*/

	constructor(private io:Server, private database:Database)
	{
		this.connect();
		this.listenRoomChanged();
		this.database = database;
	}
	

	connect()
	{
		this.io.on("connection", async (socket) => {
			const userId = socket.handshake.headers.userId;
			if (!userId) {
				socket.disconnect();
				return;
			}
		
			// ETAPE 1
			try {
				const result = await this.database.conversationController.getAllConversationsForUser(userId as string);
		
				const conversations = result as IConversation[];
				conversations.forEach((conversation) => {
					socket.join(conversation.id.toString());
				});
				
			} catch (error) {
				console.error(error);
			}
		});
	}

	// Cette fonction vous sert juste de debug.
	// Elle permet de log l'informations pour chaque changement d'une room. 
	listenRoomChanged()
	{
		this.io.of("/").adapter.on("create-room", (room) => {
			console.log(`room ${room} was created`);
		});

		this.io.of("/").adapter.on("join-room", (room, id) => {
			console.log(`socket ${id} has joined room ${room}`);
		});

		this.io.of("/").adapter.on("leave-room", (room, id) => {
			console.log(`socket ${id} has leave room ${room}`);
		});

		this.io.of("/").adapter.on("delete-room", (room) => {
			console.log(`room ${room} was deleted`);
		});
	}
}

