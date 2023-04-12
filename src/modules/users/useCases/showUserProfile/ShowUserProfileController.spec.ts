import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;

describe("Show User Profile", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to get a profie", async () => {
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

        const response = await request(app)
            .get("/api/v1/profile")
            .set({
                Authorization: `Bearer ${token}`
            });

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body.email).toEqual("johndoe@example.com");
    })
})