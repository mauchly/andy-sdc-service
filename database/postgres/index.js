const { Client } = require('pg');
const { dbPw } = require('../database.config');

const client = new Client({
  user: 'admin',
  host: 'localhost',
  database: 'abreviews',
  password: dbPw,
  port: 5432,
});

client.connect();

module.exports = client;
