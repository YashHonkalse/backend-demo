const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();

// ✅ CORS setup to allow only your frontend
app.use(cors({
  origin: "http://18.212.172.14:3000", // <-- Your frontend URL
  methods: ["GET", "POST"],
  allowedHeaders: ["Content-Type"],  // Ensure this is added to allow body parsing
}));

app.use(bodyParser.json());

// MySQL DB Config
const mysqlConfig = {
  host: "demo-db.cf8u4ugo4i4i.us-east-1.rds.amazonaws.com",
  port: "3306",
  user: "admin",
  password: "EdMuNd123456",
  database: "appdb",
};

// Using connection pooling for better performance
const pool = mysql.createPool(mysqlConfig);

// Routes
app.get("/user", (req, res) => {
  pool.query("SELECT * FROM apptb", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(results);
    }
  });
});

app.post("/user", (req, res) => {
  pool.query(
    "INSERT INTO apptb (name) VALUES (?)",
    [req.body.data],
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error inserting data into database");
      } else {
        res.json(results);
      }
    }
  );
});

app.post("/dbinit", (req, res) => {
  pool.query("CREATE DATABASE IF NOT EXISTS appdb", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error creating database");
    } else {
      res.json("Database created successfully");
    }
  });
});

app.post("/tbinit", (req, res) => {
  pool.query(
    "CREATE TABLE IF NOT EXISTS apptb (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))",
    (err, results) => {
      if (err) {
        console.error(err);
        res.status(500).send("Error creating table");
      } else {
        res.json("Table created successfully");
      }
    }
  );
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
