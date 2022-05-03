const conexion = require("./conexion.js");

async function crearBD() {
  const conectado = await conexion.getConnection();
  try {
    await conectado.query("DROP TABLE IF EXISTS noticias;");
    await conectado.query("DROP TABLE IF EXISTS usuarios;");
    await conectado.query("DROP DATABASE IF EXISTS Noticias;");
    await conectado.query("CREATE DATABASE Noticias;");
    await conectado.query("USE Noticias;");

    await conectado.query(`
    CREATE table Usuarios(
        id int auto_increment primary key,
        nombre varchar(30) unique not null,
        email varchar(32) unique not null,
        bio varchar(128),
        foto varchar(32),
        pass varchar(128) not null);
    `);

    await conectado.query(`
    CREATE table Noticias(
        id int auto_increment,
        titulo varchar(64) unique not null,
        fecha date not null,
        foto varchar(32),
        entradilla varchar(128) not null,
        texto varchar(1024) not null,
        tema varchar(32) not null,
        positivo int default 0,
        negativo int default 0,
        editado bool default false,
        usuario int not null,
        primary key (id),
        foreign key (usuario) references usuarios(id));
    `);
  } catch (error) {
    console.error(error);
  } finally {
    if (conectado) conectado.release();
  }
}

module.exports = {
    crearBD
  };