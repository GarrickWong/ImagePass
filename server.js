//Create express app
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser')
const format = require('pg-format');
let app = express();
//Database variables
const { Client } = require('pg');
const databaseConnection = "postgresql://user:password@localhost:5432/ImagePass"
pgClient = new Client(databaseConnection);

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())
//Set up the routes
app.use(express.static("public"));
app.use(cors());

app.get("/picture", getPicture);
app.post("/password", getPassword);
app.post("/addPassword", addPassword);
pgClient.connect();

function getPicture(req, res) {
  pgClient.query("SELECT image FROM imagetable WHERE id IN  (SELECT floor(random()*3))", function(err, result) {
    if(err) {
      return console.error('error running query', err);
    }
    console.log('query sent.');
    let row = result.rows[0];
    let image = row.image;
    res.status(200).send(image);
    });
}

function getPassword(req, res) {
  console.log(req.body);
  let url = req.body.url;
  let sql = format("SELECT image, password FROM passwordtable WHERE url IN (%L)", url);
  pgClient.query(sql, function(err, result) {
      if(err) {
        return console.error('error running query', err);
      }
      console.log(url);
      console.log(result);
      let rowcount = result.rowCount;
      if (rowcount == 0) {
        res.sendStatus(404);
      } else {
        let row = result.rows[0];

        console.log(row);
        res.json(row);
      }
  });
}

function addPassword(req, res) {
  console.log(req.body);
  let image = req.body.image;
  let password = req.body.password;
  let url = req.body.url;
  console.log(image);
  console.log(password);
  console.log(url);
  let sql = format("INSERT INTO passwordtable (image, password, url) VALUES(%L, %L, %L)", image, password, url);
  console.log(sql);
  pgClient.query(sql, function(err, result) {
      if(err) {
        return console.error('error running query', err);
      }
      console.log("data saved to database")
      res.sendStatus(200);
      });
}

// Start server once Mongo is initialized
app.listen(3000);
console.log("Server listening at http://localhost:3000");
