const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const conexion = require("../conexion.js");

const login = async (req, res) => {
  const { usuario, password } = req.body;

  if (!usuario || !password) {
    res.sendStatus(400);
    console.log("1");
    return;
  }

  const sqlGetUser = `select * from usuarios where nombre="${usuario}"`; //punto 4

  const usuarios = await conexion.query(sqlGetUser);

  if (usuarios[0].length === 0) {
    res.sendStatus(403);
    console.log("2");
    conexion.release();
    return;
  }

  if (usuarios[0][0].active === 0) {
    res.sendStatus(403);
    console.log("3");
    conexion.release();
    return;
  }

  const passwordsIguales = await bcrypt.compare(
    pass,
    usuarios[0][0].pass
  );

  if (!passwordsIguales) {
    res.sendStatus(403);
    console.log("4");
    conexion.release();
    return;
  }

  const infoUsuario = {
    id: usuarios[0][0].id,
  };

  var token = jwt.sign(infoUsuario, process.env.SECRET, {
    expiresIn: "30d",
  });
  //connection.release();

  res.send({
    data: token,
  });
};

const registroUsuario = async (request, response) => {
  //post (user, pass) en el body
  const {nombre, pass} = request.body;
  if (!nombre || !pass) {
    response.sendStatus(400); //si faltan parametros Error 400
    return;
  }

  const conectado = await conexion.getConnection(); //conexion 
  const usuario = await conectado.query(
    `select * from usuarios where nombre="${nombre}"`);

  if(usuario[0].length !==0){ //si ya existe manda Conflict 409
    response.sendStatus(409);
    conectado.release(); //libera conexion
    return;
  }

  const hash = await bcrypt.hash(pass, 10); //encriptacion de datos
  await conectado.query(
    `Insert into usuarios values (null, "${nombre}", null, null, null, "${hash}")`);

  conectado.release();  
  response.send(`Usuario ${nombre} registrado`);
};

//const loginUsuario = (request, response) => {};

module.exports = {
  login,
  registroUsuario,
};
