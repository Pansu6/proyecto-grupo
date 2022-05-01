require("dotenv").config();

const { getConnection } = require("./conexion.js");

let conexion;

async function main() {
  try {
    conexion = await getConnection();

    await conexion.query("DROP TABLE IF EXISTS noticias");
    await conexion.query("DROP TABLE IF EXISTS usuarios");

    await conexion.query(`
      CREATE TABLE usuarios (
        id int auto_increment primary key,
        nombre varchar(30) unique not null,
        email varchar(32) unique,
        bio varchar(128),
        foto varchar(32),
        password varchar(128) not null);
    `);

    await conexion.query(`
      CREATE TABLE noticias (
        id int auto_increment primary key,
        id_usuario integer not null,
        titulo varchar(64) unique,
        fecha date,
        foto varchar(32),
        entradilla varchar(128),
        texto varchar(1024),
        tema varchar(32),
        positivo int default 0,
        negativo int default 0,
        editado bool default false);
        FOREIGN KEY (id_usuario) REFERENCES usuarios(id)
      );
    `);

    await conexion.query(`
      insert into usuarios values("javi", "javi@mail.es", "Moito", "javi.jpg", "1234");
      insert into usuarios values("joan", "joan@mail.es", "Pansu", "joan.jpg", "1234");
    `);
  } catch (error) {
    console.error(error);
  } finally {
    console.log("Todo hecho, liberando conexión");
    if (conexion) conexion.release();
    process.exit();
  }
}

main();
