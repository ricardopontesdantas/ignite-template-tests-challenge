import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;

describe("Create User", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to create a new users", async () => {
        const response = await request(app)
            .post("/api/v1/users")
            .send({
                name: "John Doe",
                email: "johndoe@example.com",
                password: "password"
            });

        expect(response.status).toBe(201);
    });

    it("should not be able to create a new users with an existent email", async () => {
        const response = await request(app)
            .post("/api/v1/users")
            .send({
                name: "John Doe",
                email: "johndoe@example.com",
                password: "password"
            });

        expect(response.status).toBe(400);
    });
})