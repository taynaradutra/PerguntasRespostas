const Sequelize = require("sequelize");
const connection = require("./database");

const Pergunta = connection.define('perguntas', {
    titulo:{
        type: Sequelize.STRING, // textos curtos
        allowNull: false
    }, 
    descricao: {
        type: Sequelize.TEXT,  // textos longos
        allowNull: false
    }
});

Pergunta.sync({force: false}) // force: não irá recriar a tabela caso ela já exista

module.exports = Pergunta;