require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");

const app = express();

const { 
  login,
  registroUsuario } = require("./controllers/usuarios");

const { 
  consultaNoticias,
  consultaNuevasNoticias,
  noticiaTema,
  consultaFecha
  //crearArticulo
   } = require("./controllers/noticias");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

app.get("/", consultaNoticias);

app.get("/noticiasdeldia", consultaNuevasNoticias);

app.get("/noticias/:tema", noticiaTema);

app.get("/:fecha", consultaFecha);

app.post("/registro", registroUsuario);

app.post("/login", login);

app.post("/noticias/articuloNuevo", crearArticulo);

app.listen(4000, () => console.log("127.0.0.1:4000"));
