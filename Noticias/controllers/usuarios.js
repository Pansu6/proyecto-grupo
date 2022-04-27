const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const con = require("../data/conexion");

const login = async (req, res) => {
  const { usuario, pass } = req.body;

  if (!usuario || !pass) {
    res.sendStatus(400);
    return;
  }

  const sqlGetUser = `select * from usuarios where usuario="${usuario}"`; //punto 4

  const usuarios = con.query(sqlGetUser);

  if (usuarios[0].length === 0) {
    res.sendStatus(403);
    con.release();
    return;
  }

  if (usuarios[0][0].active === 0) {
    res.sendStatus(403);
    con.release();
    return;
  }

  const passIguales = await bcrypt.compare(pass, usuarios[0][0].password);

  if (!passIguales) {
    res.sendStatus(403);
    con.release();
    return;
  }

  const infoUsuario = {
    id: usuarios[0][0].id,
  };

  var token = jwt.sign(infoUsuario, process.env.SECRET, {
    expiresIn: "30d",
  });
  con.release();

  res.send({
    data: token,
  });
};

const registroUsuario = async (request, response) => {
  //post (user, pass) en el body
  const { nombre, pass } = request.body;
  bcrypt.hash(pass, 5, function (err, hash) {
    console.log(hash, nombre);
    // TODO: Store the hash in your password DB
  });
  response.send("ok");
};

module.exports = {
  login,
  registroUsuario,
};
