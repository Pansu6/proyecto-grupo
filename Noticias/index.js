const bodyParser = require("body-parser");
const express = require("express");
const mysql = require('mysql');

const con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "1234",
    database : 'noticias'
});

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/noticias', (request, response) => {
  con.query('SELECT * FROM articles', (error, result) => {
      if (error) throw error;
      response.send(result);
  });
});

app.get('/usuarios', (request, response) => {
  con.query('SELECT * FROM users', (error, result) => {
      if (error) throw error;
      response.send(result);
  });
});


app.listen(4000 , () => console.log("127.0.0.1:4000"));

