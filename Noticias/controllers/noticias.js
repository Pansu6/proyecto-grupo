const conexion = require("../conexion.js");
const jwt = require("jsonwebtoken");

const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);
const fechaHoy = hoy.toISOString().split("T")[0]; //dia de hoy en formato SQL

const consultaNoticias = async (request, response) => {
  //INICIO
  const conectado = await conexion.getConnection();
  const listaNoticias = await conectado.query(`select * from noticias order by fecha desc;`);
  //conectado.release();
  response.send(listaNoticias[0]);
};

const consultaNuevasNoticias = async (request, response) => {
  //PUNTO 1
  const conectado = await conexion.getConnection();
  const listaNoticias = await conectado.query(`select * from noticias where fecha = "${fechaHoy}" order by fecha desc;`);
  //conectado.release();
  response.send(listaNoticias[0]);
};

const noticiaTema = async (request, response) => {
  //PUNTO 3
  const temaNoticia = request.params.tema; //filtro en el body
  const conectado = await conexion.getConnection();
  
  const listaNoticias = await conectado.query(`select * from noticias where tema = "${temaNoticia}";`);
  conectado.release();
  response.send(listaNoticias[0]);
};
const consultaFecha = async (request, response) => {
  //PUNTO 2
  const fechaNoticia = request.params.fecha;
  const conectado = await conexion.getConnection();
  const listaNoticias = await conectado.query(`select * from noticias where fecha = "${fechaNoticia}";`);
  conectado.release();
  response.send(listaNoticias[0]);
};

const noticiaNueva = async (request, response) => {
  const {titulo, foto, entradilla, texto, tema} = request.body;
  const token = request.headers.authorization;
  const infoUsuario = jwt.decode(token, process.env.SECRET);

  if(!titulo || !entradilla || !texto || !tema){
    response.sendStatus(400);
    console.log("hola");
    return
  }
  const conectado = await conexion.getConnection(); //conexion 
  const noticia = await conectado.query(`select * from noticias where titulo="${titulo}"`);

  if(noticia[0].length !==0){ //si ya existe manda Conflict 409
    response.sendStatus(409);
    conectado.release(); //libera conexion
    return;
  }
  //insercion sql
  conectado.query(`insert into noticias values (null, "${titulo}", "${fechaHoy}", "${foto}", "${entradilla}", "${texto}", "${tema}", 0, 0, 0, "${infoUsuario.id}");`);
  conectado.release();
  response.sendStatus(200);
};


const editarNoticia = async (request, response) => {
  let {id, titulo, foto, entradilla, texto, tema} = request.body;

  if(id.length ===0){ //si no existe 
    response.sendStatus(409);
    return;
  }

  const token = request.headers.authorization;
  const infoUsuario = jwt.decode(token, process.env.SECRET);

  const conectado = await conexion.getConnection(); //conexion 
  const noticia = await conectado.query(`select * from noticias where id="${id}"`);

  if(noticia[0].length ===0){ //si no existe manda Conflict 409
    response.sendStatus(409);
    conectado.release(); //libera conexion
    return;
  }

  if(noticia[0][0].usuario!==infoUsuario.id){//si la noticia no pertenece al usuario
    response.sendStatus(409);
    conectado.release(); //libera conexion
    return;
  }
  //si falta algun parametro recupera el anterior valor 
  if(titulo.length === 0){
    titulo = noticia[0][0].titulo;
  }
  if(foto.length === 0){
    foto = noticia[0][0].foto;
  }
  if(entradilla.length === 0){
    entradilla = noticia[0][0].entradilla;
  }
  if(texto.length === 0){
    texto = noticia[0][0].texto;
  }
  if(tema.length === 0){
    tema = noticia[0][0].tema;
  }
  
  conectado.query(
    `update noticias 
  set titulo = "${titulo}", fecha = "${fechaHoy}", foto = "${foto}", entradilla = "${entradilla}", texto = "${texto}", tema = "${tema}", positivo = 0, negativo = 0, editado= 1
  where id = "${id}";`);
  conectado.release();
  response.sendStatus(200);
}

const borrarNoticia = async (request, response) => {
  let {id} = request.body;
  if(id.length ===0){ //si no existe 
    response.sendStatus(400);
    return;
  }

  const token = request.headers.authorization;
  const infoUsuario = jwt.decode(token, process.env.SECRET);

  const conectado = await conexion.getConnection(); //conexion 
  const noticia = await conectado.query(`select * from noticias where id="${id}"`);
  console.log(noticia[0]);
  if(noticia[0].length ===0){ //si no existe manda Conflict 409
    response.sendStatus(409);
    conectado.release(); //libera conexion
    return;
  }
  if(noticia[0][0].usuario!==infoUsuario.id){//si la noticia no pertenece al usuario
    response.sendStatus(409);
    conectado.release(); //libera conexion
    return;
  }

  conectado.query(`delete from noticias where id = "${id}";`);
  conectado.release();
  response.sendStatus(200);
}

const votarNoticia = async (request, response) => {
  let {id, pos, neg} = request.body;
  if(id.length ===0){ //si no existe 
    response.sendStatus(400);
    return;
  }
  const conectado = await conexion.getConnection(); //conexion 
  const noticia = await conectado.query(`select * from noticias where id="${id}"`);
  console.log(noticia[0]);
  if(noticia[0].length ===0){ //si no existe manda Conflict 409
    response.sendStatus(409);
    conectado.release(); //libera conexion
    return;
  }

  if(pos.length===0 || pos === 0){
    pos = noticia[0][0].positivo;
  }
  else{
    pos = 1 + noticia[0][0].positivo;
  }
  if(neg.length===0 || neg === 0){
    neg=noticia[0][0].negativo;
  }
  else{
    neg = 1 + noticia[0][0].negativo;
  }

  conectado.query(`update noticias set positivo = "${pos}", negativo = "${neg}" where id = "${id}";`);
  conectado.release();
  response.sendStatus(200);
}



module.exports = {
  consultaNoticias,
  consultaNuevasNoticias,
  noticiaTema,
  consultaFecha,
  noticiaNueva,
  editarNoticia,
  borrarNoticia,
  votarNoticia
};
