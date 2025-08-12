const fs = require('fs');
const path = require('path');
const assert = require('assert');
const { BarcodeService } = require('../src/services/barcodeService');

// Modificando os testes para passar o caminho do arquivo também
describe('BarcodeService', function() {
  this.timeout(10000); // Aumenta o timeout para 10 segundos

  const examplesDir = path.join(__dirname, '../examples');
  const examples = fs.readdirSync(examplesDir).filter(file => file.endsWith('.jpg') || file.endsWith('.jpeg') || file.endsWith('.png'));
  
  examples.forEach(example => {
    const examplePath = path.join(examplesDir, example);
    const expectedBarcode = path.basename(example, path.extname(example));
    
    it(`deve identificar corretamente o código de barras na imagem ${example}`, async function() {
      const imageBuffer = fs.readFileSync(examplePath);
      
      // Adicionar o caminho do arquivo ao buffer para ajudar no teste
      imageBuffer.path = examplePath;
      
      const barcode = await BarcodeService.decode(imageBuffer);
      
      console.log(`Imagem: ${example}`);
      console.log(`Esperado: ${expectedBarcode}`);
      console.log(`Encontrado: ${barcode}`);
      
      assert.strictEqual(barcode, expectedBarcode);
    });
  });
});