const { MongoClient } = require("mongodb");
import "regenerator-runtime/runtime";
const request = require("supertest");
const app = require("../server/index");

describe("insert", () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    db = await connection.db();
  });

  describe("Server tests", () => {
    test("should insert a testuser in collection", async () => {
      const users = db.collection("users");

      const mockUser = { _id: "some-user-id", name: "John" };
      await users.insertOne(mockUser);

      const insertedUser = await users.findOne({ _id: "some-user-id" });
      expect(insertedUser).toEqual(mockUser);
    });

    test("should get 200 when looking up listing ID", async () => {
      await request(app).get("/10001").expect(200);
    });

    test("should get 200 when looking up listing path", async () => {
      await request(app).get("/listing").expect(200);
    });

    test("should get string when looking up averageScore10001", async () => {
      await request(app).get("/averageScore10001").expect(200);
    });
  });

  afterAll(async () => {
    await connection.close();
  });
});
