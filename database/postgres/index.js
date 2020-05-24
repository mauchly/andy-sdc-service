const { Pool } = require('pg');
require('dotenv').config();

const client = new Pool({
  user: process.env.USER,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.DBPORT,
});

client.connect(() => {
  console.log('connected to db!');
});

module.exports = client;
