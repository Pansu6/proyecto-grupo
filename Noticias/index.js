const bodyParser = require("body-parser");
const express = require("express");
const bcrypt = require("bcrypt");
const con = require("./data/conexion.js");

const app = express();

const { login, registroUsuario } = require("./controllers/usuarios");

const {
  crearArticulo,
  noticiasFecha,
  consultaNoticiasTema,
  consultaNuevasNoticias,
  consultaNoticias,
} = require("./controllers/noticias");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get("/", consultaNoticias);

app.get("/noticiasdeldia", consultaNuevasNoticias);

app.get("/noticias/:tema", consultaNoticiasTema);

app.get("/noticias/:fecha", noticiasFecha);

app.get("/registro", registroUsuario);

app.post("/login", login);

app.post("/noticias/articuloNuevo", crearArticulo);

app.get("/usuarios", (request, response) => {
  con.query("SELECT * FROM usuarios", (error, result) => {
    if (error) throw error;
    response.send(result);
  });
});

app.listen(4000, () => console.log("127.0.0.1:4000"));
