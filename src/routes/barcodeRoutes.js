/**
 * API para o serviço de código de barras
 */
const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const { BarcodeService } = require('../services/barcodeService');

const router = express.Router();

// Configurar o armazenamento temporário de arquivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../temp/uploads');
    
    // Criar diretório se não existir
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Gerar nome de arquivo único baseado no timestamp
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const extension = path.extname(file.originalname);
    cb(null, `barcode-${uniqueSuffix}${extension}`);
  }
});

// Filtrar para apenas aceitar imagens
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Apenas imagens são suportadas!'), false);
  }
};

const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 5 * 1024 * 1024 // Limitar a 5MB
  }
});

/**
 * @route POST /api/barcode/decode
 * @desc Decodificar um código de barras a partir de uma imagem
 * @access Public
 */
router.post('/decode', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Nenhuma imagem enviada' });
    }
    
    const imageBuffer = fs.readFileSync(req.file.path);
    const barcode = await BarcodeService.decode(imageBuffer);
    
    // Limpar o arquivo temporário
    fs.unlinkSync(req.file.path);
    
    if (barcode) {
      return res.json({
        success: true,
        barcode: barcode
      });
    } else {
      return res.status(422).json({
        success: false,
        message: 'Não foi possível detectar um código de barras na imagem'
      });
    }
  } catch (error) {
    console.error('Erro ao processar código de barras:', error);
    return res.status(500).json({
      success: false,
      message: 'Erro ao processar a imagem',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

/**
 * @route GET /api/barcode/info/:barcode
 * @desc Obter informações sobre um código de barras
 * @access Public
 */
router.get('/info/:barcode', (req, res) => {
  const barcode = req.params.barcode;
  
  if (!barcode || !/^\d+$/.test(barcode)) {
    return res.status(400).json({
      success: false,
      message: 'Código de barras inválido'
    });
  }
  
  // Aqui você pode adicionar lógica para buscar informações sobre o código de barras
  // Por exemplo, consultar uma base de dados de produtos
  
  // Por enquanto, vamos apenas retornar informações básicas
  return res.json({
    success: true,
    barcode: barcode,
    type: barcode.length === 13 ? 'EAN-13' : barcode.length === 8 ? 'EAN-8' : 'UNKNOWN',
    isValid: validateChecksum(barcode)
  });
});

/**
 * Valida o checksum de um código de barras EAN
 * @param {string} barcode - O código de barras para validar
 * @returns {boolean} - Verdadeiro se o checksum estiver correto
 */
function validateChecksum(barcode) {
  if (!/^\d+$/.test(barcode)) {
    return false;
  }
  
  const digits = barcode.split('').map(Number);
  const checkDigit = digits.pop(); // Último dígito é o checksum
  
  // Para EAN-13 e EAN-8
  let sum = 0;
  digits.forEach((digit, index) => {
    // Para EAN, posições ímpares têm peso 1 e pares têm peso 3 (em ordem inversa)
    const weight = (index % 2 === 0) ? 1 : 3;
    sum += digit * weight;
  });
  
  const calculatedCheck = (10 - (sum % 10)) % 10;
  return calculatedCheck === checkDigit;
}

module.exports = router;
