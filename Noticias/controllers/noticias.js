const conexion = require("../conexion.js");

const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);
const fechaHoy = hoy.toISOString().split("T")[0]; //dia de hoy en formato SQL

const consultaNoticias = async (request, response) => {
  //INICIO
  const conectado = await conexion.getConnection();
  const listaNoticias = await conectado.query(`select * from noticias order by fecha desc`);
  response.send(listaNoticias);
};

const consultaNuevasNoticias = async (request, response) => {
  //PUNTO 1
  const conectado = await conexion.getConnection();
  const listaNoticias = await conectado.query(`select * from noticias where fecha = "${fechaHoy}" order by fecha desc`);
  response.send(listaNoticias);
};

const consultaNoticiasFecha = async (request, response) => {
  //PUNTO 2
  const fechaNoticia = request.params.fecha;
  const conectado = await conexion.getConnection();
  const listaNoticias = await conectado.query(`select * from noticias where fecha = "${fechaNoticia}" order by positivo desc`);
  response.send(listaNoticias[0]);
};

const consultaNoticiasTema = async (request, response) => {
  //PUNTO 3
  const temaNoticia = request.params.tema; //filtro en el body
  const conectado = await conexion.getConnection();
  
  const listaNoticias = await conectado.query(`select * from noticias where tema = "${temaNoticia}" order by fecha desc`);

  response.send(listaNoticias);
};

const crearArticulo = async (
  // PUNTO 6
  titulo,
  fecha,
  foto,
  entradilla,
  texto,
  tema,
  positivo,
  negativo,
  editado,
  usuarioId,
  con
) => {
  try {
    await con.query(`
    insert into noticias(titulo, fecha, foto, entradilla, texto, tema, positivo, negativo, editado, userId) 
    values ("${titulo}","${fecha}", ${foto}, "${entradilla}", ${texto}, ${tema}, ${positivo}, ${negativo}, ${editado} ${usuarioId})
`);
  } catch (e) {
    console.log("[crearArticulo] ", e);
    throw new Error("database-error");
  }
};

module.exports = {
  consultaNoticias,
  consultaNuevasNoticias,
  consultaNoticiasFecha,
  consultaNoticiasTema,
  crearArticulo
};
