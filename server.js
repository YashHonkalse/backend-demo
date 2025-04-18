const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");
const bodyParser = require("body-parser");

// Create the Express app
const app = express();

// ✅ CORS setup to allow only your frontend
app.use(cors({
  origin: "http://3.86.43.156:3000", // <-- Your frontend URL
  methods: ["GET", "POST"]
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

let con = null;

const databaseInit = () => {
  con = mysql.createConnection(mysqlConfig);
  con.connect((err) => {
    if (err) {
      console.error("Error connecting to the database: ", err);
      return;
    }
    console.log("Connected to the database");
  });
};

const createDatabase = () => {
  con.query("CREATE DATABASE IF NOT EXISTS appdb", (err, results) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log("Database created successfully");
  });
};

const createTable = () => {
  con.query(
    "CREATE TABLE IF NOT EXISTS apptb (id INT AUTO_INCREMENT PRIMARY KEY, name VARCHAR(255))",
    (err, results) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log("Table created successfully");
    }
  );
};

// Routes
app.get("/user", (req, res) => {
  databaseInit();
  con.query("SELECT * FROM apptb", (err, results) => {
    if (err) {
      console.error(err);
      res.status(500).send("Error retrieving data from database");
    } else {
      res.json(results);
    }
  });
});

app.post("/user", (req, res) => {
  con.query(
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
  databaseInit();
  createDatabase();
  res.json("Database created successfully");
});

app.post("/tbinit", (req, res) => {
  databaseInit();
  createTable();
  res.json("Table created successfully");
});

// Start the server
app.listen(3000, () => {
  console.log("Server running on port 3000");
});
