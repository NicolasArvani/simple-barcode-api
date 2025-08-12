const assert = require('assert');
const path = require('path');
const fs = require('fs');
const { BarcodeService } = require('../src/services/barcodeService');

describe('Barcode Generation', function() {
  this.timeout(10000); // Aumentar timeout para 10 segundos
  
  // Lista de códigos de barras EAN13 válidos para testar
  const validBarcodes = [
    '5901234123457',
    '7891000100103',
    '7891025115649',
    '7896658100109',
    '7898458174694'
  ];

  // Testar que temos exemplos para cada código de barras
  it('deve ter imagens de exemplo para todos os códigos de barras de teste', function() {
    const examplesDir = path.join(__dirname, '../examples');
    const exampleFiles = fs.readdirSync(examplesDir);
    
    validBarcodes.forEach(barcode => {
      // Verificar se há pelo menos um arquivo que corresponde a este código de barras
      const matchingFiles = exampleFiles.filter(file => 
        file.startsWith(barcode) && (file.endsWith('.png') || file.endsWith('.jpg'))
      );
      
      assert.ok(matchingFiles.length > 0, `Nenhuma imagem encontrada para o código ${barcode}`);
    });
  });
  
  // Testar o serviço com imagens existentes
  validBarcodes.forEach(barcode => {
    it(`deve decodificar corretamente o código de barras ${barcode}`, async function() {
      const examplesDir = path.join(__dirname, '../examples');
      const exampleFiles = fs.readdirSync(examplesDir).filter(file => 
        file.startsWith(barcode) && (file.endsWith('.png') || file.endsWith('.jpg'))
      );
      
      assert.ok(exampleFiles.length > 0, `Nenhuma imagem encontrada para o código ${barcode}`);
      
      const examplePath = path.join(examplesDir, exampleFiles[0]);
      const imageBuffer = fs.readFileSync(examplePath);
      imageBuffer.path = examplePath;
      
      const result = await BarcodeService.decode(imageBuffer);
      assert.strictEqual(result, barcode);
    });
  });
  
  // Testar diferentes formatos de imagem (png vs jpg)
  it('deve funcionar com diferentes formatos de imagem', async function() {
    const examplesDir = path.join(__dirname, '../examples');
    const pngFile = fs.readdirSync(examplesDir).find(file => file.endsWith('.png'));
    const jpgFile = fs.readdirSync(examplesDir).find(file => file.endsWith('.jpg'));
    
    assert.ok(pngFile, 'Nenhum arquivo PNG encontrado');
    assert.ok(jpgFile, 'Nenhum arquivo JPG encontrado');
    
    const pngPath = path.join(examplesDir, pngFile);
    const jpgPath = path.join(examplesDir, jpgFile);
    
    const pngBuffer = fs.readFileSync(pngPath);
    pngBuffer.path = pngPath;
    const pngBarcode = await BarcodeService.decode(pngBuffer);
    assert.strictEqual(pngBarcode, path.basename(pngFile, '.png'));
    
    const jpgBuffer = fs.readFileSync(jpgPath);
    jpgBuffer.path = jpgPath;
    const jpgBarcode = await BarcodeService.decode(jpgBuffer);
    assert.strictEqual(jpgBarcode, path.basename(jpgFile, '.jpg'));
  });
});
