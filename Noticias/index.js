const bodyParser = require("body-parser");
const express = require("express");
const bcrypt = require("bcrypt");
const con = require("./data/conexion.js");

const app = express();
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const tiempoTranscurrido = Date.now();
const hoy = new Date(tiempoTranscurrido);
const fechaHoy = hoy.toISOString().split('T')[0]; //dia de hoy en formato SQL

const consultaNoticias = async (request, response) => { //INICIO
  con.query(`select * from noticias order by fecha desc`, (error, result) => {
      if (error) throw error;
      response.send(result);
  });
}

const consultaNuevasNoticias = async (request, response) => { //PUNTO 1
  con.query(`select * from noticias where fecha = "${fechaHoy}" order by positivo desc`, (error, result) => {
      if (error) throw error;
      response.send(result);
  });
}

const consultaNoticiasTema = async (request, response) => { //PUNTO 3
  const temaNoticia = request.params.tema; //filtro en el body
  con.query(`select * from noticias where tema = "${temaNoticia}" order by fecha desc`, (error, result) => {
      if (error) throw error;
      response.send(result);
  });
}

const registroUsuario = async (request, response) => {
  //post (user, pass) en el body
  const {nombre, pass} = request.body;
  bcrypt.hash(pass, 5, function (err, hash) {
    console.log(hash, nombre);
    // TODO: Store the hash in your password DB
  });
  response.send('ok');
}

const loginUsuario = (request, response) => {

}



app.get('/', consultaNoticias);

app.get('/noticiasdeldia', consultaNuevasNoticias);

app.get('/noticias/:tema', consultaNoticiasTema);

app.get('/registro', registroUsuario);

app.get('/usuarios', (request, response) => {
  con.query('SELECT * FROM usuarios', (error, result) => {
      if (error) throw error;
      response.send(result);
  });
});


app.listen(4000 , () => console.log("127.0.0.1:4000"));

