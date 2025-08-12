const { BarcodeService } = require('../src/services/barcodeService');
const fs = require('fs');
const path = require('path');

// Este arquivo é para testar manualmente o serviço de código de barras
// Exemplo de uso: node scripts/test-barcode.js examples/7898458174694.jpg

async function testBarcode(imagePath) {
  if (!fs.existsSync(imagePath)) {
    console.error(`Arquivo não encontrado: ${imagePath}`);
    return;
  }
  
  console.log(`Testando leitura de código de barras da imagem: ${imagePath}`);
  const expectedBarcode = path.basename(imagePath, path.extname(imagePath));
  console.log(`Código esperado (baseado no nome do arquivo): ${expectedBarcode}`);
  
  const imageBuffer = fs.readFileSync(imagePath);
  
  console.time('Tempo de decodificação');
  const barcode = await BarcodeService.decode(imageBuffer);
  console.timeEnd('Tempo de decodificação');
  
  console.log(`Código de barras detectado: ${barcode || 'Não detectado'}`);
  
  if (barcode === expectedBarcode) {
    console.log('✅ SUCESSO: O código de barras foi lido corretamente!');
  } else {
    console.log('❌ FALHA: O código de barras não corresponde ao esperado');
  }
}

// Processar argumentos da linha de comando
const args = process.argv.slice(2);
if (args.length === 0) {
  console.log('Uso: node scripts/test-barcode.js <caminho-para-imagem>');
  // Testar todos os arquivos na pasta examples se nenhum argumento for fornecido
  const examplesDir = path.join(__dirname, '../examples');
  fs.readdirSync(examplesDir)
    .filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'))
    .forEach(file => {
      const imagePath = path.join(examplesDir, file);
      testBarcode(imagePath);
    });
} else {
  testBarcode(args[0]);
}
