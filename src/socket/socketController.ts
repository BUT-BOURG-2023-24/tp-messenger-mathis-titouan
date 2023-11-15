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
		
			try {
				const result = await this.database.conversationController.getAllConversationsForUser(userId as string);
		
				const conversations = result as IConversation[];
				conversations.forEach((conversation) => {
					socket.join(conversation.id.toString());
				});
			} catch (error) {
				console.error(error);
			}

			socket.on("@onConnected", (data) => {
				const { userId } = data;
		
				this.io.emit("@onConnected", { userId });
			});

			socket.on("@onDisconnected", (data) => {
				const { userId } = data;
		
				this.io.emit("@onDisconnected", { userId });
			});

			socket.on("@newConversation", (data) => {
				const { conversation } = data;
		
				this.io.to(conversation._id.toString()).emit("@newConversation", { conversation });
			});
		
			// Listen for the conversationDeleted event
			socket.on("@conversationDeleted", (data) => {
				const { conversation } = data;
		
				this.io.to(conversation._id.toString()).emit("@conversationDeleted", { conversation });
			});
		
			// Listen for the conversationSeen event
			socket.on("@conversationSeen", (data) => {
				const { conversation } = data;
		
				this.io.to(conversation._id.toString()).emit("@conversationSeen", { conversation });
			});
		
			// Listen for the newMessage, messageEdited, reactionAdded, and messageDeleted events
			socket.on("@newMessage", (data) => {
				const { message } = data;
		
				this.io.to(message.conversationId.toString()).emit("@newMessage", { message });
			});
		
			// Listen for the messageEdited event
			socket.on("@messageEdited", (data) => {
				const { message } = data;
		
				this.io.to(message.conversationId.toString()).emit("@messageEdited", { message });
			});
		
			// Listen for the reactionAdded event
			socket.on("@reactionAdded", (data) => {
				const { message } = data;
		
				this.io.to(message.conversationId.toString()).emit("@reactionAdded", { message });
			});
		
			// Listen for the messageDeleted event
			socket.on("@messageDeleted", (data) => {
				const { message } = data;
		
				this.io.to(message.conversationId.toString()).emit("@messageDeleted", { message });
			});
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

