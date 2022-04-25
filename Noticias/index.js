const bodyParser = require("body-parser");
const express = require("express");
const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const listNews = async (req, res) => {
  const { from_date, to_date } = req.query;
  const connection = await db.getConnection();

  let sql = "select id, name, date, category from articles";
  let filters = [];

  if (from_date) {
    filters.push(`date >= ${from_date}`);
  }
  if (to_date) {
    filters.push(`date <= ${to_date}`);
  }
  if (filters.length !== 0) {
    sql = `${sql} where ${filters.join(" and ")}`;
  }
  const listOfNews = await connection.query(sql);

  let filteredNews = listOfNews;
  res.send(filteredNews);
};

app.get("/noticias", listNews);

app.listen(4000);
