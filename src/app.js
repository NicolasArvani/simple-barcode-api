/**
 * Aplicação principal - Serviço de Código de Barras EAN13
 */
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();
const barcodeRoutes = require('./routes/barcodeRoutes');
const apiKeyAuth = require('./middleware/apiKeyAuth');

// Inicializar Express
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir arquivos estáticos da pasta public
app.use(express.static(path.join(__dirname, '../public')));

// Rota raiz - Página inicial simples (sem autenticação)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// Aplicar autenticação por API Key para as rotas da API
app.use('/api', apiKeyAuth);

// Rotas da API (protegidas por API Key)
app.use('/api/barcode', barcodeRoutes);

// Rota para verificar a API Key
app.get('/api/check-key', (req, res) => {
  res.json({
    success: true,
    message: 'API Key válida'
  });
});

// Tratamento de erros
app.use((err, req, res, next) => {
  console.error('Erro na aplicação:', err);
  res.status(500).json({
    success: false,
    message: 'Erro interno do servidor',
    error: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// Iniciar o servidor
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
    console.log(`Acesse: http://localhost:${PORT}`);
  });
}

module.exports = app;
