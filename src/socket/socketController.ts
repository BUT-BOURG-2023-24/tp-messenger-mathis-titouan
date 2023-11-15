import type { Database } from "../database/database";
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
		this.io.on("connection", (socket) => {
			/*
			// ETAPE 1: Trouver toutes les conversations ou participe l'utilisateur.
			const userId = socket.handshake.headers.userId;
			const conversations = getConversationsByUserId(userId);

			// ETAPE 2: Rejoindre chaque room ayant pour nom l'ID de la conversation.

			conversations.forEach(conversation => {
				const roomId = conversation.id.toString();
				socket.join(roomId);
			});

			 */
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

