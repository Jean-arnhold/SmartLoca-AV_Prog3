// Este é o conteúdo que deve estar dentro de src/server.js
const express = require('express');
const cors = require('cors');
const db = require('./models');

const clienteRoutes = require('./routes/clienteRoutes');
const carroRoutes = require('./routes/carroRoutes');
const locacaoRoutes = require('./routes/locacaoRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.use('/api/clientes', clienteRoutes);
app.use('/api/carros', carroRoutes);
app.use('/api/locacoes', locacaoRoutes);

db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log('Conexão com o DB estabelecida e modelos sincronizados.');
  });
}).catch(err => {
  console.error('Não foi possível conectar ao banco de dados:', err);
});