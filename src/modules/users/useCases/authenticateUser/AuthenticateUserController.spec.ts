import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;

describe("Authenticate User", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create an authentication", async () => {
        await request(app)
            .post("/api/v1/users")
            .send({
                name: "John Doe",
                email: "johndoe@example.com",
                password: "password"
            });

        const response = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "johndoe@example.com",
                password: "password"
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('token');
    });

    it("should not be able to create an authentication to a non-existing user", async () => {
        const response = await request(app)
            .post("/api/v1/sessions")
            .send({
                email: "non-existing@example.com",
                password: "password"
            });

        expect(response.status).toBe(401);
    });
})