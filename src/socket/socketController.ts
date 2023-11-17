import type { Database } from "../database/database";
import ConversationModel, { IConversation } from '../database/Mongo/Models/ConversationModel'
import { Server } from "socket.io";
import {IUser} from "../database/Mongo/Models/UserModel";
import {IMessage} from "../database/Mongo/Models/MessageModel";

export class SocketController
{
	/*
		Pour savoir si un utilisateur est connecté depuis la route /online,
		Nous devons stocker une correspondance socketId <=> userId.
	*/
	private socketIdToUserId: Map<string, string> = new Map<string, string>();

	constructor(private io:Server, private database:Database)
	{
		this.connect();
		this.listenRoomChanged();
		this.database = database;
	}
	

	connect()
	{
		this.io.on("connection", async (socket) => {
			const userId = socket.handshake.headers.userid;
			if (!userId) {
				socket.disconnect();
				return;
			}

			try {
				const result = await this.database.conversationController.getAllConversationsForUser(userId as string);
				const conversations = result as IConversation[];
				conversations.forEach((conversation) => {
					socket.join(conversation._id.toString());
				});
				this.socketIdToUserId.set(socket.id, userId as string);

				socket.broadcast.emit("@onConnected", { userId });

			} catch (error) {
				console.error(error);
			}

			socket.on("disconnect", () => {
				this.socketIdToUserId.delete(socket.id);
				socket.broadcast.emit("@onDisconnected", { userId });
			});
			
		});
		
	}

	private getUserSocketId(userId: string) {
		for(let [socketId, id] of this.socketIdToUserId.entries()) {
			if (id === userId) {
				return socketId;
			}
		}
		return null;
	}

	public emitNewConversation(conversation: IConversation, participants: string[]) {
		participants.forEach((participant) => {
			let socketId = this.getUserSocketId(participant);
			if(socketId) {
				this.io.sockets.sockets.get(socketId)?.join(conversation._id.toString());
			}
		});
		this.io.to(conversation._id.toString()).emit("@newConversation", { conversation });
	}

	public emitDeleteConversation(conversation: IConversation) {
		const conversationId = conversation._id.toString();
		this.io.to(conversationId).emit("@conversationDeleted", { conversation });
	}

	public emitSeenConversation(conversation: IConversation) {
		this.io.to(conversation._id.toString()).emit("@conversationSeen", { conversation });
	}

	public emitNewMessage(conversation: IConversation, message: IMessage) {
		const conversationId = conversation._id.toString();
		this.io.to(conversationId).emit("@newMessage", { message });
	}


	public emitEditMessage(message: IMessage) {
		const conversationId = message.conversationId.toString();
		this.io.to(conversationId).emit("@messageEdited", { message });
	}

	public emitDeleteMessage(message: IMessage) {
		const conversationId = message.conversationId.toString();
		this.io.to(conversationId).emit("@messageDeleted", { message });
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

