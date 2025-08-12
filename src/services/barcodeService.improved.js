// Melhorias para o BarcodeService

const Quagga = require('@ericblade/quagga2');
const fs = require('fs');
const path = require('path');
const Jimp = require('jimp');

class BarcodeService {
  static async decode(imageBuffer) {
    try {
      // Cria um arquivo temporário para o Quagga
      const tmpFilePath = path.join(__dirname, '../../temp', `barcode-${Date.now()}.jpg`);
      
      // Certifique-se de que o diretório temp existe
      if (!fs.existsSync(path.join(__dirname, '../../temp'))) {
        fs.mkdirSync(path.join(__dirname, '../../temp'), { recursive: true });
      }
      
      // Primeiro, vamos tentar melhorar a imagem com Jimp
      const processedImageBuffer = await this.processImageWithJimp(imageBuffer);
      fs.writeFileSync(tmpFilePath, processedImageBuffer);
      
      // Tenta ler com diferentes configurações para aumentar a chance de sucesso
      const result = await this.attemptMultipleDecodes(tmpFilePath);
      
      // Remove o arquivo temporário
      try {
        fs.unlinkSync(tmpFilePath);
      } catch (e) {
        console.error('Erro ao remover arquivo temporário:', e);
      }
      
      return result;
    } catch (err) {
      console.error('Erro ao processar imagem:', err);
      return null;
    }
  }

  static async processImageWithJimp(imageBuffer) {
    try {
      const image = await Jimp.read(imageBuffer);
      
      // Aplicar uma série de transformações para melhorar a leitura do código de barras
      image
        .greyscale()         // Converter para escala de cinza
        .contrast(0.2)       // Aumentar o contraste
        .normalize()         // Normalizar os valores
        .brightness(0.1);    // Ajustar o brilho
      
      // Converter a imagem processada de volta para um buffer
      return await image.getBufferAsync(Jimp.MIME_JPEG);
    } catch (error) {
      console.error('Erro ao processar imagem com Jimp:', error);
      // Se falhar, retorna o buffer original
      return imageBuffer;
    }
  }
  
  static async attemptMultipleDecodes(filePath) {
    // Configurações diferentes para aumentar a chance de sucesso
    // Específico para códigos EAN13
    const configurations = [
      {
        readers: ['ean_reader'],
        locator: { patchSize: "medium" }
      },
      {
        readers: ['ean_13_reader'],
        locator: { patchSize: "large" }
      },
      {
        readers: ['ean_reader', 'ean_8_reader', 'upc_reader', 'upc_e_reader'],
        locator: { patchSize: "large" }
      },
      {
        readers: ['code_128_reader', 'code_39_reader', 'ean_reader'],
        locator: { patchSize: "small" }
      }
    ];
    
    for (const config of configurations) {
      try {
        const result = await this.decodeWithConfig(filePath, config);
        if (result) return result;
      } catch (err) {
        console.log(`Tentativa falhou com configuração:`, config);
      }
    }
    
    return null;
  }
  
  static decodeWithConfig(filePath, config) {
    return new Promise((resolve) => {
      Quagga.decodeSingle({
        src: filePath,
        numOfWorkers: 0,
        inputStream: {
          size: 1800  // Aumentar o tamanho para melhor detecção
        },
        decoder: {
          readers: config.readers,
          multiple: false
        },
        locate: true,
        locator: config.locator
      }, function(result) {
        if (result && result.codeResult) {
          resolve(result.codeResult.code);
        } else {
          resolve(null);
        }
      });
    });
  }
}

module.exports = { BarcodeService };
