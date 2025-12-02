require("dotenv").config();

/*
const dbConfig = {
  host: process.env.host,
  user: process.env.user,
  password: "",
  database: process.env.database,
  waitForConnections: true,
};
*/
const dbConfig = {
  host: "localhost",
  user: "root",
  password: "duykhoa@2005",
  database: "TicketBookingSystem",
  waitForConnections: true,
};

module.exports = dbConfig;
