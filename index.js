require('dotenv').config()

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const Sequelize = require("sequelize");

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(__dirname+'/public'))

console.log(process.env.DB_NAME)

const sequelize = new Sequelize(
  process.env.DB_NAME, 
  process.env.DB_USER, 
  process.env.DB_PASS, {
    host: process.env.DB_HOST,
    dialect: "mysql"
});

sequelize.authenticate().then(function() {
  console.log("Conectado com sucesso!");
}).catch(function(erro) {
  console.log("Falha ao conectar: " + erro);
});

const Sensor = sequelize.define("sensors", {
  temperatura: {
    type: Sequelize.INTEGER
  },
  umidade: {
    type: Sequelize.INTEGER
  }
})

app.get("/cadastrar", function (req, res){
    const temperatura = req.query.temperatura;
    const umidade = req.query.umidade;

  Sensor.create({
    temperatura: temperatura,
    umidade: umidade
  })
    .then(() => {
      console.log("Dados cadastrados com sucesso!");
      res.redirect("/");
    })
    .catch(error => {
      console.error("Erro ao cadastrar os dados:", error);
      res.redirect("/");
    });
});

app.listen(process.env.PORT || 3000, function() {
  console.log(`Servidor rodando na porta ${process.env.PORT}`);
})
