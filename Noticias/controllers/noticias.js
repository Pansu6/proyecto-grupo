const con = require("../data/conexion");
const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);
const fechaHoy = hoy.toISOString().split("T")[0]; //dia de hoy en formato SQL

const consultaNoticias = async (request, response) => {
  //INICIO
  con.query(`select * from noticias order by fecha desc`, (error, result) => {
    if (error) throw error;
    response.send(result);
  });
};

const consultaNuevasNoticias = async (request, response) => {
  //PUNTO 1
  con.query(
    `select * from noticias where fecha = "${fechaHoy}" order by positivo desc`,
    (error, result) => {
      if (error) throw error;
      response.send(result);
    }
  );
};

const noticiasFecha = async (req, res) => {
  //punto 2

  const noticiasFecha = req.params.fecha;

  con.query(
    `select * from noticias where fecha = ${noticiasFecha}`,
    (error, result) => {
      if (error) throw error;
      res.send(result);
    }
  );
};

const consultaNoticiasTema = async (request, response) => {
  //PUNTO 3
  const temaNoticia = request.params.tema; //filtro en el body
  con.query(
    `select * from noticias where tema = "${temaNoticia}" order by fecha desc`,
    (error, result) => {
      if (error) throw error;
      response.send(result);
    }
  );
};

const crearArticulo = async (
  // Punto 6

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
  crearArticulo,
  noticiasFecha,
  consultaNoticiasTema,
  consultaNuevasNoticias,
  consultaNoticias,
};
