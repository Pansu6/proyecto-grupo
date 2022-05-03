require("dotenv").config();
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");
const express = require("express");

const app = express();

const { 
  crearBD
} = require("./inicia");

crearBD(); //script para crear base de datos

const { //funcionalidades usuarios
  login,
  registrarUsuario,
  editarUsuario
} = require("./controllers/usuarios");

const { //funcionalidades noticias
  consultaNoticias,
  consultaNuevasNoticias,
  noticiaTema,
  consultaFecha,
  noticiaNueva,
  editarNoticia,
  borrarNoticia,
  votarNoticia
} = require("./controllers/noticias");

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

const estaLogueado = (req, res, next) => { //comprueba si esta logueado
  const token = req.headers.authorization;

  try{
    const infoUsuario = jwt.verify(token, process.env.SECRET);
    next();
  }
  catch{
    console.log("Error verificacion");
    res.sendStatus(401);
  }
}

app.get("/", consultaNoticias);

app.get("/noticiasdeldia", consultaNuevasNoticias);

app.get("/noticiastema/:tema", noticiaTema);

app.get("/noticiasfecha/:fecha", consultaFecha);

app.post("/registro", registrarUsuario);

app.post("/login", login);

app.post("/noticianueva", estaLogueado, noticiaNueva);

app.post("/editarnoticia", estaLogueado, editarNoticia);

app.post("/borrarnoticia", estaLogueado, borrarNoticia);

app.post("/votarnoticia", estaLogueado, votarNoticia);

app.post("/editarusuario", estaLogueado, editarUsuario);

app.listen(4000, () => console.log("127.0.0.1:4000"));
