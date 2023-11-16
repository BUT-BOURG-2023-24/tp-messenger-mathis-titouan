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

				socket.broadcast.emit("onConnected", { userId });

			} catch (error) {
				console.error(error);
			}


			socket.on("disconnect", () => {
				socket.broadcast.emit("onDisconnected", { userId });
			});

			socket.on("@newConversation", (data) => {
				const { conversation } = data;
				const conversationId = conversation._id.toString();
				socket.join(conversationId);
			});

			socket.on("@conversationDeleted", (data) => {
				const { conversation } = data;
				const conversationId = conversation._id.toString();
				socket.leave(conversationId);
			});

			socket.on("@conversationSeen", (data) => {
				const { conversation } = data;
				const conversationId = conversation._id.toString();
				socket.to(conversationId).emit("@conversationSeen", data);
			});

			socket.on("@newMessage", (data) => {
				const { message } = data;
				const conversationId = message.conversationId.toString();
				socket.to(conversationId).emit("@newMessage", data);
			});

			socket.on("@messageEdited", (data) => {
				const { message } = data;
				const conversationId = message.conversationId.toString();
				socket.to(conversationId).emit("@messageEdited", data);
			});

			socket.on("@reactionAdded", (data) => {
				const { message } = data;
				const conversationId = message.conversationId.toString();
				socket.to(conversationId).emit("@reactionAdded", data);
			});

			socket.on("@messageDeleted", (data) => {
				const { message } = data;
				const conversationId = message.conversationId.toString();
				socket.to(conversationId).emit("@messageDeleted", data);
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

