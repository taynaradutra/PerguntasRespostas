const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const PerguntaModel = require("./database/Pergunta");
const RespostaModel = require("./database/Resposta");
const Resposta = require("./database/Resposta");

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão efetuada!")
    })
    .catch((msgErro) => {
        console.log(msgErro)
    })

app.set('view engine', 'ejs');
app.use(express.static('public'));

// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

//Routes 
app.get("/", (req, res) => {
    //segundo parâmetro: lista de dados para usar no html
    // raw: trazer somente os dados
    PerguntaModel.findAll({
        raw: true, order: [
            ['id', 'DESC']
        ]
    }).then(perguntas => {
        res.render("index", {
            perguntas: perguntas
        });
    })
})

app.get("/perguntar", (req, res) => {
    res.render("perguntar");
})

app.post("/salvarpergunta", (req, res) => {
    PerguntaModel.create({
        titulo: req.body.titulo,
        descricao: req.body.descricao
    }).then(() => {
        res.redirect("/");
    }); // equivalente ao insert     
})

app.get("/pergunta/:id", (req, res) => {
    var id = req.params.id;
    PerguntaModel.findOne({
        where: { id: id }
    }).then(pergunta => {
        if (pergunta != undefined) {

            Resposta.findAll({
                where: { idPergunta: pergunta.id }, 
                order: [
                    ['id','DESC']
                ]
            }).then(respostas => {
                res.render("pergunta", {
                    pergunta: pergunta, 
                    respostas: respostas
                });
            });
        } else {
            res.redirect("/");
        }
    })
})

app.post("/responder", (req, res) => {
    RespostaModel.create({
        corpo: req.body.corpo,
        idPergunta: req.body.idPergunta
    }).then(() => {
        res.redirect("/pergunta/" + req.body.idPergunta);
    });
})

app.listen(3030, () => {
    console.log("App rodando!");
})