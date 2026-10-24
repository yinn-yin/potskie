const mysql = require("mysql2");

const lime_db = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "",
    database: "lime_db"
})

module.exports= lime_db;