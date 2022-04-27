require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");

const con = require("./conexion.js");

const app = express();

const { 
  login,
  registroUsuario } = require("./controllers/usuarios");

const { 
  consultaNoticias,
  consultaNuevasNoticias,
  consultaNoticiasFecha,
  consultaNoticiasTema,
  crearArticulo
   } = require("./controllers/noticias");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", consultaNoticias);

app.get("/noticiasdeldia", consultaNuevasNoticias);

app.get("/noticias/:fecha", consultaNoticiasFecha);

app.get("/noticias/:tema", consultaNoticiasTema);

app.post("/registro", registroUsuario);

app.post("/login", login);

app.post("/noticias/articuloNuevo", crearArticulo);

app.listen(4000, () => console.log("127.0.0.1:4000"));
