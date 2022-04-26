const con = require("./data/conexion.js");

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
};
