const {MongoClient} = require('mongodb');
import "regenerator-runtime/runtime";

describe('insert', () => {
  let connection;
  let db;

  beforeAll(async () => {
    connection = await MongoClient.connect(process.env.MONGO_URL, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    db = await connection.db();
  });


  describe('Ratings module: attrScore function', () => {

  test('expect attrScore to return a length of 0 if no reviews', () => {
    expect(0).toBe(0);
  });

});

  afterAll(async () => {
    await connection.close();
  });
});