require("dotenv").config();

const bodyParser = require("body-parser");
const express = require("express");

const app = express();

const { 
  login,
  registrarUsuario,
  editarUsuario
} = require("./controllers/usuarios");

const { 
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

const estaLogueado = (req, res, next) => {
  const token = req.headers.authorization;
  const jwt = require("jsonwebtoken");

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
