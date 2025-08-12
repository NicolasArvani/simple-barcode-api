const fs = require('fs');
const path = require('path');
const { BarcodeService } = require('../src/services/barcodeService');

// Função para testar uma imagem
async function testImage(imagePath) {
  console.log(`\nTestando imagem: ${path.basename(imagePath)}`);
  
  // O nome do arquivo é o código de barras esperado
  const expectedBarcode = path.basename(imagePath, path.extname(imagePath));
  
  console.log(`Código esperado: ${expectedBarcode}`);
  
  // Ler a imagem
  const imageBuffer = fs.readFileSync(imagePath);
  
  // Decodificar
  const result = await BarcodeService.decode(imageBuffer);
  
  console.log(`Código detectado: ${result || 'não detectado'}`);
  
  if (result === expectedBarcode) {
    console.log('✅ SUCESSO: Código de barras detectado corretamente!');
  } else {
    console.log('❌ FALHA: O código detectado não corresponde ao esperado.');
  }
  
  return result === expectedBarcode;
}

// Função principal
async function main() {
  const examplesDir = path.join(__dirname, '../examples');
  
  if (!fs.existsSync(examplesDir)) {
    console.error(`Diretório de exemplos não encontrado: ${examplesDir}`);
    process.exit(1);
  }
  
  // Listar todos os arquivos de imagem
  const files = fs.readdirSync(examplesDir)
    .filter(file => file.endsWith('.jpg') || file.endsWith('.png'));
  
  console.log(`Encontradas ${files.length} imagens para teste.`);
  
  let successCount = 0;
  
  for (const file of files) {
    const success = await testImage(path.join(examplesDir, file));
    if (success) successCount++;
  }
  
  console.log(`\nResultado: ${successCount} de ${files.length} imagens foram lidas corretamente.`);
}

main().catch(console.error);
