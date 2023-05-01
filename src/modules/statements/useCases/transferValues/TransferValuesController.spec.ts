import { Connection, createConnection } from "typeorm";
import { app } from "../../../../app";
import request from "supertest";

let connection: Connection;

describe("Transfer Values", () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("Should be able to transfer values between accounts", async () => {
    const john = await request(app)
      .post("/api/v1/users")
      .send({
        name: "John Doe",
        email: "john@example.com",
        password: "123456"
      });
    const jane = await request(app)
      .post("/api/v1/users")
      .send({
        name: "Jane Doe",
        email: "jane@example.com",
        password: "123456"
      });
    const responseToken = await request(app)
      .post("/api/v1/sessions")
      .send({
          email: "john@example.com",
          password: "123456"
      });
    const { token } = responseToken.body;
    await request(app)
      .post("/api/v1/statements/deposit")
      .set({
          Authorization: `Bearer ${token}`
      })
      .send({
        id: john.body.id,
        amount: 100,
        description: "deposit test"
      });
    const transfer = await request(app)
      .post(`/api/v1/statements/transfers/${jane.body.id}`)
      .set({
        Authorization: `Bearer ${token}`
      })
      .send({
        "amount": 100,
        "description": "to pay bills"
      });
    const balance = await request(app)
      .get("/api/v1/statements/balance")
      .set({
          Authorization: `Bearer ${token}`
      })
      .send({
          user_id: jane.body.id
      });
    expect(transfer.status).toBe(201);
    expect(transfer.body).toHaveProperty("id");
    expect(transfer.body.amount).toEqual(100);
    expect(transfer.body.description).toEqual("to pay bills");
    expect(balance.body.statement).toHaveLength(2);
  });
});
