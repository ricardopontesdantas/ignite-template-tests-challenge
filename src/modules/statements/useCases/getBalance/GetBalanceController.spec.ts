import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;

describe("Get Balance", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to get balance", async () => {
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
        
        const { id: user_id } = responseUser.body;

        const response = await request(app)
            .get("/api/v1/statements/balance")
            .set({
                Authorization: `Bearer ${token}`
            })
            .send({
                user_id
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("balance");
    });
});