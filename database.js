require("dotenv").config();
const mysql = require("mysql2/promise");

const database = mysql.createPool({
  host: process.env.DEB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

database
  .query("select * from movies")
  .then((result) => {
    const movies = result[0];
  })
  .catch((err) => {
    console.error(err);
  });

database
  .query("select * from users")
  .then((res) => {
    const users = res[0];
    console.log(res[0]);
    console.log("Can get users");
  })
  .catch((err) => {
    console.error(err);
  });

module.exports = database;
