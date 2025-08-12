require('dotenv').config();
const express = require('express');
const multer = require('multer');
const { BarcodeService } = require('./services/barcodeService');
const { apiKeyMiddleware } = require('./middlewares/apiKeyMiddleware');

const app = express();
const upload = multer({ storage: multer.memoryStorage() });

app.post('/barcode', apiKeyMiddleware, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ error: 'Imagem não enviada.' });
  }
  try {
    const barcode = await BarcodeService.decode(req.file.buffer);
    if (!barcode) {
      return res.status(422).json({ error: 'Código de barras não encontrado.' });
    }
    res.json({ barcode });
  } catch (err) {
    res.status(500).json({ error: 'Erro ao processar imagem.' });
  }
});

app.use((req, res) => {
  res.status(404).json({ error: 'Rota não encontrada.' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
