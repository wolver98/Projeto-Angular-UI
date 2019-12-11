const express = require('express');
const app = express();

app.use(express.static(__dirname + '/dist')); // vai pegar o diretorio da aplicação em produção

app.get('/*', function(req, res) { // /* vai pegar em qualquer rota que tiver no servidor 
    res.sendFile(__dirname + '/dist/index.html'); 
});

app.listen(process.env.PORT || 4200); // Vai escutar na porta 4200 que eh padrao do angular  e pegar as variaveis de ambiente com process.env