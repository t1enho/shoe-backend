import { Sequelize } from "sequelize";

export const connection = new Sequelize({
  host: "localhost",
  dialect: "mysql",
  username: "root",
  password: "",
  database: "shoe",
  logging: false,
  timezone: "+07:00",
  dialectOptions: {
    timezone: "local",
    dateStrings: true,
    typeCast: true,
  },
});

connection
  .authenticate()
  .then(() => {
    console.log("Connection has been established successfully.");
  })
  .catch((error) => {
    console.error("Unable to connect to the database: ", error);
  });

connection.sync({
  alter: true,
});
