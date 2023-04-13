import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;

describe("Get Statement Operation", () => {
    beforeAll(async () => {
        connection = await createConnection();
        await connection.runMigrations();
    });

    afterAll(async () => {
        await connection.dropDatabase();
        await connection.close();
    });

    it("should be able to get statement operation", async () => {
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
        
        const { user_id } = responseUser.body;

        const deposit = {
            id: user_id,
            amount: 100,
            description: "deposit test"
        };

        const responseDeposit = await request(app)
            .post("/api/v1/statements/deposit")
            .set({
                Authorization: `Bearer ${token}`
            })
            .send(deposit);
        
        const { id: statement_id } = responseDeposit.body;
        
        const response = await request(app)
            .get(`/api/v1/statements/${statement_id}`)
            .set({
                Authorization: `Bearer ${token}`
            })
            .send({
                id: user_id,
                statement_id
            });
        
        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty("id");
        expect(response.body.amount).toEqual("100.00");
        expect(response.body.description).toEqual("deposit test");
        expect(response.body.type).toEqual("deposit");
    });
});