#!/usr/bin/env node

/**
 * Módulo para iniciar o servidor da API de código de barras
 */
require('dotenv').config();
const app = require('./src/app');
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
  console.log(`Acesse: http://localhost:${port}`);
});
