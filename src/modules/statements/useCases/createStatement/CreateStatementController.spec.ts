import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;

describe("Create Statement", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create a deposit statement", async () => {
        await request(app)
            .post("/api/v1/users")
            .send({
                name: "John Doe",
                email: "johndoe@example.com",
                password: "password"
            });

        const responseToken = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "johndoe@example.com",
                password: "password"
            });
        
        const { token } = responseToken.body;

        const responseUser = await request(app)
            .get("/api/v1/profile")
            .set({
                Authorization: `Bearer ${token}`
            });
        
        const { id } = responseUser.body;
        const deposit = {
            id,
            amount: 100,
            description: "deposit test"
        };

        const response = await request(app)
            .post("/api/v1/statements/deposit")
            .set({
                Authorization: `Bearer ${token}`
            })
            .send(deposit);
        
        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.amount).toEqual(100);
        expect(response.body.description).toEqual("deposit test");
        expect(response.body.type).toEqual("deposit");
    });

    it("should be able to create a withdraw statement", async () => {
        await request(app)
            .post("/api/v1/users")
            .send({
                name: "John Doe",
                email: "johndoe@example.com",
                password: "password"
            });

        const responseToken = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "johndoe@example.com",
                password: "password"
            });
        
        const { token } = responseToken.body;

        const responseUser = await request(app)
            .get("/api/v1/profile")
            .set({
                Authorization: `Bearer ${token}`
            });
        
        const { id } = responseUser.body;
        
        const deposit = {
            id,
            amount: 200,
            description: "deposit test"
        };

        await request(app)
            .post("/api/v1/statements/deposit")
            .set({
                Authorization: `Bearer ${token}`
            })
            .send(deposit);
        
        const withdraw = {
            id,
            amount: 100,
            description: "withdraw test"
        };

        const response = await request(app)
            .post("/api/v1/statements/withdraw")
            .set({
                Authorization: `Bearer ${token}`
            })
            .send(withdraw);

        expect(response.status).toBe(201);
        expect(response.body).toHaveProperty("id");
        expect(response.body.amount).toEqual(100);
        expect(response.body.description).toEqual("withdraw test");
        expect(response.body.type).toEqual("withdraw");
    });
});