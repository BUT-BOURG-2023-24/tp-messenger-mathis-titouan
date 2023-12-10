import http from "http";
import { Express } from "express";
import { setup, teardown } from "./setupTests";
import supertest from "supertest";

describe('USERS', () => 
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

	test("Login unexisting user", async () => {
		const username = "nonexistentUser";
		const password = "nonexistentPassword";

		const response = await supertest(app)
			.post("/users/login")
			.send({ username, password });

		expect(response.status).toBe(200);

		expect(response.body.user).toBeDefined();
		expect(response.body.token).toBeDefined();

		expect(response.body.user.username).toBe(username);

		expect(response.body.isNewUser).toBe(true);
	});

	test("Login existing user", async () => {
		const username = "test";
		const password = "testpwd";

		const response = await supertest(app)
			.post("/users/login")
			.send({ username, password });

		expect(response.status).toBe(200);

		expect(response.body.user).toBeDefined();
		expect(response.body.token).toBeDefined();

		expect(response.body.user.username).toBe(username);

		expect(response.body.isNewUser).toBe(false);
	});

	test("Login wrong password", async () => {
		const username = "test";
		const wrongPassword = "wrongPassword";

		const response = await supertest(app)
			.post("/users/login")
			.send({ username, wrongPassword });

		expect(response.status).toBe(400);

		expect(response.body.error).toBe("Wrong password");
	});

	test("GET active users", async () => {
		const response = await supertest(app)
			.get("/users/online")
			.set('Authorization', `Bearer ${token}`);

		expect(response.status).toBe(200);

		expect(response.body.users).toBeDefined();
		expect(response.body.users.length).toBeGreaterThan(0);
	});
});