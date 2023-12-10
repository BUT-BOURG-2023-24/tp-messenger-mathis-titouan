import http from "http";
import supertest from "supertest";
import { Express } from "express";
import { setup, teardown } from "./setupTests";

describe('CONVERSATIONS', () => 
{
	let app:Express, server:http.Server;

	beforeAll(async () => {
		let res = await setup();
		app = res.app; 
		server = res.server;
	});

	afterAll(async () => {
		await teardown();
	});

	test("CREATE Conversation success", async () => {
		// Pour set un header avec supertest, 
		// vous pouvez utiliser la fonction .set('headerName', headerValue)
		// Après avoir fait l'appel au get() (ou post(), ect...)
		const userId1 = "userId1";
		const userId2 = "userId2";

		const response = await supertest(app)
			.post("/conversations")
			.set('Authorization', `Bearer ${token}`) // Assumons que le token est disponible
			.send({ concernedUsersIds: [userId1, userId2] });

		expect(response.status).toBe(200);

		expect(response.body.conversation).toBeDefined();

		expect(response.body.conversation.participants).toContain(userId1);
		expect(response.body.conversation.participants).toContain(userId2);

		
	});

	test("CREATE Conversation wrong users", async () => {
		const wrongUserId1 = "wrongUserId1";
		const wrongUserId2 = "wrongUserId2";

		const response = await supertest(app)
			.post("/conversations")
			.set('Authorization', `Bearer ${token}`) // Assumons que le token est disponible
			.send({ concernedUsersIds: [wrongUserId1, wrongUserId2] });

		expect(response.status).toBe(400);

		expect(response.body.error).toBe("Wrong users");
	});

	test("GET All conversation success", async () => {
		const response = await supertest(app)
			.get("/conversations")
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);

		expect(response.body.conversations).toBeDefined();
		expect(response.body.conversations.length).toBeGreaterThan(0);
	});

	test("POST Message in conversation", async () => {
		const conversationId = "conversationId";
		const messageContent = "Hello, world!";

		const response = await supertest(app)
			.post(`/conversations/${conversationId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ messageContent });

		expect(response.status).toBe(200);

		expect(response.body.message).toBeDefined();

		expect(response.body.message.content).toBe(messageContent);
	});

	test("POST Reply message in conversation", async () => {
		const conversationId = "conversationId";
		const messageId = "messageId";
		const replyContent = "This is a reply!";

		const response = await supertest(app)
			.post(`/conversations/${conversationId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ messageContent: replyContent, messageReplyId: messageId });

		expect(response.status).toBe(200);

		expect(response.body.message).toBeDefined();

		expect(response.body.message.content).toBe(replyContent);

		expect(response.body.message.replyTo).toBe(messageId);
	});

	test("PUT Edit message in conversation", async () => {
		const conversationId = "conversationId";
		const messageId = "messageId";
		const newMessageContent = "This is the edited message!";

		const response = await supertest(app)
			.put(`/conversations/${conversationId}/${messageId}`)
			.set('Authorization', `Bearer ${token}`) // Assume that the token is available
			.send({ messageContent: newMessageContent });

		expect(response.status).toBe(200);

		expect(response.body.message).toBeDefined();

		expect(response.body.message.content).toBe(newMessageContent);
	});

	test("POST React message in conversation", async () => {
		const conversationId = "conversationId";
		const messageId = "messageId";
		const reactionType = "like";

		const response = await supertest(app)
			.post(`/conversations/${conversationId}/${messageId}/reactions`)
			.set('Authorization', `Bearer ${token}`) // Assume that the token is available
			.send({ reactionType });

		expect(response.status).toBe(200);

		expect(response.body.reaction).toBeDefined();

		expect(response.body.reaction.type).toBe(reactionType);

		expect(response.body.reaction.messageId).toBe(messageId);
	});


	test("POST See conversation", async () => {
		const conversationId = "conversationId";
		const messageId = "messageId";

		const response = await supertest(app)
			.post(`/conversations/see/${conversationId}`)
			.set('Authorization', `Bearer ${token}`)
			.send({ messageId });

		expect(response.status).toBe(200);

		expect(response.body.conversation).toBeDefined();

		expect(response.body.conversation.seen[res.locals.userId]).toBe(messageId);
	});

	test("DELETE Message in conversation", async () => {
		const conversationId = "conversationId";
		const messageId = "messageId";

		const response = await supertest(app)
			.delete(`/conversations/${conversationId}/${messageId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);

		expect(response.body.conversation).toBeDefined();

		expect(response.body.conversation.messages).not.toContain(messageId);
	});

	test("DELETE Conversation", async () => {
		const conversationId = "conversationId";

		const response = await supertest(app)
			.delete(`/conversations/${conversationId}`)
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);

		expect(response.body.conversation).toBeDefined();
	});
});